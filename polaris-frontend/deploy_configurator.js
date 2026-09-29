const fs = require('fs');

// --- 1. NEW HTML CONTENT FOR PLANNER VIEW ---
const configuratorHTML = `
            <div class="dhruv-dashboard configurator-mode" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif;">
                
                <!-- Header -->
                <div class="dash-header" style="flex-shrink: 0; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0;">POLARIS PAYLOAD & SURVIVAL CONFIGURATOR</h1>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;"><i class="fa-solid fa-satellite-dish"></i> LIVE DRAG & DROP LOGISTICS ENGINE</p>
                </div>

                <!-- 3-Panel Grid -->
                <div style="display: flex; gap: 20px; flex: 1; min-height: 0; margin-bottom: 20px;">
                    
                    <!-- Left: Assets -->
                    <div class="config-panel" style="width: 260px; display: flex; flex-direction: column; background: #050505; border: 1px solid #222; border-radius: 8px; flex-shrink: 0;">
                        <h3 style="padding: 15px; border-bottom: 1px solid #222; color: #fff; font-size: 12px; font-family: 'Roboto Mono', monospace; margin:0; text-transform: uppercase;">AVAILABLE ASSETS</h3>
                        <div id="assets-list" class="elite-planner-scroll" style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                            
                            <div class="draggable-asset" draggable="true" data-type="fuel" data-val="15">
                                <div><i class="fa-solid fa-gas-pump" style="color:#00E5FF; width: 20px;"></i> High-Speed Diesel</div>
                                <small style="color: #00FF66;">+15 Days Fuel Runway</small>
                            </div>
                            
                            <div class="draggable-asset" draggable="true" data-type="food" data-val="20">
                                <div><i class="fa-solid fa-drumstick-bite" style="color:#00E5FF; width: 20px;"></i> Winter Food Rations</div>
                                <small style="color: #00FF66;">+20 Days Food Reserves</small>
                            </div>
                            
                            <div class="draggable-asset" draggable="true" data-type="spares" data-val="10">
                                <div><i class="fa-solid fa-cogs" style="color:#00E5FF; width: 20px;"></i> PistenBully Spares</div>
                                <small style="color: #00E5FF;">+10% Traverse Readiness</small>
                            </div>
                            
                            <div class="draggable-asset" draggable="true" data-type="fuel" data-val="10">
                                <div><i class="fa-solid fa-barrel" style="color:#00E5FF; width: 20px;"></i> Heli-Aviation Turbine Fuel</div>
                                <small style="color: #00FF66;">+10 Days Fuel Runway</small>
                            </div>

                        </div>
                    </div>

                    <!-- Center: Cargo Hold (Dropzone) -->
                    <div class="config-panel" style="flex: 1; background: #050505; border: 2px dashed #333; border-radius: 8px; display: flex; flex-direction: column;">
                        <h3 style="padding: 15px; border-bottom: 2px dashed #333; color: #00E5FF; font-size: 12px; font-family: 'Roboto Mono', monospace; margin:0; text-align: center; text-transform: uppercase; background: rgba(0,229,255,0.02);">VESSEL CARGO HOLD (DROPZONE)</h3>
                        <div id="cargo-dropzone" class="elite-planner-scroll" style="flex: 1; padding: 20px; display: flex; flex-wrap: wrap; gap: 15px; align-content: flex-start; overflow-y: auto;">
                            <!-- Dropped items spawn here -->
                            <div style="width: 100%; text-align: center; margin-top: 50px; color: #444; font-family: 'Roboto Mono', monospace; font-size: 14px; pointer-events: none;" id="dropzone-hint">
                                <i class="fa-solid fa-down-long" style="font-size: 2rem; margin-bottom: 10px;"></i><br>
                                DRAG ASSETS HERE TO MANIFEST
                            </div>
                        </div>
                    </div>

                    <!-- Right: Telemetry -->
                    <div class="config-panel" style="width: 320px; flex-shrink: 0; background: #050505; border: 1px solid #222; border-radius: 8px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
                        <h3 style="padding: 15px; border-bottom: 1px solid #222; color: #fff; font-size: 12px; font-family: 'Roboto Mono', monospace; margin:0; text-transform: uppercase;">SURVIVAL TELEMETRY</h3>
                        
                        <!-- Warning Overlay -->
                        <div id="telemetry-warning" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,0,60,0.95); z-index: 10; padding: 20px; box-sizing: border-box; text-align: center; flex-direction: column; justify-content: center; align-items: center; animation: config-flash-bg 1s infinite alternate;">
                            <i class="fa-solid fa-skull-crossbones" style="font-size: 3rem; color: #fff; margin-bottom: 15px;"></i>
                            <div style="color: #fff; font-weight: bold; font-size: 15px; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">CRITICAL ASSET SHORTAGE</div>
                            <div style="color: #fff; font-size: 12px; line-height: 1.4;">Initiate Winter Rationing Protocol immediately. Evacuation on standby.</div>
                        </div>

                        <div style="padding: 25px; display: flex; flex-direction: column; gap: 35px;">
                            <!-- Bar 1 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">
                                    <span style="color: #aaa; font-size: 11px;">DIESEL RUNWAY</span>
                                    <span id="val-fuel" style="color: #00FF66; font-size: 12px; font-weight: bold;">20 Days</span>
                                </div>
                                <div class="config-bar-bg"><div id="bar-fuel" class="config-bar-fill" style="width: 20%; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div></div>
                            </div>
                            <!-- Bar 2 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">
                                    <span style="color: #aaa; font-size: 11px;">FOOD RESERVES</span>
                                    <span id="val-food" style="color: #00E5FF; font-size: 12px; font-weight: bold;">20 Days</span>
                                </div>
                                <div class="config-bar-bg"><div id="bar-food" class="config-bar-fill" style="width: 20%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div></div>
                            </div>
                            <!-- Bar 3 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">
                                    <span style="color: #aaa; font-size: 11px;">MISSION READINESS</span>
                                    <span id="val-spares" style="color: #FF003C; font-size: 12px; font-weight: bold;">60%</span>
                                </div>
                                <div class="config-bar-bg"><div id="bar-spares" class="config-bar-fill" style="width: 60%; background: #FF003C; box-shadow: 0 0 10px #FF003C;"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom: Disaster Engine -->
                <div class="chaos-console-elite" style="flex-shrink: 0; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid rgba(255,0,60,0.3); background: rgba(10, 0, 0, 0.6); backdrop-filter: blur(10px);">
                    <div style="color: #FF003C; font-size: 12px; font-weight: bold; font-family: 'Roboto Mono', monospace; text-transform: uppercase; letter-spacing: 1px;">
                        <i class="fa-solid fa-bolt" style="margin-right: 8px;"></i> DISASTER INJECTION ENGINE
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button id="btn-sim-icelock" class="btn-military" style="border-color: #FF003C; color: #FF003C; padding: 12px 25px; box-shadow: 0 0 15px rgba(255,0,60,0.2);"><i class="fa-solid fa-snowflake"></i> SIMULATE 30-DAY ICE-LOCK DELAY</button>
                        <button id="btn-sim-reset-config" class="btn-military btn-military-cyan" style="padding: 12px 25px;"><i class="fa-solid fa-rotate-right"></i> RESET STATE</button>
                    </div>
                </div>
            </div>
`;


