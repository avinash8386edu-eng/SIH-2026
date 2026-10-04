const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

// 1. Remove the Demo Controls box from #data-sync view
const demoBoxRegex = /<!-- CONTROLS -->[\s\S]*?Use these controls to demonstrate offline-first architecture[^<]*<\/p>\s*<\/div>/g;
appJS = appJS.replace(demoBoxRegex, '');

// 2. Fix severUplink and restoreUplink so they update global state even if #data-sync is not active
const newSeverUplink = `window.severUplink = function() {
    // 1. Global State Update
    window.isOffline = true;
    const mainBadge = document.getElementById('sat-badge-main');
    if(mainBadge) {
        mainBadge.style.background = 'rgba(255, 0, 60, 0.05)';
        mainBadge.style.borderColor = 'rgba(255, 0, 60, 0.3)';
        mainBadge.style.color = '#FF003C';
        document.getElementById('sat-status-text').innerText = 'AIRGAPPED (LOCAL)';
        document.getElementById('sat-icon').className = 'fa-solid fa-triangle-exclamation';
        document.getElementById('sat-icon').style.animation = 'none';
    }

    // 2. View-specific update (if #data-sync is active)
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    
    if(radar) {
        radar.style.borderColor = '#FF003C';
        radar.style.animation = 'none';
        icon.style.color = '#FF003C';
        icon.style.textShadow = '0 0 20px rgba(255,0,60,0.8)';
        icon.className = 'fa-solid fa-triangle-exclamation';
        
        statusText.innerText = 'AIRGAPPED (LOCAL)';
        statusText.style.color = '#FF003C';
        bandwidth.innerText = 'Bandwidth: 0 kbps (Connection Lost)';
        
        terminal.innerHTML += '<div style="color:#FF003C; margin-top:10px;">[NETWORK] Hardware Disconnected. Switching to local IndexedDB.</div>';
    }

    // Start generating fake offline data mutations globally
    if(window.syncOfflineInterval) clearInterval(window.syncOfflineInterval);
    
    const fakeEvents = [
        "Updated Inventory: Maitri Station Rations (-15kg)",
        "Cargo Scanned: Medical Kit MK-4 (Chain of Custody logged)",
        "Personnel Movement: Dr. Sharma boarded TRV-04",
        "Maintenance Logged: Generator 3 Oil Pressure Check",
        "Asset Assignment: PistenBully PB-02 to Ice Shelf Depot"
    ];
    
    window.syncOfflineInterval = setInterval(() => {
        window.syncPendingCount++;
        
        // Update top badge
        const pendingBadge = document.getElementById('sat-pending-badge');
        if(pendingBadge) {
            pendingBadge.style.display = 'inline-block';
            pendingBadge.innerText = window.syncPendingCount + ' PENDING';
        }

        // Update view if active
        if(document.getElementById('sync-queue-count')) {
            document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
            document.getElementById('sync-queue-count').style.borderColor = '#FF003C';
            document.getElementById('sync-queue-count').style.color = '#FF003C';
            
            const ev = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
            const term = document.getElementById('sync-terminal');
            if(term) {
                term.innerHTML += '<div style="color:#ccc; margin-top:5px;">> [CACHE] ' + ev + '</div>';
                term.scrollTop = term.scrollHeight;
            }
        }
    }, 1500);
};`;

