const fs = require('fs');

// --- 1. HTML CONTENT ---
const htmlContent = `
            <div class="dhruv-dashboard planner-dual-panel" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif;">
                
                <!-- ================= TOP PANEL: CONFIGURATOR ================= -->
                <div class="dash-header" style="flex-shrink: 0; margin-bottom: 20px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0;">POLARIS PAYLOAD & SURVIVAL CONFIGURATOR</h1>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;"><i class="fa-solid fa-satellite-dish"></i> LIVE DRAG & DROP LOGISTICS ENGINE</p>
                </div>

                <div style="display: flex; gap: 20px; flex-shrink: 0; margin-bottom: 20px;">
                    <!-- Left: Assets -->
                    <div class="config-panel" style="width: 260px; display: flex; flex-direction: column; background: #050505; border: 1px solid #222; border-radius: 8px;">
                        <h3 style="padding: 15px; border-bottom: 1px solid #222; color: #fff; font-size: 12px; font-family: 'Roboto Mono', monospace; margin:0; text-transform: uppercase;">AVAILABLE ASSETS</h3>
                        <div id="assets-list" style="padding: 15px; display: flex; flex-direction: column; gap: 15px;">
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
                        </div>
                    </div>

                    <!-- Center: Dropzone -->
                    <div class="config-panel" style="flex: 1; background: #050505; border: 2px dashed #333; border-radius: 8px; display: flex; flex-direction: column;">
                        <h3 style="padding: 15px; border-bottom: 2px dashed #333; color: #00E5FF; font-size: 12px; font-family: 'Roboto Mono', monospace; margin:0; text-align: center; text-transform: uppercase; background: rgba(0,229,255,0.02);">VESSEL CARGO HOLD (DROPZONE)</h3>
                        <div id="cargo-dropzone" style="flex: 1; padding: 20px; display: flex; flex-wrap: wrap; gap: 15px; align-content: flex-start; min-height: 150px;">
                            <div style="width: 100%; text-align: center; margin-top: 30px; color: #444; font-family: 'Roboto Mono', monospace; font-size: 14px; pointer-events: none;" id="dropzone-hint">
                                <i class="fa-solid fa-down-long" style="font-size: 2rem; margin-bottom: 10px;"></i><br>DRAG ASSETS HERE TO MANIFEST
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
                            <div style="color: #fff; font-size: 12px; line-height: 1.4;">Initiate Winter Rationing Protocol immediately.</div>
                        </div>

                        <div style="padding: 25px; display: flex; flex-direction: column; gap: 30px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">
                                    <span style="color: #aaa; font-size: 11px;">DIESEL RUNWAY</span>
                                    <span id="val-fuel" style="color: #00FF66; font-size: 12px; font-weight: bold;">20 Days</span>
                                </div>
                                <div class="config-bar-bg"><div id="bar-fuel" class="config-bar-fill" style="width: 20%; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div></div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-family: 'Roboto Mono', monospace;">
                                    <span style="color: #aaa; font-size: 11px;">FOOD RESERVES</span>
                                    <span id="val-food" style="color: #00E5FF; font-size: 12px; font-weight: bold;">20 Days</span>
                                </div>
                                <div class="config-bar-bg"><div id="bar-food" class="config-bar-fill" style="width: 20%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div></div>
                            </div>
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

                <!-- Configurator Bottom: Simulator Engine -->
                <div class="chaos-console-elite" style="flex-shrink: 0; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; border: 1px solid rgba(255,0,60,0.3); background: rgba(10, 0, 0, 0.6); backdrop-filter: blur(10px);">
                    <div style="color: #FF003C; font-size: 12px; font-weight: bold; font-family: 'Roboto Mono', monospace; text-transform: uppercase; letter-spacing: 1px;">
                        <i class="fa-solid fa-bolt" style="margin-right: 8px;"></i> DISASTER INJECTION ENGINE
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button id="btn-sim-icelock" class="btn-military" style="border-color: #FF003C; color: #FF003C; padding: 12px 25px; box-shadow: 0 0 15px rgba(255,0,60,0.2);"><i class="fa-solid fa-snowflake"></i> SIMULATE 30-DAY ICE-LOCK DELAY</button>
                        <button id="btn-sim-reset-config" class="btn-military btn-military-cyan" style="padding: 12px 25px;"><i class="fa-solid fa-rotate-right"></i> RESET LOGISTICS</button>
                    </div>
                </div>

                <!-- ================= GLOWING DIVIDER ================= -->
                <div style="flex-shrink: 0; margin: 40px 0; border-bottom: 2px solid rgba(0, 229, 255, 0.3); box-shadow: 0 5px 15px rgba(0,229,255,0.1);"></div>

                <!-- ================= BOTTOM PANEL: CAMPAIGN TRACKER ================= -->
                <div class="dash-header" style="flex-shrink: 0; margin-bottom: 20px;">
                    <h2 style="color: #fff; font-size: 1.5rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0;">CAMPAIGN PHASES & SCHEDULE EXECUTION</h2>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">HARDCORE DATA-RICH TRACKER</p>
                </div>

                <div class="campaign-tracker-list" style="flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; padding-bottom: 50px;">
                    <!-- PHASE 1 -->
                    <div class="phase-card completed">
                        <div class="phase-header">
                            <div>
                                <span class="phase-num">PHASE 01</span>
                                <span class="phase-title">Expedition Mobilization & Departure</span>
                            </div>
                            <div class="phase-meta">
                                <span class="phase-date"><i class="fa-regular fa-calendar"></i> 15 Oct - 15 Nov 2026</span>
                                <span class="phase-badge badge-completed">COMPLETED</span>
                            </div>
                        </div>
                        <div class="phase-body">
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Scientific personnel medical clearance sign-off (AIIMS Medical Board)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Cold-region survival training in Auli, Uttarakhand (ITBP/NCPOR)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Goa Central Depot container packing & sealing (NCPOR Logistics)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                        </div>
                    </div>

                    <!-- PHASE 2 -->
                    <div class="phase-card completed">
                        <div class="phase-header">
                            <div>
                                <span class="phase-num">PHASE 02</span>
                                <span class="phase-title">Cargo Staging & Customs Cutoff</span>
                            </div>
                            <div class="phase-meta">
                                <span class="phase-date"><i class="fa-regular fa-calendar"></i> 16 Nov - 04 Dec 2026</span>
                                <span class="phase-badge badge-completed">COMPLETED</span>
                            </div>
                        </div>
                        <div class="phase-body">
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Hazardous chemicals & lithium battery sea-freight booking (DG Shipping India)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Cape Town bonded harbor intake & RFID tagging (South African Port Agent)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>MV Vasiliy Golovnin heavy crane loading (Vessel Master)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                        </div>
                    </div>

                    <!-- PHASE 3 -->
                    <div class="phase-card active">
                        <div class="phase-header">
                            <div>
                                <span class="phase-num" style="color:#00E5FF; text-shadow: 0 0 5px #00E5FF;">PHASE 03</span>
                                <span class="phase-title" style="text-shadow: 0 0 8px rgba(255,255,255,0.2);">Southern Ocean Transport & Ice Window</span>
                            </div>
                            <div class="phase-meta">
                                <span class="phase-date"><i class="fa-regular fa-calendar"></i> 05 Dec 2026 - 10 Jan 2027</span>
                                <span class="phase-badge badge-active">ACTIVE EXECUTION</span>
                            </div>
                        </div>
                        <div class="phase-body">
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Roaring Forties & Furious Fifties ocean crossing (Icebreaker Navigation)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Offshore fast-ice mooring in Prydz Bay (14km from Bharati) (Ship-to-Shore Team)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div><span class="prog-text">100%</span></div></div>
                            <div class="task-row active-task-row"><div class="task-desc"><i class="fa-solid fa-spinner fa-spin" style="color:#00E5FF; margin-right:8px;"></i>Ka-32 helicopter sling load transfers (Weather Hold) (Aviation Wing)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill prog-cyan" style="width: 0%;" data-target="45%"></div></div><span class="prog-text" style="color:#00E5FF; font-weight:bold;">45%</span></div></div>
                        </div>
                    </div>

                    <!-- PHASE 4 -->
                    <div class="phase-card scheduled">
                        <div class="phase-header">
                            <div>
                                <span class="phase-num">PHASE 04</span>
                                <span class="phase-title">Personnel Movement & Station Handover</span>
                            </div>
                            <div class="phase-meta">
                                <span class="phase-date"><i class="fa-regular fa-calendar"></i> 11 Jan - 28 Jan 2027</span>
                                <span class="phase-badge badge-scheduled">SCHEDULED</span>
                            </div>
                        </div>
                        <div class="phase-body">
                            <div class="task-row"><div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>Winter-over crew debrief & clinical check (Dr. Ananya Sen)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div><span class="prog-text">0%</span></div></div>
                            <div class="task-row"><div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>DROMLAN Basler BT-67 flight rotation to Maitri (Air Transport Ops)</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div><span class="prog-text">0%</span></div></div>
                        </div>
                    </div>

                    <!-- PHASE 5 -->
                    <div class="phase-card scheduled">
                        <div class="phase-header">
                            <div>
                                <span class="phase-num">PHASE 05</span>
                                <span class="phase-title">Station Commissioning & Winter Lock-in</span>
                            </div>
                            <div class="phase-meta">
                                <span class="phase-date"><i class="fa-regular fa-calendar"></i> 29 Jan - 15 Mar 2027</span>
                                <span class="phase-badge badge-scheduled">SCHEDULED</span>
                            </div>
                        </div>
                        <div class="phase-body">
                            <div class="task-row"><div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>Ensure all critical life-support systems are online before isolation</div>
                            <div class="task-prog-wrap"><div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div><span class="prog-text">0%</span></div></div>
                        </div>
                    </div>
                </div>
            </div>
`;

