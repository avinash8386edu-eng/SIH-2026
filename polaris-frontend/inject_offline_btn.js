const fs = require('fs');

let indexHTML = fs.readFileSync('index.html', 'utf8');

const buttonStr = `
                    <button id="btn-toggle-offline" style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 5px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 10px; font-weight: bold; cursor: pointer; letter-spacing: 1px;"><i class="fa-solid fa-power-off"></i> DEMO OFFLINE MODE</button>
                    <i class="fa-regular fa-bell" style="color:#777; margin:0 20px;"></i>
`;

indexHTML = indexHTML.replace('<i class="fa-regular fa-bell" style="color:#777; margin:0 20px;"></i>', buttonStr);

// The logic inside index.html for offline:
const offlineLogic = `
    function toggleOfflineDemo() {
        isOffline = !isOffline;
        if(isOffline) {
            // Offline State
            mainBadge.style.background = 'rgba(255, 0, 60, 0.05)';
            mainBadge.style.borderColor = 'rgba(255, 0, 60, 0.3)';
            mainBadge.style.color = '#FF003C';
            statusText.innerText = 'AIRGAPPED (LOCAL)';
            satIcon.className = 'fa-solid fa-triangle-exclamation';
            satIcon.style.animation = 'none';
            
            pendingCount = Math.floor(Math.random() * 8) + 2; 
            pendingBadge.style.display = 'inline-block';
            pendingBadge.innerText = pendingCount + ' PENDING';
            
            pulseDot.style.background = '#FF003C';
            pulseDot.style.boxShadow = '0 0 8px #FF003C';
            pulseDot.style.animation = 'none';
            latencyText.innerText = 'ERR_CONN';
            latencyText.style.color = '#FF003C';
            bandwidthText.innerText = '0 kbps';

            document.getElementById('btn-toggle-offline').innerHTML = '<i class="fa-solid fa-satellite-dish"></i> RECONNECT SAT-LINK';
            document.getElementById('btn-toggle-offline').style.borderColor = '#00FF66';
            document.getElementById('btn-toggle-offline').style.color = '#00FF66';
            document.getElementById('btn-toggle-offline').style.background = 'rgba(0, 255, 102, 0.1)';
            
            if(window.GlobalUI) window.GlobalUI.showToast('SAT-LINK Severed. Switched to offline database.', 'error');
            
        } else {
            // Online State
            mainBadge.style.background = 'rgba(0, 255, 102, 0.05)';
            mainBadge.style.borderColor = 'rgba(0, 255, 102, 0.3)';
            mainBadge.style.color = '#00FF66';
            statusText.innerText = 'SAT-LINK: ACTIVE';
            satIcon.className = 'fa-solid fa-satellite-dish';
            satIcon.style.animation = 'pulse 2s infinite';
            
            pendingBadge.style.display = 'none';
            pendingCount = 0;
            
            pulseDot.style.background = '#00FF66';
            pulseDot.style.boxShadow = '0 0 8px #00FF66';
            pulseDot.style.animation = 'pulse 1s infinite';
            latencyText.innerText = '650ms';
            latencyText.style.color = '#00E5FF';
            bandwidthText.innerText = '256 kbps Tx';
            document.getElementById('sat-last-sync').innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';

            document.getElementById('btn-toggle-offline').innerHTML = '<i class="fa-solid fa-power-off"></i> DEMO OFFLINE MODE';
            document.getElementById('btn-toggle-offline').style.borderColor = '#FF003C';
            document.getElementById('btn-toggle-offline').style.color = '#FF003C';
            document.getElementById('btn-toggle-offline').style.background = 'rgba(255, 0, 60, 0.1)';

            if(window.GlobalUI) window.GlobalUI.showToast('SAT-LINK Restored. Uploading pending records...', 'success');
        }
    }

    document.getElementById('btn-toggle-offline').addEventListener('click', toggleOfflineDemo);
`;

// Inject this logic right after `let pendingCount = 0;` inside the DOMContentLoaded callback
indexHTML = indexHTML.replace(
    /let pendingCount = 0;\s*document\.addEventListener\('keydown', \(e\) => {/s,
    `let pendingCount = 0;\n${offlineLogic}\n    document.addEventListener('keydown', (e) => {`
);

// But wait, the keydown logic actually re-duplicates the stuff. Let's just make the keydown logic call toggleOfflineDemo()
indexHTML = indexHTML.replace(
    /document\.addEventListener\('keydown', \(e\) => {[\s\S]*?if\(e\.key\.toLowerCase\(\) === 'o' && e\.altKey\) {[\s\S]*?isOffline = !isOffline;[\s\S]*?}[\s\S]*?}[\s\S]*?}\);/s,
    `document.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase() === 'o' && e.altKey) {
            toggleOfflineDemo();
        }
    });`
);

fs.writeFileSync('index.html', indexHTML);
console.log("Offline Demo Button added to index.html successfully!");
