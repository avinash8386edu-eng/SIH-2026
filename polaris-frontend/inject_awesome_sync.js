const fs = require('fs');

// 1. Inject into index.html sidebar
let indexHTML = fs.readFileSync('index.html', 'utf8');
indexHTML = indexHTML.replace(
    '<a href="#intelligence" class="nav-item">',
    '<a href="#data-sync" class="nav-item" style="color: #00E5FF;"><i class="fa-solid fa-satellite-dish"></i> Uplink & Sync</a>\n                <a href="#intelligence" class="nav-item">'
);
fs.writeFileSync('index.html', indexHTML);

// 2. Inject into js/app.js views dictionary
const syncHTML = `
        '#data-sync': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-satellite-dish"></i> POLARIS MESH NETWORK</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">DATA <span style="font-weight: 700; color: #00E5FF;">UPLINK</span></h1>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
                    <!-- LEFT COLUMN: STATUS & CONTROLS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- SAT LINK VISUALIZER -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-height: 250px;">
                            <div id="sync-radar-ring" style="width: 150px; height: 150px; border-radius: 50%; border: 2px dashed #00FF66; position: absolute; animation: slowSpin 10s linear infinite;"></div>
                            <i id="sync-sat-icon" class="fa-solid fa-satellite-dish" style="font-size: 3rem; color: #00FF66; z-index: 2; text-shadow: 0 0 20px rgba(0,255,102,0.8);"></i>
                            <div id="sync-status-main" style="margin-top: 25px; font-family: var(--font-mono); font-size: 1.2rem; color: #00FF66; font-weight: bold; z-index: 2; letter-spacing: 2px;">CONNECTION ACTIVE</div>
                            <div id="sync-bandwidth" style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-top: 5px; z-index: 2;">Bandwidth: 256 kbps (KU-Band)</div>
                        </div>

                        <!-- CONTROLS -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px;">
                            <div style="color: #fff; font-size: 14px; font-weight: bold; margin-bottom: 15px;"><i class="fa-solid fa-gamepad"></i> DEMO CONTROLS</div>
                            <div style="display: flex; gap: 10px;">
                                <button onclick="window.severUplink()" style="flex: 1; background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(255,0,60,0.2)'" onmouseout="this.style.background='rgba(255,0,60,0.1)'">
                                    <i class="fa-solid fa-bolt-lightning"></i> SEVER UPLINK (OFFLINE)
                                </button>
                                <button onclick="window.restoreUplink()" style="flex: 1; background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; color: #00FF66; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,255,102,0.2)'" onmouseout="this.style.background='rgba(0,255,102,0.1)'">
                                    <i class="fa-solid fa-satellite-dish"></i> RESTORE & SYNC
                                </button>
                            </div>
                            <p style="color: #555; font-size: 11px; margin-top: 15px; font-family: var(--font-mono);">Use these controls to demonstrate offline-first architecture. When severed, all app actions cache locally. When restored, they sync automatically.</p>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN: LOCAL QUEUE -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; display: flex; flex-direction: column;">
                        
                        <div style="padding: 20px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #00E5FF; font-size: 14px; font-weight: bold; font-family: var(--font-mono);"><i class="fa-solid fa-database"></i> LOCAL IndexedDB QUEUE</div>
                            <div id="sync-queue-count" style="background: #111; border: 1px solid #333; color: #fff; padding: 4px 10px; font-family: var(--font-mono); font-size: 10px; border-radius: 12px;">0 PENDING</div>
                        </div>

                        <div id="sync-terminal" style="flex: 1; padding: 20px; font-family: var(--font-mono); font-size: 11px; color: #aaa; overflow-y: auto; background: #000;">
                            <div>[SYSTEM] Listening for data mutations...</div>
                        </div>
                        
                        <div id="sync-progress-bar" style="height: 4px; background: #00FF66; width: 0%; transition: width 0.2s;"></div>

                    </div>
                </div>
            </div>
            <style>
                @keyframes slowSpin { 100% { transform: rotate(360deg); } }
            </style>
        \`,
`;

let appJS = fs.readFileSync('js/app.js', 'utf8');
appJS = appJS.replace('const views = {', 'const views = {\n' + syncHTML);

