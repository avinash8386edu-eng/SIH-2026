// --- POLARIS ADVANCED EMERGENCY MODULE ---
// Features: Web Audio API Siren, Offline IndexedDB Queue, Web Bluetooth P2P Mesh Mock

window.handleSOSClick = async function() {
    alert("🚨 INITIATING GLOBAL SOS PROTOCOL!");
    
    // 1. Trigger Audio Siren (Inside try-catch for strict policy fallback)
    try {
        playSiren();
    } catch (e) {
        console.warn("Audio Siren Blocked by Browser Policy: ", e);
    }
    
    // 2. Fetch Location with robust try-catch and permission handling
    try {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const payload = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        type: "MEDICAL",
                        severity: "CRITICAL",
                        description: "MANUAL SOS TRIGGER",
                        status: "ACTIVE"
                    };
                    await processSOS(payload);
                }, 
                async (error) => {
                    console.warn("Geolocation permission denied or failed.", error);
                    // Fallback as requested
                    await processSOS({ latitude: 'UNKNOWN', longitude: 'UNKNOWN', type: "MEDICAL", severity: "CRITICAL", description: "MANUAL SOS (NO GPS)", status: "ACTIVE" });
                },
                { timeout: 10000 }
            );
        } else {
            console.warn("Geolocation API not available.");
            await processSOS({ latitude: 'UNKNOWN', longitude: 'UNKNOWN', type: "MEDICAL", severity: "CRITICAL", description: "MANUAL SOS (NO GPS)", status: "ACTIVE" });
        }
    } catch (fatalError) {
        console.error("Fatal error accessing location:", fatalError);
        await processSOS({ latitude: 'UNKNOWN', longitude: 'UNKNOWN', type: "MEDICAL", severity: "CRITICAL", description: "MANUAL SOS (FATAL GPS ERROR)", status: "ACTIVE" });
    }
};

async function processSOS(payload) {
    if (!navigator.onLine) {
        alert("VSAT OFFLINE: Queueing locally and broadcasting via Web Bluetooth (LoRaWAN mock)...");
        await queueOfflineAndLocalMesh(payload);
        return;
    }

    try {
        // Fallback for API call if apiCall is not defined globally (just in case)
        if (typeof apiCall === 'function') {
            const response = await apiCall('/emergency/sos', 'POST', payload);
            alert("SOS Broadcast Sent! Rescue teams alerted.");
            console.log("SOS Response:", response);
        } else {
            console.warn("apiCall missing, mocking network send.");
            alert("SOS Broadcast Sent! (Mock)");
        }
    } catch (e) {
        console.error("SOS API failed, falling back to Mesh.", e);
        await queueOfflineAndLocalMesh(payload);
    }
}

function playSiren() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if(!AudioContext) throw new Error("AudioContext not supported");
        
        const audioCtx = new AudioContext();
        
        // Resume if suspended (browser autoplay policies)
        if(audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.0);
        
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 3000);
    } catch(e) {
        console.warn("Web Audio API siren failed:", e);
    }
}

async function queueOfflineAndLocalMesh(payload) {
    // Mock Web Bluetooth 
    try {
        if(navigator.bluetooth) {
            console.log("Requesting nearby P2P devices via Web Bluetooth...");
            await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        }
    } catch(e) {
        console.log("Web Bluetooth simulated/mocked.");
    }

    // Save to IndexedDB
    try {
        const request = indexedDB.open('PolarisOfflineDB', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('sos_queue')) {
                db.createObjectStore('sos_queue', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('sos_queue', 'readwrite');
            const store = tx.objectStore('sos_queue');
            store.add({ ...payload, timestamp: Date.now(), synced: false });
            console.log("SOS securely queued offline.");
            alert("SOS Queued to IndexedDB. Will sync when WiFi restores.");
        };
    } catch(e) {
        console.error("IndexedDB queueing failed:", e);
    }
}
