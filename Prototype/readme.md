# POLARIS Offline-Sync Demo — How to Run It

This is a working, minimal version of the offline system from the architecture doc:
one field-device page, one base-camp server, connected over your Wi-Fi LAN.

## What's in here
```
polaris-offline-demo/
├── backend/
│   ├── server.js         # runs on your laptop — the "Base Camp Server"
│   └── package.json
└── frontend/
    ├── index.html         # the "Field Device" page
    ├── style.css
    └── app.js             # IndexedDB storage + sync manager (the real logic)
```

## 1. Start the server on your laptop
```bash
cd backend
npm install
npm start
```
You'll see something like:
```
Local:   http://localhost:3000
On LAN:  http://<this-machine's-LAN-IP>:3000
```
Find your laptop's actual LAN IP:
- Windows: `ipconfig` → look for "IPv4 Address" under your Wi-Fi adapter
- Mac/Linux: `ifconfig` or `ip addr` → look for something like `192.168.x.x`

## 2. Open the field device page
Easiest: just double-click `frontend/index.html` to open it in a browser.

To test from a **second device** (phone, another laptop) on the same Wi-Fi,
serve the frontend folder instead of opening it directly:
```bash
cd frontend
npx serve -l 8080
```
Then on the other device, visit `http://<laptop-LAN-IP>:8080`.

## 3. Point the field device at your server
In the "Base Camp Server" box at the top of the page, enter your laptop's
LAN address (e.g. `http://192.168.1.14:3000`) and click **Set**.
The status dot should turn green: "ONLINE — camp server reachable."

## 4. Try it online first
Log a few events (Fuel Consumed, Checkpoint Reached, etc.) with the form.
Watch them appear in the Event Queue as `PENDING` → `SYNCING` → `SYNCED`.
Open `http://<laptop-IP>:3000/api/events` in a browser to watch data land
on the laptop in real time.

## 5. Now go offline
Click **Switch to Offline Mode**. This simulates walking out of camp Wi-Fi
range without you needing two physical networks to test it.
Log more events — they'll sit as `PENDING` in IndexedDB, stored locally on
the device, and nothing will be sent.

## 6. Come back online
Click **Switch to Online Mode**. Within a few seconds, the sync manager
detects the server is reachable again and automatically pushes every
queued event, oldest-first (SOS events, if any, always jump the queue).
Watch them flip to `SYNCED` and appear on `/api/events`.

## What to point out in a demo
- Data never lives only in memory — it's in IndexedDB, so even closing the
  browser tab while offline doesn't lose anything (try it).
- The device doesn't just trust `navigator.onLine` — it also pings
  `/api/health` on the actual server before attempting a sync, so a Wi-Fi
  connection with no server behind it doesn't get treated as "online."
- Every event has a unique ID; syncing the same event twice (e.g. after a
  retry) doesn't create a duplicate — the server acknowledges it as already
  received.
- SOS events retry much faster than normal events and always sync first.

## Wiring this into the real POLARIS backend later
`server.js` deliberately mirrors the endpoint shapes from the full
architecture doc (`/api/health`, `/api/sync/event`) so you can swap this
Node stub for the real Spring Boot Base Camp Server without changing
`app.js` at all — just point `serverUrl` at the new backend.

Launching python server: python -m http.server 8080 --bind 0.0.0.0