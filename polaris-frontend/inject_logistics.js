const fs = require('fs');

// 1. UPDATE APP.JS HTML
let appContent = fs.readFileSync('js/app.js', 'utf-8');

// The dates are still valid, we just reuse datesHTML logic
let datesHTML = '';
for(let i=15; i<=30; i++) datesHTML += `<span>Nov ${i}</span>`;
for(let i=1; i<=14; i++) datesHTML += `<span>Dec ${i}</span>`;

const logisticsPlannerHTML = `        '#planner': \`
            <div class="dhruv-dashboard" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; font-family: 'Inter', 'Roboto', 'Segoe UI', sans-serif;">
                
                <!-- HEADER -->
                <div class="dash-header" style="flex-shrink: 0; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0; font-family: 'Inter', sans-serif;">TACTICAL GANTT & LOGISTICS ENGINE</h1>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', 'Courier New', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;"><i class="fa-solid fa-satellite-dish"></i> ASSET TRACKING SYNC // WHAT-IF SIMULATOR ACTIVE</p>
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
                                
                                <div class="weather-zone-elite" style="grid-column: 16 / 21; grid-row: 1 / -1; position: absolute; width: 100%;">
                                    <div class="weather-badge"><i class="fa-solid fa-triangle-exclamation"></i> STORM WINDOW</div>
                                </div>
                                
                                <div class="gantt-task-elite" data-id="t1" style="grid-column: 2 / 6; grid-row: 1;">
                                    <i class="fa-solid fa-box" style="margin-right:8px; color: #00E5FF;"></i> [Goa Depot] AL-1403 Cargo Manifest & RFID
                                </div>
                                <div class="gantt-task-elite" data-id="t2" style="grid-column: 7 / 13; grid-row: 2;">
                                    <i class="fa-solid fa-temperature-arrow-down" style="margin-right:8px; color: #00E5FF;"></i> [Cape Town] Cold-Chain Med-Kits & Heavy Machinery
                                </div>
                                <div class="gantt-task-elite" data-id="t3" style="grid-column: 18 / 23; grid-row: 3;">
                                    <i class="fa-solid fa-helicopter" style="margin-right:8px; color: #00E5FF;"></i> [Ice Shelf] Ka-32 Heli-Sling Offload (Assets)
                                </div>
                                <div class="gantt-task-elite" data-id="t4" style="grid-column: 23 / 28; grid-row: 4;">
                                    <i class="fa-solid fa-gas-pump" style="margin-right:8px; color: #00E5FF;"></i> [Bharati Base] Bulk Polar Diesel Reserve Pumping
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: CONSTRAINT MATRIX (FIXED WIDTH) -->
                    <div style="width: 320px; flex-shrink: 0; background: #050505; border: 1px solid #222; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; box-sizing: border-box;">
                        <h5 style="color: #fff; font-family: 'Roboto Mono', monospace; font-size: 12px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px; text-transform: uppercase;">Logistics Constraint Matrix</h5>
                        <div id="constraint-feed" class="elite-planner-scroll" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1;">
                            
                            <div id="constraint-fuel" class="constraint-item" style="border-left: 3px solid #00FF66; padding: 12px; background: #0a0a0a; border-radius: 0 4px 4px 0; transition: all 0.3s ease;">
                                <div class="c-title" style="color: #00FF66; font-size: 10px; font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 5px;">FUEL RESERVES: OPTIMAL</div>
                                <div class="c-desc" style="font-size: 11px; color: #888; line-height: 1.4; font-family: 'Inter', sans-serif;">24 Days Remaining. Sufficient runway for operations.</div>
                            </div>

                            <div id="constraint-cargo" class="constraint-item" style="border-left: 3px solid #00E5FF; padding: 12px; background: #0a0a0a; border-radius: 0 4px 4px 0;">
                                <div class="c-title" style="color: #00E5FF; font-size: 10px; font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 5px;">CARGO TONNAGE: MONITORED</div>
                                <div class="c-desc" style="font-size: 11px; color: #888; line-height: 1.4; font-family: 'Inter', sans-serif;">1,842 Tonnes Stowed (94% Deck Limit).</div>
                            </div>

                            <div id="constraint-temp" class="constraint-item" style="border-left: 3px solid #00FF66; padding: 12px; background: #0a0a0a; border-radius: 0 4px 4px 0; transition: all 0.3s ease;">
                                <div class="c-title" style="color: #00FF66; font-size: 10px; font-family: 'Roboto Mono', monospace; font-weight: bold; margin-bottom: 5px;">COLD-CHAIN STATUS: NOMINAL</div>
                                <div class="c-desc" style="font-size: 11px; color: #888; line-height: 1.4; font-family: 'Inter', sans-serif;">-20°C Maintained across Hold 3.</div>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- BOTTOM: CHAOS CONSOLE -->
                <div class="chaos-console-elite" style="flex-shrink: 0; padding: 20px; display: flex; flex-direction: column;">
                    <h5 style="color: #FF003C; font-family: 'Roboto Mono', monospace; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;"><i class="fa-solid fa-boxes-stacked"></i> Inject Chaos (Asset Simulator)</h5>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button class="btn-military" id="btn-sim-delay">⚠️ Simulate 5-Day Transit Delay</button>
                        <button class="btn-military" id="btn-sim-coldchain">🌡️ Simulate Cold-Chain Failure</button>
                        <div style="flex: 1;"></div>
                        <button class="btn-military btn-military-cyan" id="btn-sim-reset"><i class="fa-solid fa-rotate-left"></i> Reset Asset Timeline</button>
                    </div>
                </div>
            </div>
        \`,
`;

