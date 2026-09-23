async function handleSOSClick() {
    const isConfirmed = confirm("🚨 CRITICAL WARNING: Trigger GLOBAL SOS?\n\nThis will alert the Base Commander and all Active Vehicles immediately.");
    if (!isConfirmed) return;

    try {
        const payload = {
            title: "GLOBAL DISTRESS SIGNAL",
            message: "SOS triggered manually from Global UI.",
            alertType: "SOS",
            severity: "EMERGENCY"
        };
        const res = await apiCall('/alerts/sos', 'POST', payload);
        if (res._offlineQueued) {
            alert("BLIZZARD MODE: Offline SOS logged. Will transmit upon VSAT link recovery.");
        } else {
            alert("✅ SOS Transmitted via STOMP / Satellite.");
        }
    } catch (e) {
        alert("Failed to send SOS: " + e.message);
    }
}

async function syncOfflineSOS() {
    // Left empty. The API.js online event listener automatically replays all offline requests.
    // This function exists to satisfy the global-ui.js existence check.
}

async function getOfflineSOS() {
    // Return empty array since api.js already uses getOfflineRequests() for the badge count.
    return [];
}