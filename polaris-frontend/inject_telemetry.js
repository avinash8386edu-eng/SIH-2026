const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBadge = '<span class="status-indicator"><span class="green-dot"></span> OPERATIONAL</span>';

const newBadge = `
<div class="telemetry-widget" id="sat-telemetry-widget" style="position: relative; display: inline-block; cursor: pointer; margin-right: 25px;">
    <div class="sat-badge" id="sat-badge-main" style="display: flex; align-items: center; gap: 8px; background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0, 255, 102, 0.3); padding: 6px 14px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; color: #00FF66; letter-spacing: 1px; transition: all 0.3s; user-select: none;">
        <i class="fa-solid fa-satellite-dish" id="sat-icon" style="animation: pulse 2s infinite;"></i>
        <span id="sat-status-text">SAT-LINK: ACTIVE</span>
        <span id="sat-pending-badge" style="background: rgba(0,0,0,0.8); padding: 2px 6px; border-radius: 12px; border: 1px solid #FF003C; font-size: 9px; display: none; color: #FF003C; font-weight: bold;">0 PENDING</span>
    </div>
    
    <!-- Dropdown -->
    <div id="sat-dropdown" style="display: none; position: absolute; top: 40px; right: 0; width: 300px; background: rgba(8, 8, 8, 0.98); border: 1px solid #222; border-top: 2px solid #00E5FF; padding: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); z-index: 1000; backdrop-filter: blur(15px); border-radius: 0 0 6px 6px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
            <div style="font-family: 'Inter', sans-serif; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1.5px;">Secure Uplink</div>
            <div id="sat-pulse-dot" style="width: 6px; height: 6px; background: #00FF66; border-radius: 50%; box-shadow: 0 0 8px #00FF66; animation: pulse 1s infinite;"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
                <div style="color: #666; font-size: 9px; font-family: var(--font-mono); margin-bottom: 3px;">NETWORK</div>
                <div style="color: #fff; font-size: 13px; font-family: 'Inter'; font-weight: 500;">INMARSAT BGAN</div>
            </div>
            <div>
                <div style="color: #666; font-size: 9px; font-family: var(--font-mono); margin-bottom: 3px;">LATENCY</div>
                <div id="sat-latency" style="color: #00E5FF; font-size: 13px; font-family: var(--font-mono);">650ms</div>
            </div>
            <div>
                <div style="color: #666; font-size: 9px; font-family: var(--font-mono); margin-bottom: 3px;">LAST SYNC</div>
                <div id="sat-last-sync" style="color: #00FF66; font-size: 12px; font-family: var(--font-mono);">14:20:00 IST</div>
            </div>
            <div>
                <div style="color: #666; font-size: 9px; font-family: var(--font-mono); margin-bottom: 3px;">BANDWIDTH</div>
                <div id="sat-bandwidth" style="color: #fff; font-size: 12px; font-family: var(--font-mono);">256 kbps Tx</div>
            </div>
        </div>
        
        <button id="btn-force-uplink" style="width: 100%; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.4); color: #00E5FF; padding: 10px; font-family: var(--font-mono); font-size: 11px; cursor: pointer; transition: 0.3s; text-transform: uppercase; border-radius: 4px; font-weight: 600; letter-spacing: 1px;">
            <i class="fa-solid fa-cloud-arrow-up" style="margin-right: 5px;"></i> Force Data Uplink
        </button>
        <div style="text-align: center; margin-top: 10px; font-size: 9px; color: #555; font-family: var(--font-mono);">
            Hint: Press <kbd style="background:#222; padding:1px 4px; border-radius:2px; color:#00E5FF;">Alt + O</kbd> to toggle Offline Mode
        </div>
    </div>
</div>
`;