const newRestoreUplink = `window.restoreUplink = function() {
    if(!window.syncOfflineInterval && window.syncPendingCount === 0) return;
    
    clearInterval(window.syncOfflineInterval);
    window.syncOfflineInterval = null;
    
    // Global State Restoring
    const mainBadge = document.getElementById('sat-badge-main');
    if(mainBadge) {
        mainBadge.style.background = 'rgba(0, 229, 255, 0.1)';
        mainBadge.style.borderColor = '#00E5FF';
        mainBadge.style.color = '#00E5FF';
        document.getElementById('sat-status-text').innerText = 'SYNCING...';
        document.getElementById('sat-icon').className = 'fa-solid fa-spinner fa-spin';
    }

    // View specific updating
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    const progBar = document.getElementById('sync-progress-bar');
    
    if(radar) {
        radar.style.borderColor = '#00E5FF';
        radar.style.animation = 'slowSpin 2s linear infinite';
        icon.style.color = '#00E5FF';
        icon.style.textShadow = '0 0 20px rgba(0,229,255,0.8)';
        icon.className = 'fa-solid fa-satellite-dish';
        
        statusText.innerText = 'SYNC IN PROGRESS...';
        statusText.style.color = '#00E5FF';
        bandwidth.innerText = 'Bandwidth: 256 kbps (Restored)';
        
        terminal.innerHTML += '<div style="color:#00E5FF; margin-top:10px;">[NETWORK] Connection Restored. Initiating Bulk Sync (' + window.syncPendingCount + ' records)...</div>';
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    let p = 0;
    let upInterval = setInterval(() => {
        p += (100 / window.syncPendingCount) + 5; // dynamic speed based on count
        if (p > 100) p = 100;
        
        if(progBar) progBar.style.width = p + '%';
        
        if(window.syncPendingCount > 0) {
            window.syncPendingCount--;
            
            const pendingBadge = document.getElementById('sat-pending-badge');
            if(pendingBadge && window.syncPendingCount > 0) {
                pendingBadge.innerText = window.syncPendingCount + ' PENDING';
            } else if (pendingBadge) {
                pendingBadge.style.display = 'none';
            }
            
            if(document.getElementById('sync-queue-count')) {
                document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
                if(terminal) {
                    terminal.innerHTML += '<div style="color:#00FF66;">> Uploading record... OK</div>';
                    terminal.scrollTop = terminal.scrollHeight;
                }
            }
        }
        
        if(window.syncPendingCount <= 0) {
            clearInterval(upInterval);
            
            // Final Global State
            window.isOffline = false;
            if(mainBadge) {
                mainBadge.style.background = 'rgba(0, 255, 102, 0.05)';
                mainBadge.style.borderColor = 'rgba(0, 255, 102, 0.3)';
                mainBadge.style.color = '#00FF66';
                document.getElementById('sat-status-text').innerText = 'SAT-LINK: ACTIVE';
                document.getElementById('sat-icon').className = 'fa-solid fa-satellite-dish';
                document.getElementById('sat-icon').style.animation = 'pulse 2s infinite';
            }
            
            if(radar) {
                radar.style.borderColor = '#00FF66';
                radar.style.animation = 'slowSpin 10s linear infinite';
                icon.style.color = '#00FF66';
                icon.style.textShadow = '0 0 20px rgba(0,255,102,0.8)';
                
                statusText.innerText = 'CONNECTION ACTIVE';
                statusText.style.color = '#00FF66';
                document.getElementById('sync-queue-count').innerText = '0 PENDING';
                document.getElementById('sync-queue-count').style.borderColor = '#333';
                document.getElementById('sync-queue-count').style.color = '#fff';
                
                terminal.innerHTML += '<div style="color:#00FF66; margin-top:10px;">[SYSTEM] Sync Complete. Ledger aligned with NCPOR DB.</div>';
                terminal.scrollTop = terminal.scrollHeight;
                
                setTimeout(() => {
                    progBar.style.width = '0%';
                }, 1000);
            }
        }
    }, 300);
};`;

appJS = appJS.replace(/window\.severUplink = function\(\) \{[\s\S]*?window\.restoreUplink = function\(\) \{[\s\S]*?\}\, 200\);\n\};/, newSeverUplink + '\n\n' + newRestoreUplink);

fs.writeFileSync('js/app.js', appJS);
console.log("Updated severUplink and restoreUplink functions to be globally aware and removed demo buttons!");