const plannerKey = "'#planner': `";
const intelligenceKey = "'#intelligence': `";
const indexPlanner = appContent.indexOf(plannerKey);
const indexIntelligence = appContent.indexOf(intelligenceKey);

if (indexPlanner !== -1 && indexIntelligence !== -1) {
    appContent = appContent.substring(0, indexPlanner) + logisticsPlannerHTML + appContent.substring(indexIntelligence);
    fs.writeFileSync('js/app.js', appContent);
}

// 2. UPDATE PLANNER.JS LOGIC
const plannerJS = `
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-sim-delay')) simulateDelay();
    if (e.target.closest('#btn-sim-coldchain')) simulateColdChainFailure();
    if (e.target.closest('#btn-sim-reset')) resetTimeline();
});

const origPos = {
    't1': { start: 2, end: 6 },
    't2': { start: 7, end: 13 },
    't3': { start: 18, end: 23 },
    't4': { start: 23, end: 28 }
};

function simulateDelay() {
    // Shift tasks visually to the right
    shiftTask('t3', 5);
    shiftTask('t4', 5);
    
    // Check if overlap happens
    checkOverlaps();
    
    // Trigger critical logistics constraint alert
    const fuelConstraint = document.getElementById('constraint-fuel');
    if (fuelConstraint) {
        fuelConstraint.style.borderLeftColor = '#FF003C';
        fuelConstraint.style.background = 'rgba(255, 0, 60, 0.15)';
        fuelConstraint.style.animation = 'flash-crimson-elite 1s infinite alternate';
        
        fuelConstraint.querySelector('.c-title').style.color = '#FF003C';
        fuelConstraint.querySelector('.c-title').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> FUEL RESERVES: CRITICAL (6.9 DAYS)';
        
        fuelConstraint.querySelector('.c-desc').style.color = '#eee';
        fuelConstraint.querySelector('.c-desc').innerHTML = 'CRITICAL INVENTORY ALERT: Due to delay, Bharati Station Polar Diesel runway drops below 14-day safety threshold. Action required.';
    }
}

function simulateColdChainFailure() {
    // Make T2 flash RED
    const t2 = document.querySelector('.gantt-task-elite[data-id="t2"]');
    if (t2) {
        t2.classList.add('danger');
        if (!t2.innerHTML.includes('⚠️')) t2.innerHTML += ' ⚠️';
    }
    
    // Trigger constraint alert
    const tempConstraint = document.getElementById('constraint-temp');
    if (tempConstraint) {
        tempConstraint.style.borderLeftColor = '#FF003C';
        tempConstraint.style.background = 'rgba(255, 0, 60, 0.15)';
        tempConstraint.style.animation = 'flash-crimson-elite 1s infinite alternate';
        
        tempConstraint.querySelector('.c-title').style.color = '#FF003C';
        tempConstraint.querySelector('.c-title').innerHTML = '<i class="fa-solid fa-temperature-arrow-down"></i> COLD-CHAIN: FAILURE DETECTED';
        
        tempConstraint.querySelector('.c-desc').style.color = '#eee';
        tempConstraint.querySelector('.c-desc').innerHTML = 'ASSET COMPROMISE: Cargo Hold 3 temp anomaly detected. Frostbite Med-Kits batch marked as EXPIRED/VOID. Re-order queued.';
    }
}

function resetTimeline() {
    // Reset positions
    Object.keys(origPos).forEach(id => {
        const el = document.querySelector(\`.gantt-task-elite[data-id="\${id}"]\`);
        if (el) {
            el.style.gridColumn = \`\${origPos[id].start} / \${origPos[id].end}\`;
            el.classList.remove('danger');
            el.innerHTML = el.innerHTML.replace(' ⚠️', '');
        }
    });
    
    // Reset Fuel Alert
    const fuelConstraint = document.getElementById('constraint-fuel');
    if (fuelConstraint) {
        fuelConstraint.style.borderLeftColor = '#00FF66';
        fuelConstraint.style.background = '#0a0a0a';
        fuelConstraint.style.animation = 'none';
        
        fuelConstraint.querySelector('.c-title').style.color = '#00FF66';
        fuelConstraint.querySelector('.c-title').innerText = 'FUEL RESERVES: OPTIMAL';
        
        fuelConstraint.querySelector('.c-desc').style.color = '#888';
        fuelConstraint.querySelector('.c-desc').innerText = '24 Days Remaining. Sufficient runway for operations.';
    }
    
    // Reset Cold-Chain Alert
    const tempConstraint = document.getElementById('constraint-temp');
    if (tempConstraint) {
        tempConstraint.style.borderLeftColor = '#00FF66';
        tempConstraint.style.background = '#0a0a0a';
        tempConstraint.style.animation = 'none';
        
        tempConstraint.querySelector('.c-title').style.color = '#00FF66';
        tempConstraint.querySelector('.c-title').innerText = 'COLD-CHAIN STATUS: NOMINAL';
        
        tempConstraint.querySelector('.c-desc').style.color = '#888';
        tempConstraint.querySelector('.c-desc').innerText = '-20°C Maintained across Hold 3.';
    }
}

function shiftTask(id, days) {
    const el = document.querySelector(\`.gantt-task-elite[data-id="\${id}"]\`);
    if (el) {
        const match = el.style.gridColumn.match(/(\\d+)\\s*\\/\\s*(\\d+)/);
        if (match) {
            const s = parseInt(match[1]) + days;
            const e = parseInt(match[2]) + days;
            el.style.gridColumn = \`\${s} / \${e}\`;
        }
    }
}

function checkOverlaps() {
    const weatherZone = document.querySelector('.weather-zone-elite');
    if (!weatherZone) return;
    const wzMatch = weatherZone.style.gridColumn.match(/(\\d+)\\s*\\/\\s*(\\d+)/);
    if (!wzMatch) return;
    const wzS = parseInt(wzMatch[1]);
    const wzE = parseInt(wzMatch[2]);

    document.querySelectorAll('.gantt-task-elite').forEach(task => {
        const match = task.style.gridColumn.match(/(\\d+)\\s*\\/\\s*(\\d+)/);
        if (match) {
            const ts = parseInt(match[1]);
            const te = parseInt(match[2]);
            if (ts < wzE && te > wzS) {
                task.classList.add('danger');
                if (!task.innerHTML.includes('⚠️')) task.innerHTML += ' ⚠️';
            }
        }
    });
}
`;
fs.writeFileSync('js/planner.js', plannerJS);

console.log("Logistics Matrix Update Complete.");