// --- 2. REPLACE APP.JS ---
let appJS = fs.readFileSync('js/app.js', 'utf8');
const pStart = appJS.indexOf("'#planner': `");
const pEnd = appJS.indexOf("'#intelligence': `");

if (pStart !== -1 && pEnd !== -1) {
    const pre = appJS.substring(0, pStart);
    const post = appJS.substring(pEnd);
    appJS = pre + "'#planner': `" + htmlContent + "`,\n        " + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Combined dual-panel successfully injected into app.js");
}

// --- 3. COMBINED PLANNER.JS ---
const jsContent = `
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
            dropzone.innerHTML = '<div style="width: 100%; text-align: center; margin-top: 30px; color: #444; font-family: \\'Roboto Mono\\', monospace; font-size: 14px; pointer-events: none;" id="dropzone-hint"><i class="fa-solid fa-down-long" style="font-size: 2rem; margin-bottom: 10px;"></i><br>DRAG ASSETS HERE TO MANIFEST</div>';
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
const observer = new MutationObserver((mutations) => {
    let triggered = false;
    for (let m of mutations) {
        if (m.addedNodes.length > 0) {
            const dualPanel = document.querySelector('.planner-dual-panel');
            if (dualPanel && !triggered) {
                triggered = true;
                document.querySelectorAll('.prog-fill').forEach(bar => { bar.style.width = '0%'; });
                animateProgressBars();
                updateTelemetryUI();
            }
        }
    }
});
observer.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });

// Fallback if already rendered
if(document.querySelector('.planner-dual-panel')) {
    animateProgressBars();
    updateTelemetryUI();
}
`;
fs.writeFileSync('js/planner.js', jsContent);
console.log("Combined Planner JS successfully written.");

// --- 4. SCROLLBAR CSS ---
const cssUpdates = `
/* Planner Dual Panel Custom Scrollbar */
.planner-dual-panel::-webkit-scrollbar { width: 6px; }
.planner-dual-panel::-webkit-scrollbar-track { background: transparent; }
.planner-dual-panel::-webkit-scrollbar-thumb { background: #00E5FF; border-radius: 3px; box-shadow: 0 0 10px rgba(0,229,255,0.8); }
`;
let cssContent = fs.readFileSync('css/main.css', 'utf8');
if (!cssContent.includes('.planner-dual-panel::-webkit-scrollbar')) {
    fs.appendFileSync('css/main.css', cssUpdates);
}
