// POLARIS Base Camp Server — minimal LAN demo backend
// Mirrors the eventual Spring Boot contract (/api/health, /api/sync/event)
// so the frontend code doesn't have to change when you swap this out later.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'events.json');

app.use(cors());               // allow requests from any device on the LAN
app.use(express.json());

// --- simple file-backed "database" so data survives a server restart ---
function loadEvents() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveEvents(events) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}

let events = loadEvents();

// --- health check: field device pings this to decide if the camp server is reachable ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'POLARIS Base Camp Server', time: new Date().toISOString() });
});

// --- receive a synced event from a field device ---
app.post('/api/sync/event', (req, res) => {
  const { eventId, type, payload, deviceId, timestamp } = req.body;

  if (!eventId || !type) {
    return res.status(400).json({ error: 'eventId and type are required' });
  }

  // deduplication: if we've already seen this eventId, just re-ACK it.
  // This is what makes retries safe if a device syncs the same event twice.
  const existing = events.find(e => e.eventId === eventId);
  if (existing) {
    return res.status(200).json({ status: 'ACK', eventId, duplicate: true });
  }

  const record = {
    eventId,
    type,
    payload: payload || {},
    deviceId: deviceId || 'unknown-device',
    timestamp: timestamp || new Date().toISOString(),
    receivedAt: new Date().toISOString()
  };

  events.push(record);
  saveEvents(events);

  console.log(`[SYNCED] ${record.type} from ${record.deviceId} (${record.eventId})`);

  res.status(200).json({ status: 'ACK', eventId });
});

// --- view everything the camp server has received (open this in a browser to watch data arrive) ---
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`POLARIS Base Camp Server running.`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`On LAN:  http://<this-machine's-LAN-IP>:${PORT}  (find it with ipconfig / ifconfig)`);
  console.log(`Watch incoming data at:  http://<LAN-IP>:${PORT}/api/events`);
});