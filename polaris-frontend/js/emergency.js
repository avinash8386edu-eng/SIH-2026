let stompClient = null;

document.addEventListener('DOMContentLoaded', () => {
    const sosBtn = document.getElementById('sosBtn');
    if (sosBtn) {
        sosBtn.addEventListener('click', handleSOSClick);
    }
    
    // Automatically sync when internet is restored
    window.addEventListener('online', syncOfflineSOS);
    
    // Connect to WebSocket feed
    connectWebSocket();
});

function handleSOSClick() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => sendSOS(position.coords.latitude, position.coords.longitude),
            (error) => sendSOS(null, null) // Proceed even if GPS fails
        );
    } else {
        sendSOS(null, null);
    }
}

async function sendSOS(lat, lng) {
    const payload = {
        latitude: lat,
        longitude: lng,
        type: 'CRITICAL',
        reportedBy: 1, // Usually pulled from active user context
        description: 'EMERGENCY SOS TRIGGERED',
        timestamp: new Date().toISOString()
    };

    if (navigator.onLine) {
        try {
            await apiCall('/emergency/sos', 'POST', payload);
            alert("🚨 SOS Broadcasted Successfully to Command Center!");
        } catch (e) {
            console.error("SOS API failed, falling back to IndexedDB", e);
            queueOffline(payload);
        }
    } else {
        queueOffline(payload);
    }
}

async function queueOffline(payload) {
    payload.offlineQueued = true;
    try {
        await addOfflineSOS(payload); // from db.js
        alert('⚠️ Network Offline. SOS securely queued in IndexedDB. It will sync automatically.');
    } catch (e) {
        console.error("Failed to save to IndexedDB", e);
        alert('CRITICAL: Failed to queue SOS offline.');
    }
}

async function syncOfflineSOS() {
    console.log("🌐 Network Restored! Syncing IndexedDB SOS queue...");
    try {
        const queue = await getOfflineSOS(); // from db.js
        if (queue.length === 0) return;

        for (let i = 0; i < queue.length; i++) {
            const item = queue[i];
            try {
                await apiCall('/emergency/sos', 'POST', item);
                await deleteOfflineSOS(item.id); // Remove from DB after successful sync
                console.log(`✅ Synced offline SOS record ID: ${item.id}`);
            } catch (e) {
                console.error(`❌ Sync failed for SOS record ID: ${item.id}. Aborting sequence.`, e);
                break; // Stop syncing if connection drops again
            }
        }
    } catch(e) {
        console.error("Error reading IndexedDB during sync", e);
    }
}

function connectWebSocket() {
    if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
        console.warn("WebSocket libraries missing.");
        return;
    }

    const socket = new SockJS('http://localhost:8080/ws-emergency');
    stompClient = Stomp.over(socket);
    stompClient.debug = null; 

    stompClient.connect({}, (frame) => {
        console.log("Connected to POLARIS Real-time Feed");
        stompClient.subscribe('/topic/sos', (message) => {
            const data = JSON.parse(message.body);
            // Display visual real-time toast
            const alertDiv = document.createElement('div');
            alertDiv.style = "position:fixed; top:20px; right:20px; background:#E74C3C; color:white; padding:20px; border-radius:8px; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.5);";
            alertDiv.innerHTML = `<h3>🚨 INCOMING SOS!</h3><p>Type: ${data.type}</p><p>Location: ${data.latitude || 'N/A'}, ${data.longitude || 'N/A'}</p>`;
            document.body.appendChild(alertDiv);
            setTimeout(() => { if (document.body.contains(alertDiv)) document.body.removeChild(alertDiv); }, 10000);
        });
    }, (error) => {
        console.error("STOMP connection error", error);
    });
}
