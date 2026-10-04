const fs = require('fs');

let appJS = fs.readFileSync('js/app.js', 'utf8');

// Inject the global online/offline event listeners at the end of app.js
const networkListeners = `
// --- NATIVE BROWSER OFFLINE DETECTION ---
window.addEventListener('offline', () => {
    if (window.GlobalUI) window.GlobalUI.showToast('SYSTEM ALERT: Hardware Network Disconnected', 'error');
    if (typeof window.severUplink === 'function') {
        window.severUplink();
    }
});

window.addEventListener('online', () => {
    if (window.GlobalUI) window.GlobalUI.showToast('SYSTEM ALERT: Hardware Network Restored', 'success');
    if (typeof window.restoreUplink === 'function') {
        // Automatically start syncing
        window.restoreUplink();
    }
});
`;

appJS += '\n' + networkListeners + '\n';

fs.writeFileSync('js/app.js', appJS);
console.log("Added native offline/online event listeners to app.js!");
