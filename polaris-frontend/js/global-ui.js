document.addEventListener('DOMContentLoaded', () => {
    // Remove old widget if exists
    const oldW = document.getElementById('network-sync-widget');
    if (oldW) oldW.remove();

    injectGlobalUI();
    updateNetworkWidget();
    fetchNotifications(); // Fetch expiry alerts
    window.addEventListener('online', updateNetworkWidget);
    window.addEventListener('offline', updateNetworkWidget);
    
    // Polling interval based on power mode
    setInterval(fetchNotifications, window.isBlizzardMode ? 300000 : 30000); // 5 mins vs 30 secs
});

window.isBlizzardMode = false;

function injectGlobalUI() {
    // Top Bar Container
    const topBar = document.createElement('div');
    topBar.className = 'top-ui-bar';
    document.body.appendChild(topBar);

    // Power Mode Toggle
    const powerBtn = document.createElement('div');
    powerBtn.className = 'power-toggle';
    powerBtn.innerHTML = '⚡ Standard Power';
    powerBtn.onclick = () => {
        window.isBlizzardMode = !window.isBlizzardMode;
        if (window.isBlizzardMode) {
            document.body.classList.add('blizzard-mode');
            powerBtn.classList.add('blizzard');
            powerBtn.innerHTML = '❄️ Blizzard Mode';
        } else {
            document.body.classList.remove('blizzard-mode');
            powerBtn.classList.remove('blizzard');
            powerBtn.innerHTML = '⚡ Standard Power';
        }
    };
    topBar.appendChild(powerBtn);

    // Notification Bell
    const bellBtn = document.createElement('div');
    bellBtn.className = 'notif-bell';
    bellBtn.innerHTML = '🔔 <span class="notif-badge" id="notif-badge" style="display:none;">0</span>';
    const dropdown = document.createElement('div');
    dropdown.id = 'notif-dropdown';
    dropdown.className = 'notif-dropdown';
    bellBtn.appendChild(dropdown);
    bellBtn.onclick = (e) => {
        if(e.target === dropdown || dropdown.contains(e.target)) return;
        dropdown.classList.toggle('show');
    };
    topBar.appendChild(bellBtn);

    // Network Widget
    const netWidget = document.createElement('div');
    netWidget.id = 'network-widget-inner';
    netWidget.className = 'network-widget-inner';
    topBar.appendChild(netWidget);

    // Inject Massive Global SOS Button (Bottom Right)
    const oldSos = document.getElementById('global-sos-btn');
    if(oldSos) oldSos.remove();

    const sosBtn = document.createElement('button');
    sosBtn.id = 'global-sos-btn';
    sosBtn.className = 'global-sos-button';
    sosBtn.innerHTML = '🚨 GLOBAL SOS';
    
    sosBtn.addEventListener('click', () => {
        if (typeof handleSOSClick === 'function') {
            handleSOSClick();
        } else {
            alert("Emergency module not loaded.");
        }
    });
    
    document.body.appendChild(sosBtn);
}

async function fetchNotifications() {
    if(!navigator.onLine) return; // Don't fetch if offline
    try {
        const inventory = await apiCall('/inventory');
        const now = new Date();
        const alerts = [];
        
        inventory.forEach(item => {
            const exp = new Date(item.expiryDate);
            const diffMonths = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
            
            if (diffMonths < 0) {
                alerts.push({ type: 'danger', msg: `EXPIRED: ${item.itemName} (${item.storageLocation}). Dispose immediately.` });
            } else if (diffMonths <= 3) {
                alerts.push({ type: 'warning', msg: `WINTER ALERT: ${item.itemName} expires in ${Math.ceil(diffMonths)} months. Prioritize usage.` });
            }
        });

        const badge = document.getElementById('notif-badge');
        const drop = document.getElementById('notif-dropdown');
        if(alerts.length > 0) {
            badge.style.display = 'block';
            badge.innerText = alerts.length;
            drop.innerHTML = alerts.map(a => `<div class="notif-item ${a.type}">${a.msg}</div>`).join('');
        } else {
            badge.style.display = 'none';
            drop.innerHTML = '<div class="notif-item">No upcoming events or winter expiry alerts.</div>';
        }
    } catch(e) {
        console.error("Notifications fetch failed", e);
    }
}

async function updateNetworkWidget() {
    const widget = document.getElementById('network-widget-inner');
    if (!widget) return;

    if (navigator.onLine) {
        widget.innerHTML = '<span class="status-dot online"></span> 🟢 Online';
        widget.style.borderColor = '#333';
        
        if (typeof syncOfflineSOS === 'function') {
            await syncOfflineSOS();
        }
    } else {
        widget.innerHTML = '<span class="status-dot offline"></span> 🔴 ECIL VSAT Link Lost';
        widget.style.borderColor = '#E74C3C';
        widget.style.color = '#E74C3C';
    }

    if (typeof getOfflineSOS === 'function') {
        try {
            const queue = await getOfflineSOS();
            if (queue && queue.length > 0) {
                widget.innerHTML += ` | ⏳ ${queue.length} Pending`;
                widget.style.borderColor = '#F39C12';
                widget.style.color = '#F39C12';
            }
        } catch (e) {
            console.error("Could not check offline queue", e);
        }
    }
}