// --- 2. INJECT HTML INTO APP.JS CAREFULLY ---
let appJS = fs.readFileSync('js/app.js', 'utf8');

const pStart = appJS.indexOf("'#planner': `");
const pEnd = appJS.indexOf("'#intelligence': `");

if (pStart !== -1 && pEnd !== -1) {
    const pre = appJS.substring(0, pStart);
    const post = appJS.substring(pEnd);
    appJS = pre + "'#planner': `" + configuratorHTML + "`,\n        " + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Successfully replaced #planner in app.js");
} else {
    console.error("Could not find planner or intelligence anchors in app.js");
    process.exit(1);
}


// --- 3. CSS ADDITIONS FOR CONFIGURATOR ---
let cssContent = fs.readFileSync('css/main.css', 'utf8');
const newCSS = `
/* --- CONFIGURATOR STYLES --- */
.draggable-asset {
    background: rgba(0, 229, 255, 0.05);
    border: 1px solid #00E5FF;
    border-radius: 6px;
    padding: 15px;
    color: #fff;
    cursor: grab;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    box-shadow: inset 0 0 15px rgba(0,229,255,0.05);
    user-select: none;
}
.draggable-asset:active {
    cursor: grabbing;
}
.draggable-asset:hover {
    background: rgba(0, 229, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,229,255,0.2);
}
.draggable-asset small {
    display: block;
    margin-top: 8px;
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
}

.dropped-item {
    cursor: default;
    width: 48%; /* fit two in a row in dropzone */
    animation: dropIn 0.3s ease-out;
}
.dropped-item:hover {
    transform: none;
    background: rgba(0, 229, 255, 0.05);
}

@keyframes dropIn {
    0% { transform: scale(1.1); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.config-bar-bg {
    width: 100%;
    height: 6px;
    background: #222;
    border-radius: 3px;
    overflow: hidden;
}
.config-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease;
}

@keyframes config-flash-bg {
    0% { background: rgba(255,0,60,0.85); }
    100% { background: rgba(255,0,60,1); }
}

.config-flash-screen {
    animation: config-screen-shake 0.4s;
    box-shadow: inset 0 0 150px rgba(255,0,60,0.4);
}
@keyframes config-screen-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}
`;
if (!cssContent.includes('config-flash-screen')) {
    fs.appendFileSync('css/main.css', newCSS);
}


