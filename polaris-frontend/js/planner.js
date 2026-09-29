
// 1. CONFIGURATOR STATE & DRAG-DROP
let configState = { fuel: 20, food: 20, spares: 60 };
let draggedAssetHTML = null;
let draggedAssetData = null;

document.addEventListener('dragstart', (e) => {
    const asset = e.target.closest('.draggable-asset');
    if (asset) {
        draggedAssetHTML = asset.outerHTML;
        draggedAssetData = {
            type: asset.getAttribute('data-type'),
            val: parseInt(asset.getAttribute('data-val'))
        };
        e.dataTransfer.effectAllowed = 'copy';
        setTimeout(() => asset.style.opacity = '0.4', 0);
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList && e.target.classList.contains('draggable-asset')) {
        e.target.style.opacity = '1';
    }
});

document.addEventListener('dragover', (e) => {
    const dropzone = e.target.closest('#cargo-dropzone');
    if (dropzone) {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'copy';
        dropzone.style.background = 'rgba(0, 229, 255, 0.05)';
        dropzone.style.borderColor = '#00E5FF';
    }
});

document.addEventListener('dragleave', (e) => {
    const dropzone = e.target.closest('#cargo-dropzone');
    if (dropzone) {
        dropzone.style.background = 'transparent';
        dropzone.style.borderColor = '#333';
    }
});

document.addEventListener('drop', (e) => {
    const dropzone = e.target.closest('#cargo-dropzone');
    if (dropzone) {
        e.preventDefault();
        dropzone.style.background = 'transparent';
        dropzone.style.borderColor = '#333';
        
        if (draggedAssetHTML && draggedAssetData) {
            const hint = document.getElementById('dropzone-hint');
            if(hint) hint.style.display = 'none';

            const div = document.createElement('div');
            div.innerHTML = draggedAssetHTML;
            const el = div.firstElementChild;
            el.draggable = false;
            el.style.opacity = '1';
            el.classList.add('dropped-item');
            dropzone.appendChild(el);

            configState[draggedAssetData.type] += draggedAssetData.val;
            if(configState.spares > 100) configState.spares = 100;
            if(configState.fuel > 100) configState.fuel = 100;
            if(configState.food > 100) configState.food = 100;
            
            updateTelemetryUI();
            
            draggedAssetHTML = null;
            draggedAssetData = null;
        }
    }
});

// Disaster Engine Clicks
document.addEventListener('click', (e) => {
    if(e.target.closest('#btn-sim-icelock')) {
        const wrap = document.querySelector('.planner-dual-panel');
        if(wrap) {
            wrap.classList.add('config-flash-screen');
            setTimeout(() => wrap.classList.remove('config-flash-screen'), 400);
        }
        configState.fuel -= 30;
        configState.food -= 30;
        updateTelemetryUI();
    }
    
    if(e.target.closest('#btn-sim-reset-config')) {
        configState = { fuel: 20, food: 20, spares: 60 };
        const dropzone = document.getElementById('cargo-dropzone');
        if(dropzone) {
            dropzone.innerHTML = '<div style="width: 100%; text-align: center; margin-top: 30px; color: #444; font-family: \'Roboto Mono\', monospace; font-size: 14px; pointer-events: none;" id="dropzone-hint"><i class="fa-solid fa-down-long" style="font-size: 2rem; margin-bottom: 10px;"></i><br>DRAG ASSETS HERE TO MANIFEST</div>';
        }
        const warning = document.getElementById('telemetry-warning');
        if(warning) warning.style.display = 'none';
        updateTelemetryUI();
    }
});

function updateTelemetryUI() {
    if(!document.getElementById('val-fuel')) return;

    const dispFuel = Math.max(0, configState.fuel);
    const dispFood = Math.max(0, configState.food);

    document.getElementById('val-fuel').innerText = dispFuel + ' Days';
    document.getElementById('val-food').innerText = dispFood + ' Days';
    document.getElementById('val-spares').innerText = configState.spares + '%';

    const barFuel = document.getElementById('bar-fuel');
    const barFood = document.getElementById('bar-food');
    const barSpares = document.getElementById('bar-spares');

    if(barFuel) barFuel.style.width = Math.min(100, dispFuel) + '%';
    if(barFood) barFood.style.width = Math.min(100, dispFood) + '%';
    if(barSpares) barSpares.style.width = configState.spares + '%';

    const warning = document.getElementById('telemetry-warning');
    if (configState.fuel < 15 || configState.food < 15) {
        if(warning) warning.style.display = 'flex';
        if(barFuel) { barFuel.style.background = '#FF003C'; barFuel.style.boxShadow = '0 0 10px #FF003C'; }
        document.getElementById('val-fuel').style.color = '#FF003C';
        if(barFood) { barFood.style.background = '#FF003C'; barFood.style.boxShadow = '0 0 10px #FF003C'; }
        document.getElementById('val-food').style.color = '#FF003C';
    } else {
        if(warning) warning.style.display = 'none';
        if(barFuel) { barFuel.style.background = '#00FF66'; barFuel.style.boxShadow = '0 0 10px #00FF66'; }
        document.getElementById('val-fuel').style.color = '#00FF66';
        if(barFood) { barFood.style.background = '#00E5FF'; barFood.style.boxShadow = '0 0 10px #00E5FF'; }
        document.getElementById('val-food').style.color = '#00E5FF';
    }
}

// 2. TRACKER PROGRESS BAR ANIMATIONS
function animateProgressBars() {
    setTimeout(() => {
        document.querySelectorAll('.prog-fill').forEach(bar => {
            const target = bar.getAttribute('data-target');
            if (target) {
                bar.style.width = target;
            }
        });
    }, 100);
}

// Observe DOM mutations to trigger animation when #planner view is rendered
let plannerActive = false;
const observer = new MutationObserver((mutations) => {
    const dualPanel = document.querySelector('.planner-dual-panel');
    if (dualPanel && !plannerActive) {
        plannerActive = true;
        document.querySelectorAll('.prog-fill').forEach(bar => { bar.style.width = '0%'; });
        animateProgressBars();
        updateTelemetryUI();
    } else if (!dualPanel && plannerActive) {
        plannerActive = false;
    }
});
observer.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });

// Fallback if already rendered
if(document.querySelector('.planner-dual-panel')) {
    plannerActive = true;
    animateProgressBars();
    updateTelemetryUI();
}