// 3. Add Javascript Logic to the end of app.js
const syncLogic = `
window.syncOfflineInterval = null;
window.syncPendingCount = 0;

window.severUplink = function() {
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    
    if(!radar) return; // not on view

    radar.style.borderColor = '#FF003C';
    radar.style.animation = 'none';
    icon.style.color = '#FF003C';
    icon.style.textShadow = '0 0 20px rgba(255,0,60,0.8)';
    icon.className = 'fa-solid fa-triangle-exclamation';
    
    statusText.innerText = 'AIRGAPPED (LOCAL)';
    statusText.style.color = '#FF003C';
    bandwidth.innerText = 'Bandwidth: 0 kbps (Connection Lost)';
    
    terminal.innerHTML += '<div style="color:#FF003C; margin-top:10px;">[NETWORK] VSAT Link Severed. Switching to local IndexedDB.</div>';
    
    // Also trigger the top widget for consistency
    window.isOffline = true;
    const mainBadge = document.getElementById('sat-badge-main');
    if(mainBadge) {
        mainBadge.style.background = 'rgba(255, 0, 60, 0.05)';
        mainBadge.style.borderColor = 'rgba(255, 0, 60, 0.3)';
        mainBadge.style.color = '#FF003C';
        document.getElementById('sat-status-text').innerText = 'AIRGAPPED';
        document.getElementById('sat-icon').className = 'fa-solid fa-triangle-exclamation';
        document.getElementById('sat-icon').style.animation = 'none';
    }

    // Start generating fake offline data mutations
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
        document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
        document.getElementById('sync-queue-count').style.borderColor = '#FF003C';
        document.getElementById('sync-queue-count').style.color = '#FF003C';
        
        const ev = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
        terminal.innerHTML += '<div style="color:#ccc; margin-top:5px;">> [CACHE] ' + ev + '</div>';
        terminal.scrollTop = terminal.scrollHeight;
    }, 1500);
};

window.restoreUplink = function() {
    if(!window.syncOfflineInterval && window.syncPendingCount === 0) {
        if(window.GlobalUI) window.GlobalUI.showToast('Already synced.', 'info');
        return;
    }
    
    clearInterval(window.syncOfflineInterval);
    window.syncOfflineInterval = null;
    
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    const progBar = document.getElementById('sync-progress-bar');
    
    if(!radar) return;
    
    radar.style.borderColor = '#00FF66';
    radar.style.animation = 'slowSpin 10s linear infinite';
    icon.style.color = '#00FF66';
    icon.style.textShadow = '0 0 20px rgba(0,255,102,0.8)';
    icon.className = 'fa-solid fa-satellite-dish';
    
    statusText.innerText = 'SYNC IN PROGRESS...';
    statusText.style.color = '#00E5FF';
    bandwidth.innerText = 'Bandwidth: 256 kbps (Restored)';
    
    terminal.innerHTML += '<div style="color:#00E5FF; margin-top:10px;">[NETWORK] VSAT Restored. Initiating Bulk Sync (' + window.syncPendingCount + ' records)...</div>';
    terminal.scrollTop = terminal.scrollHeight;
    
    let p = 0;
    let upInterval = setInterval(() => {
        p += 10;
        progBar.style.width = p + '%';
        
        if(window.syncPendingCount > 0) {
            window.syncPendingCount--;
            document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
            terminal.innerHTML += '<div style="color:#00FF66;">> Uploading record... OK</div>';
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        if(p >= 100) {
            clearInterval(upInterval);
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
            
            // Fix top widget
            window.isOffline = false;
            const mainBadge = document.getElementById('sat-badge-main');
            if(mainBadge) {
                mainBadge.style.background = 'rgba(0, 255, 102, 0.05)';
                mainBadge.style.borderColor = 'rgba(0, 255, 102, 0.3)';
                mainBadge.style.color = '#00FF66';
                document.getElementById('sat-status-text').innerText = 'SAT-LINK: ACTIVE';
                document.getElementById('sat-icon').className = 'fa-solid fa-satellite-dish';
                document.getElementById('sat-icon').style.animation = 'pulse 2s infinite';
            }
        }
    }, 200);
};
`;

appJS += '\n' + syncLogic;
fs.writeFileSync('js/app.js', appJS);

console.log("Super awesome offline sync demo created!");