const scriptInject = `
<script>
document.addEventListener("DOMContentLoaded", () => {
    const satWidget = document.getElementById('sat-telemetry-widget');
    if(!satWidget) return;
    const satDropdown = document.getElementById('sat-dropdown');
    const forceBtn = document.getElementById('btn-force-uplink');
    const pendingBadge = document.getElementById('sat-pending-badge');
    const mainBadge = document.getElementById('sat-badge-main');
    const statusText = document.getElementById('sat-status-text');
    const satIcon = document.getElementById('sat-icon');
    const pulseDot = document.getElementById('sat-pulse-dot');
    const latencyText = document.getElementById('sat-latency');
    const bandwidthText = document.getElementById('sat-bandwidth');
    
    // Set initial sync time
    document.getElementById('sat-last-sync').innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
    
    // Toggle dropdown
    satWidget.addEventListener('click', (e) => {
        if(e.target === forceBtn || forceBtn.contains(e.target)) return; 
        satDropdown.style.display = satDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if(!satWidget.contains(e.target)) {
            satDropdown.style.display = 'none';
        }
    });

    // Mock Offline Mode Toggle (Alt + O)
    let isOffline = false;
    let pendingCount = 0;
    
    document.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase() === 'o' && e.altKey) { 
            isOffline = !isOffline;
            if(isOffline) {
                // Offline State
                mainBadge.style.background = 'rgba(255, 0, 60, 0.05)';
                mainBadge.style.borderColor = 'rgba(255, 0, 60, 0.3)';
                mainBadge.style.color = '#FF003C';
                statusText.innerText = 'AIRGAPPED (LOCAL)';
                satIcon.className = 'fa-solid fa-triangle-exclamation';
                satIcon.style.animation = 'none';
                
                pendingCount = Math.floor(Math.random() * 8) + 2; // Fake offline changes
                pendingBadge.style.display = 'inline-block';
                pendingBadge.innerText = pendingCount + ' PENDING';
                
                // Dropdown details update
                pulseDot.style.background = '#FF003C';
                pulseDot.style.boxShadow = '0 0 8px #FF003C';
                pulseDot.style.animation = 'none';
                latencyText.innerText = 'ERR_CONN';
                latencyText.style.color = '#FF003C';
                bandwidthText.innerText = '0 kbps';
                
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
                
                // Dropdown details update
                pulseDot.style.background = '#00FF66';
                pulseDot.style.boxShadow = '0 0 8px #00FF66';
                pulseDot.style.animation = 'pulse 1s infinite';
                latencyText.innerText = '650ms';
                latencyText.style.color = '#00E5FF';
                bandwidthText.innerText = '256 kbps Tx';
                document.getElementById('sat-last-sync').innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
            }
        }
    });
    
    // Force Uplink Button Logic
    forceBtn.addEventListener('click', () => {
        if(isOffline) {
            alert('CRITICAL: Cannot uplink. Inmarsat connection unavailable.');
            return;
        }
        
        const originalHtml = forceBtn.innerHTML;
        forceBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SYNCING...';
        forceBtn.style.background = 'rgba(0, 255, 102, 0.1)';
        forceBtn.style.borderColor = '#00FF66';
        forceBtn.style.color = '#00FF66';
        
        setTimeout(() => {
            forceBtn.innerHTML = '<i class="fa-solid fa-check"></i> SYNC COMPLETE';
            document.getElementById('sat-last-sync').innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
            
            setTimeout(() => {
                forceBtn.innerHTML = originalHtml;
                forceBtn.style.background = 'rgba(0, 229, 255, 0.05)';
                forceBtn.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                forceBtn.style.color = '#00E5FF';
            }, 2500);
        }, 1500);
    });
});
</script>
</body>
`;

html = html.replace(oldBadge, newBadge);
if (!html.includes('sat-telemetry-widget')) {
    console.log("Could not find the old badge to replace.");
} else {
    html = html.replace('</body>', scriptInject);
    fs.writeFileSync('index.html', html);
    console.log('Successfully injected advanced telemetry widget!');
}