// --- 4. REWRITE PLANNER.JS ---
const configuratorJS = `
let configState = {
    fuel: 20,
    food: 20,
    spares: 60
};

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
        e.preventDefault(); // Necessary to allow dropping
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
            // Hide hint text
            const hint = document.getElementById('dropzone-hint');
            if(hint) hint.style.display = 'none';

            // Append item
            const div = document.createElement('div');
            div.innerHTML = draggedAssetHTML;
            const el = div.firstElementChild;
            el.draggable = false;
            el.style.opacity = '1';
            el.classList.add('dropped-item');
            dropzone.appendChild(el);

            // Update State
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

document.addEventListener('click', (e) => {
    if(e.target.closest('#btn-sim-icelock')) {
        const wrap = document.querySelector('.configurator-mode');
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
            dropzone.innerHTML = '<div style="width: 100%; text-align: center; margin-top: 50px; color: #444; font-family: \\'Roboto Mono\\', monospace; font-size: 14px; pointer-events: none;" id="dropzone-hint"><i class="fa-solid fa-down-long" style="font-size: 2rem; margin-bottom: 10px;"></i><br>DRAG ASSETS HERE TO MANIFEST</div>';
        }
        document.getElementById('telemetry-warning').style.display = 'none';
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

    barFuel.style.width = Math.min(100, dispFuel) + '%';
    barFood.style.width = Math.min(100, dispFood) + '%';
    barSpares.style.width = configState.spares + '%';

    // Disaster check
    if (configState.fuel < 15 || configState.food < 15) {
        document.getElementById('telemetry-warning').style.display = 'flex';
        
        barFuel.style.background = '#FF003C';
        barFuel.style.boxShadow = '0 0 10px #FF003C';
        document.getElementById('val-fuel').style.color = '#FF003C';
        
        barFood.style.background = '#FF003C';
        barFood.style.boxShadow = '0 0 10px #FF003C';
        document.getElementById('val-food').style.color = '#FF003C';
    } else {
        document.getElementById('telemetry-warning').style.display = 'none';
        
        barFuel.style.background = '#00FF66';
        barFuel.style.boxShadow = '0 0 10px #00FF66';
        document.getElementById('val-fuel').style.color = '#00FF66';
        
        barFood.style.background = '#00E5FF';
        barFood.style.boxShadow = '0 0 10px #00E5FF';
        document.getElementById('val-food').style.color = '#00E5FF';
    }
}
`;
fs.writeFileSync('js/planner.js', configuratorJS);
console.log("Configurator JS injected.");
