// POLARIS Field Device — offline-first demo
//
// Flow:
//   1. Every logged event is written to IndexedDB immediately, status = PENDING.
//   2. A sync loop runs on an interval. If the device is "online" (real network
//      AND not manually forced offline) AND the base camp server responds to a
//      health check, it pushes all PENDING events over the network.
//   3. Each event only flips to SYNCED after the server sends back an ACK.
//   4. The "Switch to Offline Mode" button simulates walking out of camp Wi-Fi
//      range, so you can demo the whole thing on a single device. It sits on
//      top of the real navigator.onLine check, not instead of it.

const DB_NAME = 'polarisFieldDB';
const DB_VERSION = 1;
const STORE_NAME = 'events';
const SYNC_INTERVAL_MS = 4000;
const SOS_RETRY_INTERVAL_MS = 2000;

let db = null;
let serverUrl = document.getElementById('serverUrl').value.trim();
let manualOfflineMode = false;
let syncInFlight = false;

// ---------- IndexedDB setup ----------

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'eventId' });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function addEventToStore(record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(record);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

function updateEventInStore(record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

function getAllEvents() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// ---------- Connectivity ----------

function isEffectivelyOnline() {
  return navigator.onLine && !manualOfflineMode;
}

async function checkServerHealth() {
  if (!isEffectivelyOnline()) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${serverUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    return false;
  }
}

async function refreshStatusIndicator() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');

  if (!isEffectivelyOnline()) {
    dot.className = 'status-dot offline';
    text.textContent = manualOfflineMode
      ? 'OFFLINE (manual) — out of camp range'
      : 'OFFLINE — no network';
    return;
  }

  const healthy = await checkServerHealth();
  if (healthy) {
    dot.className = 'status-dot online';
    text.textContent = 'ONLINE — camp server reachable';
  } else {
    dot.className = 'status-dot offline';
    text.textContent = 'ONLINE but camp server unreachable';
  }
}

// ---------- Sync manager ----------

async function syncPendingEvents() {
  if (syncInFlight) return;
  if (!isEffectivelyOnline()) return;

  const healthy = await checkServerHealth();
  if (!healthy) return;

  syncInFlight = true;
  try {
    const all = await getAllEvents();
    // SOS events go first, then oldest first
    const pending = all
      .filter(e => e.status === 'PENDING' || e.status === 'FAILED')
      .sort((a, b) => {
        if (a.type === 'SOS' && b.type !== 'SOS') return -1;
        if (b.type === 'SOS' && a.type !== 'SOS') return 1;
        return a.timestamp - b.timestamp;
      });

    for (const record of pending) {
      await pushEvent(record);
    }
  } finally {
    syncInFlight = false;
    renderEventList();
  }
}

async function pushEvent(record) {
  record.status = 'SYNCING';
  await updateEventInStore(record);
  renderEventList();

  try {
    const res = await fetch(`${serverUrl}/api/sync/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: record.eventId,
        type: record.type,
        payload: { note: record.note },
        deviceId: 'field-device-demo',
        timestamp: new Date(record.timestamp).toISOString()
      })
    });

    if (res.ok) {
      record.status = 'SYNCED';
      logActivity(`Synced: ${record.type} (${record.eventId.slice(0, 8)})`);
    } else {
      record.status = 'FAILED';
      logActivity(`Rejected by server: ${record.type} — status ${res.status}`);
    }
  } catch (err) {
    record.status = 'FAILED';
    logActivity(`Sync failed (network drop mid-transfer): ${record.type}`);
  }

  await updateEventInStore(record);
}

// ---------- UI rendering ----------

async function renderEventList() {
  const all = await getAllEvents();
  all.sort((a, b) => b.timestamp - a.timestamp);

  const list = document.getElementById('eventList');
  list.innerHTML = '';

  let pendingCount = 0;
  let syncedCount = 0;

  for (const record of all) {
    if (record.status === 'PENDING' || record.status === 'SYNCING' || record.status === 'FAILED') pendingCount++;
    if (record.status === 'SYNCED') syncedCount++;

    const li = document.createElement('li');
    li.className = 'event-item' + (record.type === 'SOS' ? ' sos' : '');

    const meta = document.createElement('div');
    meta.className = 'event-meta';
    meta.innerHTML = `
      <span class="event-type">${formatType(record.type)}</span>
      <span class="event-note">${record.note || ''}</span>
    `;

    const badge = document.createElement('span');
    badge.className = `badge ${record.status.toLowerCase()}`;
    badge.textContent = record.status;

    li.appendChild(meta);
    li.appendChild(badge);
    list.appendChild(li);
  }

  document.getElementById('pendingCount').textContent = pendingCount;
  document.getElementById('syncedCount').textContent = syncedCount;
}

function formatType(type) {
  const map = {
    FUEL_CONSUMED: 'Fuel Consumed',
    CHECKPOINT_REACHED: 'Checkpoint Reached',
    ASSET_DAMAGED: 'Asset Damaged',
    CARGO_UPDATE: 'Cargo Update',
    SOS: 'SOS — EMERGENCY'
  };
  return map[type] || type;
}

function logActivity(message) {
  const log = document.getElementById('activityLog');
  const line = document.createElement('div');
  const time = new Date().toLocaleTimeString();
  line.textContent = `[${time}] ${message}`;
  log.appendChild(line);
}

// ---------- Event handlers ----------

document.getElementById('saveUrlBtn').addEventListener('click', () => {
  serverUrl = document.getElementById('serverUrl').value.trim().replace(/\/$/, '');
  logActivity(`Base camp server set to ${serverUrl}`);
  refreshStatusIndicator();
});

document.getElementById('modeToggleBtn').addEventListener('click', (e) => {
  manualOfflineMode = !manualOfflineMode;
  const btn = e.target;
  if (manualOfflineMode) {
    btn.textContent = 'Switch to Online Mode';
    btn.classList.add('offline-active');
    logActivity('Manually switched to OFFLINE mode — simulating out of camp range');
  } else {
    btn.textContent = 'Switch to Offline Mode';
    btn.classList.remove('offline-active');
    logActivity('Back ONLINE — attempting to sync queued events');
    syncPendingEvents();
  }
  refreshStatusIndicator();
});

document.getElementById('submitEventBtn').addEventListener('click', async () => {
  const type = document.getElementById('eventType').value;
  const note = document.getElementById('eventNote').value.trim();

  const eventId = (crypto.randomUUID)
  ? crypto.randomUUID()
  : 'event-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);

const record = {
  eventId,
  type,
  note,
  status: 'PENDING',
  timestamp: Date.now()
};

  await addEventToStore(record);
  document.getElementById('eventNote').value = '';
  logActivity(`Logged locally: ${formatType(type)}${note ? ' — ' + note : ''}`);
  renderEventList();

  if (type === 'SOS') {
    // SOS gets its own fast retry loop instead of waiting for the normal interval
    attemptSosDelivery(record.eventId);
  } else {
    syncPendingEvents();
  }
});

async function attemptSosDelivery(eventId) {
  const tryOnce = async () => {
    const all = await getAllEvents();
    const record = all.find(e => e.eventId === eventId);
    if (!record || record.status === 'SYNCED') return; // done, stop retrying

    if (isEffectivelyOnline() && await checkServerHealth()) {
      await pushEvent(record);
      renderEventList();
    }

    const stillPending = (await getAllEvents()).find(e => e.eventId === eventId);
    if (stillPending && stillPending.status !== 'SYNCED') {
      setTimeout(tryOnce, SOS_RETRY_INTERVAL_MS);
    }
  };
  tryOnce();
}

// ---------- Browser online/offline listeners ----------

window.addEventListener('online', () => {
  logActivity('Network connection detected by browser');
  refreshStatusIndicator();
  syncPendingEvents();
});

window.addEventListener('offline', () => {
  logActivity('Network connection lost');
  refreshStatusIndicator();
});

// ---------- Init ----------

(async function init() {
  db = await openDatabase();
  await renderEventList();
  await refreshStatusIndicator();
  logActivity('Field device initialized');

  setInterval(refreshStatusIndicator, SYNC_INTERVAL_MS);
  setInterval(syncPendingEvents, SYNC_INTERVAL_MS);
})();