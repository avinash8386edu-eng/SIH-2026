const fs = require('fs');

// 1. ELITE CSS
let cssContent = fs.readFileSync('css/main.css', 'utf-8');
const eliteCSS = `
/* --- ELITE PLANNER CSS --- */
.elite-planner-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.elite-planner-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.elite-planner-scroll::-webkit-scrollbar-thumb {
    background: rgba(0, 229, 255, 0.4);
    border-radius: 3px;
}
.elite-planner-scroll::-webkit-scrollbar-thumb:hover {
    background: #00E5FF;
    box-shadow: 0 0 10px #00E5FF;
}

@keyframes premium-pulse {
    0% { background-color: rgba(255, 0, 60, 0.05); }
    50% { background-color: rgba(255, 0, 60, 0.15); }
    100% { background-color: rgba(255, 0, 60, 0.05); }
}
.weather-zone-elite {
    animation: premium-pulse 3s infinite;
    border-left: 2px dashed #FF003C;
    pointer-events: none;
    z-index: 1;
    position: relative;
    height: 100%;
}
.weather-badge {
    position: absolute;
    top: -10px;
    left: -2px;
    background: #FF003C;
    color: #fff;
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-size: 9px;
    padding: 3px 8px;
    letter-spacing: 1px;
    white-space: nowrap;
    border-radius: 0 4px 4px 0;
    box-shadow: 0 2px 10px rgba(255,0,60,0.5);
}

.gantt-task-elite {
    background: rgba(0, 229, 255, 0.08);
    border: 1px solid #00E5FF;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0,229,255,0.1);
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}
.gantt-task-elite:hover {
    background: rgba(0, 229, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,229,255,0.3);
}
.gantt-task-elite.danger {
    background: rgba(255, 0, 60, 0.15);
    border-color: #FF003C;
    box-shadow: 0 0 15px rgba(255, 0, 60, 0.4);
    animation: flash-crimson-elite 1s infinite alternate;
}
@keyframes flash-crimson-elite {
    0% { border-color: #FF003C; box-shadow: 0 0 10px rgba(255,0,60,0.2); }
    100% { border-color: #ff3366; box-shadow: 0 0 20px rgba(255,0,60,0.6); background: rgba(255,0,60,0.3); }
}

.chaos-console-elite {
    backdrop-filter: blur(10px);
    background: rgba(10, 17, 40, 0.5);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
}
.btn-military {
    background: transparent;
    border: 1px solid #FF003C;
    color: #FF003C;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s ease;
    padding: 10px 20px;
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-size: 11px;
    border-radius: 4px;
    cursor: pointer;
}
.btn-military:hover {
    background: #FF003C;
    color: #fff;
    box-shadow: 0 0 15px rgba(255,0,60,0.5);
}
.btn-military-cyan {
    border-color: #00E5FF;
    color: #00E5FF;
}
.btn-military-cyan:hover {
    background: #00E5FF;
    color: #000;
    box-shadow: 0 0 15px rgba(0,229,255,0.5);
}
.elite-grid {
    background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 60px 100%;
}
.timeline-header-elite {
    display: grid;
    grid-template-columns: repeat(30, 60px);
    height: 30px;
    align-items: center;
    color: #666;
    font-family: 'Roboto Mono', monospace;
    font-size: 10px;
    border-bottom: 1px solid #222;
    background: #0a0a0a;
}
.timeline-header-elite span {
    border-left: 1px solid rgba(255,255,255,0.05);
    padding-left: 5px;
    height: 100%;
    display: flex;
    align-items: center;
}
`;
if (!cssContent.includes('.elite-planner-scroll')) {
    fs.appendFileSync('css/main.css', eliteCSS);
}

// 2. ELITE HTML IN APP.JS
let appContent = fs.readFileSync('js/app.js', 'utf-8');

// Generate the dates string statically for perfection
let datesHTML = '';
for(let i=15; i<=30; i++) datesHTML += `<span>Nov ${i}</span>`;
for(let i=1; i<=14; i++) datesHTML += `<span>Dec ${i}</span>`;

