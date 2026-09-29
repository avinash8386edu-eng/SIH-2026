// websocket.js - Handles Real-Time Emergency Alerts via STOMP/SockJS
let stompClient = null;

function connectWebSocket() {
    // Only connect if we have a token (user is logged in)
    if (!localStorage.getItem('jwt')) return;

    const socket = new SockJS('http://localhost:8080/ws-emergency');
    stompClient = Stomp.over(socket);
    
    // Disable debug logging to keep console clean
    stompClient.debug = null;

    stompClient.connect({}, function (frame) {
        console.log('📡 Connected to WebSocket: ' + frame);
        
        // Subscribe to global alerts topic
        stompClient.subscribe('/topic/alerts', function (message) {
            const alertData = JSON.parse(message.body);
            showEmergencyPopup(alertData);
        });

        // Subscribe to live telemetry tracking topic
        stompClient.subscribe('/topic/telemetry', function (message) {
            const telemetryData = JSON.parse(message.body);
            // Dispatch a custom event so satellite.js can move the markers
            window.dispatchEvent(new CustomEvent('polaris-telemetry', { detail: telemetryData }));
        });
    }, function(error) {
        console.error('WebSocket Error:', error);
        // Attempt to reconnect after 5 seconds if disconnected
        setTimeout(connectWebSocket, 5000);
    });
}

function showEmergencyPopup(alertData) {
    // Check if popup already exists, if not create it
    let popup = document.getElementById('global-emergency-popup');
    
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'global-emergency-popup';
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100vw';
        popup.style.height = '100vh';
        popup.style.backgroundColor = 'rgba(231, 76, 60, 0.9)'; // Deep red overlay
        popup.style.color = 'white';
        popup.style.zIndex = '999999';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.textAlign = 'center';
        popup.style.padding = '20px';
        document.body.appendChild(popup);
    }
    
    // Play an alarm sound if browser allows
    try {
        let audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.loop = true;
        audio.play().catch(e => console.warn("Audio autoplay blocked by browser", e));
        popup.dataset.audioPlaying = true;
        popup._audio = audio;
    } catch(e) {}

    popup.innerHTML = `
        <h1 style="font-size: 5rem; margin-bottom: 20px;">🚨 ${alertData.title || 'SOS EMERGENCY'} 🚨</h1>
        <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Type: ${alertData.alertType} | Severity: ${alertData.severity}</h2>
        <p style="font-size: 2rem; margin-bottom: 40px; max-width: 800px;">${alertData.message || ''}</p>
        <button onclick="dismissEmergencyPopup()" style="
            padding: 20px 40px; 
            font-size: 2rem; 
            background: white; 
            color: #C0392B; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer; 
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        ">Acknowledge & Dismiss</button>
    `;
    
    popup.style.display = 'flex';
}

window.dismissEmergencyPopup = function() {
    const popup = document.getElementById('global-emergency-popup');
    if (popup) {
        if (popup._audio) {
            popup._audio.pause();
            popup._audio = null;
        }
        popup.style.display = 'none';
    }
}

// Connect automatically when the script loads
connectWebSocket();
