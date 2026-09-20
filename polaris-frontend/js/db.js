const DB_NAME = 'PolarisDB';
const DB_VERSION = 2; // Bumped to 2 for new stores
const SOS_STORE = 'sos_offline_queue';
const REQ_STORE = 'offline_requests';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(SOS_STORE)) {
                db.createObjectStore(SOS_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(REQ_STORE)) {
                db.createObjectStore(REQ_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ---------------- Generic Request Queue (Phase 3) ----------------

async function queueOfflineRequest(endpoint, method, data) {
    const db = await initDB();
    const payload = { endpoint, method, data, timestamp: new Date().toISOString() };
    return new Promise((resolve, reject) => {
        const tx = db.transaction(REQ_STORE, 'readwrite');
        tx.objectStore(REQ_STORE).add(payload);
        tx.oncomplete = () => {
            console.log(`[Blizzard Mode] Queued ${method} ${endpoint} for offline sync.`);
            resolve();
        };
        tx.onerror = () => reject(tx.error);
    });
}

async function getOfflineRequests() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(REQ_STORE, 'readonly');
        const request = tx.objectStore(REQ_STORE).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteOfflineRequest(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(REQ_STORE, 'readwrite');
        tx.objectStore(REQ_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ---------------- Legacy SOS Queue ----------------

async function addOfflineSOS(payload) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(SOS_STORE, 'readwrite');
        tx.objectStore(SOS_STORE).add(payload);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function getOfflineSOS() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(SOS_STORE, 'readonly');
        const request = tx.objectStore(SOS_STORE).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteOfflineSOS(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(SOS_STORE, 'readwrite');
        tx.objectStore(SOS_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}