const eliteHTML = `        '#planner': \`
            <div class="dhruv-dashboard" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; font-family: 'Inter', 'Roboto', 'Segoe UI', sans-serif;">
                
                <!-- HEADER -->
                <div class="dash-header" style="flex-shrink: 0; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0; font-family: 'Inter', sans-serif;">TACTICAL GANTT & SIMULATION ENGINE</h1>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', 'Courier New', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;"><i class="fa-solid fa-satellite-dish"></i> LIVE TELEMETRY SYNC // WHAT-IF SIMULATOR ACTIVE</p>
                </div>

                <!-- MAIN WORKSPACE -->
                <div style="display: flex; gap: 20px; width: 100%; box-sizing: border-box; overflow: hidden; flex: 1; margin-bottom: 20px;">
                    
                    <!-- LEFT: GANTT TIMELINE -->
                    <div style="flex: 1; background: #050505; border: 1px solid #222; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden;">
                        
                        <!-- Dates Header -->
                        <div class="timeline-header-elite" style="padding-left: 20px;">
                            \${'${datesHTML}'}
                        </div>

                        <!-- Grid Body -->
                        <div class="elite-planner-scroll" style="flex: 1; overflow: auto; padding: 20px 20px 20px 20px; position: relative;">
                            <div class="elite-grid" id="gantt-grid" style="display: grid; grid-template-columns: repeat(30, 60px); grid-template-rows: repeat(5, 50px); gap: 15px; position: relative; width: 1800px; height: 100%;">
                                
                                <div class="weather-zone-elite" style="grid-column: 10 / 15; grid-row: 1 / -1; position: absolute; width: 100%;">
                                    <div class="weather-badge"><i class="fa-solid fa-triangle-exclamation"></i> STORM WINDOW</div>
                                </div>
                                
                                <div class="gantt-task-elite" data-id="t1" style="grid-column: 2 / 8; grid-row: 1;">
                                    <i class="fa-solid fa-ship" style="margin-right:8px; color: #00E5FF;"></i> Vessel Transit & Ice Breaking
                                </div>
                                <div class="gantt-task-elite" data-id="t2" style="grid-column: 7 / 11; grid-row: 2;">
                                    <i class="fa-solid fa-helicopter" style="margin-right:8px; color: #00E5FF;"></i> Ka-32 Sling Load Transfer
                                </div>
                                <div class="gantt-task-elite" data-id="t3" style="grid-column: 9 / 13; grid-row: 3;">
                                    <i class="fa-solid fa-icicles" style="margin-right:8px; color: #00E5FF;"></i> Ice-Core Drilling Prep
                                </div>
                                <div class="gantt-task-elite" data-id="t4" style="grid-column: 16 / 25; grid-row: 4;">
                                    <i class="fa-solid fa-truck" style="margin-right:8px; color: #00E5FF;"></i> Overland Traverse (Convoy)
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: CONSTRAINT MATRIX (FIXED WIDTH) -->
                    <div style="width: 320px; flex-shrink: 0; background: #050505; border: 1px solid #222; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; box-sizing: border-box;">
                        <h5 style="color: #fff; font-family: 'Roboto Mono', monospace; font-size: 12px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px; text-transform: uppercase;">AI Constraint Matrix</h5>
                        <div id="constraint-feed" class="elite-planner-scroll" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1;">
                            <div class="constraint-item" style="border-left: 3px solid #00FF66; padding: 12px; background: #0a0a0a; border-radius: 0 4px 4px 0;">
                                <div style="color: #00FF66; font-size: 10px; font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 5px;">FUEL RESERVES: OPTIMAL</div>
                                <div style="font-size: 11px; color: #888; line-height: 1.4;">24 days remaining at Bharati Station.</div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- BOTTOM: CHAOS CONSOLE -->
                <div class="chaos-console-elite" style="flex-shrink: 0; padding: 20px; display: flex; flex-direction: column;">
                    <h5 style="color: #FF003C; font-family: 'Roboto Mono', monospace; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;"><i class="fa-solid fa-radiation"></i> Inject Chaos (What-If Simulator)</h5>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button class="btn-military" id="btn-sim-delay">⚠️ Simulate 5-Day Vessel Delay</button>
                        <button class="btn-military" id="btn-sim-blizzard">❄️ Inject Category 4 Blizzard</button>
                        <div style="flex: 1;"></div>
                        <button class="btn-military btn-military-cyan" id="btn-sim-reset"><i class="fa-solid fa-rotate-left"></i> Reset Timeline</button>
                    </div>
                </div>

                <!-- HIDDEN ASSET SLIDE-IN -->
                <div id="asset-panel" class="asset-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 14px;"><i class="fa-solid fa-link"></i> ASSET ASSIGNMENT</h4>
                        <i class="fa-solid fa-xmark" id="btn-close-asset" style="color: #fff; cursor: pointer;"></i>
                    </div>
                    <div style="background: #111; padding: 15px; border-radius: 4px; margin-bottom: 25px; border: 1px solid #222;">
                        <p style="color: #888; font-size: 10px; margin-bottom: 5px; font-family: 'Roboto Mono', monospace;">TARGET TASK</p>
                        <p id="asset-task-name" style="color: #fff; font-size: 13px; font-weight: 500;">Task Name</p>
                    </div>
                    <label style="color: #888; font-size: 11px; margin-bottom: 10px; display: block; font-family: 'Roboto Mono', monospace;">SELECT VEHICLE / PLATFORM</label>
                    <select id="vehicle-select" style="width: 100%; background: #0a0a0a; color: #fff; border: 1px solid #333; padding: 12px; margin-bottom: 30px; font-family: 'Inter', sans-serif; font-size: 12px; border-radius: 4px; outline: none;">
                        <option value="none">-- Select Asset --</option>
                        <option value="ka32">Kamov Ka-32 Helicopter (Max 3.5t)</option>
                        <option value="pist">PistenBully Traverse Crawler</option>
                        <option value="hagl">Hägglunds Bandvagn 206</option>
                    </select>
                    <button id="btn-assign-asset" class="btn-military btn-military-cyan" style="width: 100%;">CONFIRM DEPLOYMENT</button>
                </div>
            </div>
        \`,
`;

const plannerKey = "'#planner': `";
const intelligenceKey = "'#intelligence': `";
const indexPlanner = appContent.indexOf(plannerKey);
const indexIntelligence = appContent.indexOf(intelligenceKey);

if (indexPlanner !== -1 && indexIntelligence !== -1) {
    appContent = appContent.substring(0, indexPlanner) + eliteHTML + appContent.substring(indexIntelligence);
    fs.writeFileSync('js/app.js', appContent);
}


// 3. UPDATE PLANNER.JS LOGIC TO MATCH ELITE CLASSES
let plannerJSContent = fs.readFileSync('js/planner.js', 'utf-8');
plannerJSContent = plannerJSContent.replace(/.gantt-task/g, '.gantt-task-elite');
plannerJSContent = plannerJSContent.replace(/.weather-zone/g, '.weather-zone-elite');
plannerJSContent = plannerJSContent.replace(/flash-crimson/g, 'flash-crimson-elite');
fs.writeFileSync('js/planner.js', plannerJSContent);

console.log("Elite rewrite complete.");
