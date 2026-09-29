const fs = require('fs');

// 1. UPDATE CSS
let cssContent = fs.readFileSync('css/main.css', 'utf-8');
const newCSS = `
/* --- TACTICAL GANTT CSS --- */
.gantt-grid {
    background-image: linear-gradient(to right, #111 1px, transparent 1px);
    background-size: 40px 100%;
}
.weather-zone {
    background: repeating-linear-gradient(45deg, rgba(255, 51, 51, 0.1), rgba(255, 51, 51, 0.1) 10px, rgba(255, 51, 51, 0) 10px, rgba(255, 51, 51, 0) 20px);
    border: 1px solid rgba(255, 51, 51, 0.3);
    pointer-events: none;
    z-index: 1;
}
.gantt-task {
    background: rgba(0, 229, 255, 0.15);
    border: 1px solid var(--accent-cyan);
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 2;
    overflow: hidden;
    white-space: nowrap;
}
.gantt-task:hover {
    background: rgba(0, 229, 255, 0.25);
    transform: scale(1.02);
}
.gantt-task.danger {
    animation: flash-crimson 0.8s infinite alternate;
}
.asset-panel {
    position: fixed;
    right: -400px;
    top: 0;
    width: 350px;
    height: 100vh;
    background: rgba(5,5,5,0.98);
    border-left: 1px solid #333;
    box-shadow: -10px 0 30px rgba(0,0,0,0.8);
    padding: 30px;
    transition: right 0.3s ease;
    z-index: 9999;
}
.asset-panel.open {
    right: 0;
}
.btn-chaos {
    background: rgba(255,51,51,0.1);
    border: 1px solid var(--alert-red);
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 11px;
    transition: 0.2s;
}
.btn-chaos:hover {
    background: rgba(255,51,51,0.2);
    box-shadow: 0 0 10px rgba(255,51,51,0.4);
}
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}
@keyframes flash-crimson {
    0% { border-color: var(--alert-red); box-shadow: 0 0 10px rgba(255,51,51,0.2); background: rgba(255,51,51,0.2); }
    100% { border-color: #ff6666; box-shadow: 0 0 20px rgba(255,51,51,0.8); background: rgba(255,51,51,0.4); }
}
`;
if (!cssContent.includes('.gantt-grid')) {
    fs.appendFileSync('css/main.css', newCSS);
}


// 2. CREATE JS/PLANNER.JS
const plannerJS = `
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-sim-delay')) simulateDelay();
    if (e.target.closest('#btn-sim-blizzard')) injectBlizzard();
    if (e.target.closest('#btn-sim-reset')) resetTimeline();
    
    const task = e.target.closest('.gantt-task');
    if (task) openAssetPanel(task);
    
    if (e.target.closest('#btn-assign-asset')) assignAsset();
    if (e.target.closest('#btn-close-asset')) document.getElementById('asset-panel').classList.remove('open');
});

let currentSelectedTask = null;

const origPos = {
    't1': { start: 2, end: 10 },
    't2': { start: 10, end: 14 },
    't3': { start: 12, end: 16 },
    't4': { start: 18, end: 25 }
};

function simulateDelay() {
    shiftTask('t2', 5);
    shiftTask('t3', 5);
    
    const feed = document.getElementById('constraint-feed');
    if (feed) {
        feed.innerHTML = \`
            <div class="constraint-item" style="border-left: 3px solid var(--alert-red); padding: 10px; background: rgba(255,51,51,0.05); animation: flash-crimson 1s infinite alternate; margin-bottom: 10px;">
                <div style="color: var(--alert-red); font-size: 11px; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FUEL ALERT</div>
                <div style="font-size: 10px; color: #ccc; margin-top: 5px;">Bharati Station Fuel Runway drops below 14-day safety threshold due to vessel delay.</div>
            </div>
        \` + feed.innerHTML;
    }
    checkOverlaps();
}

function injectBlizzard() {
    const weatherZone = document.querySelector('.weather-zone');
    if (weatherZone) {
        weatherZone.style.gridColumn = '10 / 18'; // Expand over t2 and t3
        checkOverlaps();
    }
}

function resetTimeline() {
    Object.keys(origPos).forEach(id => {
        const el = document.querySelector(\`.gantt-task[data-id="\${id}"]\`);
        if (el) {
            el.style.gridColumn = \`\${origPos[id].start} / \${origPos[id].end}\`;
            el.classList.remove('danger');
            el.innerHTML = el.innerHTML.replace(' ⚠️', '');
        }
    });
    const weatherZone = document.querySelector('.weather-zone');
    if (weatherZone) weatherZone.style.gridColumn = '15 / 19';
    
    const feed = document.getElementById('constraint-feed');
    if (feed) {
        feed.innerHTML = \`
            <div class="constraint-item" style="border-left: 3px solid var(--success-green); padding: 10px; background: #0a0a0a;">
                <div style="color: var(--success-green); font-size: 11px;">FUEL RESERVES: OPTIMAL</div>
                <div style="font-size: 10px; color: #666;">24 days remaining.</div>
            </div>
        \`;
    }
    document.getElementById('asset-panel').classList.remove('open');
}

function shiftTask(id, days) {
    const el = document.querySelector(\`.gantt-task[data-id="\${id}"]\`);
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
    const weatherZone = document.querySelector('.weather-zone');
    if (!weatherZone) return;
    const wzMatch = weatherZone.style.gridColumn.match(/(\\d+)\\s*\\/\\s*(\\d+)/);
    if (!wzMatch) return;
    const wzS = parseInt(wzMatch[1]);
    const wzE = parseInt(wzMatch[2]);

    document.querySelectorAll('.gantt-task').forEach(task => {
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

function openAssetPanel(taskEl) {
    currentSelectedTask = taskEl;
    const panel = document.getElementById('asset-panel');
    if (panel) {
        panel.classList.add('open');
        document.getElementById('asset-task-name').innerText = taskEl.innerText.replace('⚠️', '').trim();
        document.getElementById('vehicle-select').value = 'none';
    }
}

function assignAsset() {
    const sel = document.getElementById('vehicle-select').value;
    if (sel === 'ka32' && currentSelectedTask && currentSelectedTask.classList.contains('danger')) {
        const panel = document.getElementById('asset-panel');
        panel.style.animation = 'shake 0.5s';
        setTimeout(() => { panel.style.animation = ''; }, 500);
        
        const feed = document.getElementById('constraint-feed');
        if (feed) {
            feed.innerHTML = \`
                <div class="constraint-item" style="border-left: 3px solid #FFCC00; padding: 10px; background: rgba(255,204,0,0.05); margin-bottom: 10px;">
                    <div style="color: #FFCC00; font-size: 11px; font-weight: bold;">ASSIGNMENT REJECTED</div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 5px;">Cannot assign Ka-32 Helicopter during active Katabatic storm window. Wind > 35kts.</div>
                </div>
            \` + feed.innerHTML;
        }
    } else if (sel !== 'none') {
        const panel = document.getElementById('asset-panel');
        panel.classList.remove('open');
        currentSelectedTask.innerHTML += ' <i class="fa-solid fa-check" style="color:var(--success-green); margin-left:10px;"></i>';
    }
}
`;
fs.writeFileSync('js/planner.js', plannerJS);

// 3. LINK IN INDEX.HTML
let indexHTML = fs.readFileSync('index.html', 'utf-8');
if (!indexHTML.includes('planner.js')) {
    indexHTML = indexHTML.replace('</body>', '    <script src="js/planner.js"></script>\n</body>');
    fs.writeFileSync('index.html', indexHTML);
}

// 4. UPDATE APP.JS WITH HTML
let appContent = fs.readFileSync('js/app.js', 'utf-8');

const ganttHTML = `        '#planner': \`
            <div class="dhruv-dashboard" style="height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative;">
                
                <div class="dash-header" style="flex-shrink: 0; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h1 class="serif-title" style="color: #fff; font-size: 1.8rem; letter-spacing: 2px;">TACTICAL GANTT & SIMULATION ENGINE</h1>
                            <p style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 12px; margin-top: 5px;"><i class="fa-solid fa-satellite-dish"></i> LIVE TELEMETRY SYNC // WHAT-IF SIMULATOR ACTIVE</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 20px; flex: 2; overflow: hidden; margin-bottom: 20px;">
                    
                    <div class="gantt-wrapper" style="flex: 3; background: #050505; border: 1px solid #222; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; position: relative;">
                        <div style="padding: 10px 20px; background: #0a0a0a; border-bottom: 1px solid #222; display: flex; justify-content: space-between;">
                            <span style="font-family: var(--font-mono); font-size: 11px; color: #888;">TIMELINE: NOV 15 - DEC 15 (DAY 1 TO 30)</span>
                            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--alert-red);"><i class="fa-solid fa-cloud-showers-heavy"></i> WEATHER ALERT ZONES ACTIVE</span>
                        </div>
                        <div class="gantt-scroll" style="flex: 1; overflow-x: auto; overflow-y: hidden; padding: 20px;">
                            
                            <div class="gantt-grid" id="gantt-grid" style="display: grid; grid-template-columns: repeat(30, 40px); grid-template-rows: repeat(4, 50px); gap: 10px; position: relative; height: 100%;">
                                
                                <div class="weather-zone" title="Forecasted Katabatic Storm Window" style="grid-column: 15 / 19; grid-row: 1 / -1; position: absolute; height: 100%; width: 100%;"></div>
                                
                                <div class="gantt-task" data-id="t1" style="grid-column: 2 / 10; grid-row: 1;">
                                    <span class="task-label"><i class="fa-solid fa-ship" style="margin-right:5px;"></i> Vessel Transit & Ice Breaking</span>
                                </div>
                                <div class="gantt-task" data-id="t2" style="grid-column: 10 / 14; grid-row: 2;">
                                    <span class="task-label"><i class="fa-solid fa-helicopter" style="margin-right:5px;"></i> Ka-32 Sling Load Transfer</span>
                                </div>
                                <div class="gantt-task" data-id="t3" style="grid-column: 12 / 16; grid-row: 3;">
                                    <span class="task-label"><i class="fa-solid fa-icicles" style="margin-right:5px;"></i> Ice-Core Drilling Prep</span>
                                </div>
                                <div class="gantt-task" data-id="t4" style="grid-column: 18 / 25; grid-row: 4;">
                                    <span class="task-label"><i class="fa-solid fa-truck" style="margin-right:5px;"></i> Overland Traverse (Convoy)</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="constraint-sidebar" style="flex: 1; background: #050505; border: 1px solid #222; border-radius: 8px; padding: 20px; display: flex; flex-direction: column;">
                        <h5 style="color: #fff; font-family: var(--font-mono); font-size: 12px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px;">AI CONSTRAINT MATRIX</h5>
                        <div id="constraint-feed" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
                            <div class="constraint-item" style="border-left: 3px solid var(--success-green); padding: 10px; background: #0a0a0a;">
                                <div style="color: var(--success-green); font-size: 11px;">FUEL RESERVES: OPTIMAL</div>
                                <div style="font-size: 10px; color: #666; margin-top: 5px;">24 days remaining.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chaos-panel" style="flex-shrink: 0; background: rgba(255, 51, 51, 0.02); border: 1px solid rgba(255,51,51,0.2); border-radius: 8px; padding: 20px; display: flex; flex-direction: column;">
                    <h5 style="color: var(--alert-red); font-family: var(--font-mono); margin-bottom: 15px; font-size: 12px;"><i class="fa-solid fa-radiation"></i> INJECT CHAOS (WHAT-IF SIMULATOR)</h5>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button class="btn-chaos" id="btn-sim-delay">⚠️ Simulate 5-Day Vessel Delay</button>
                        <button class="btn-chaos" id="btn-sim-blizzard">❄️ Inject Category 4 Blizzard</button>
                        <div style="flex: 1;"></div>
                        <button class="btn-cyber" id="btn-sim-reset" style="padding: 8px 15px; font-size: 11px;"><i class="fa-solid fa-rotate-left"></i> Reset Timeline</button>
                    </div>
                </div>
                
                <div id="asset-panel" class="asset-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 14px;"><i class="fa-solid fa-link"></i> ASSET ASSIGNMENT</h4>
                        <i class="fa-solid fa-xmark" id="btn-close-asset" style="color: #fff; cursor: pointer;"></i>
                    </div>
                    
                    <div style="background: #111; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                        <p style="color: #888; font-size: 10px; margin-bottom: 5px;">TARGET TASK</p>
                        <p id="asset-task-name" style="color: #fff; font-size: 14px; font-weight: 500;">Task Name</p>
                    </div>
                    
                    <label style="color: #888; font-size: 11px; margin-bottom: 10px; display: block;">SELECT VEHICLE / PLATFORM</label>
                    <select id="vehicle-select" style="width: 100%; background: #111; color: #fff; border: 1px solid #333; padding: 12px; margin-bottom: 30px; font-family: var(--font-sans); border-radius: 4px; outline: none;">
                        <option value="none">-- Select Asset --</option>
                        <option value="ka32">Kamov Ka-32 Helicopter (Max 3.5t)</option>
                        <option value="pist">PistenBully Traverse Crawler</option>
                        <option value="hagl">Hägglunds Bandvagn 206</option>
                    </select>
                    
                    <button id="btn-assign-asset" class="btn-cyber" style="width: 100%; border-color: var(--accent-cyan); color: var(--accent-cyan); box-shadow: 0 0 10px rgba(0,229,255,0.2);">CONFIRM DEPLOYMENT</button>
                </div>

            </div>
        \`,
`;

const plannerKey = "'#planner': `";
const intelligenceKey = "'#intelligence': `";
const indexPlanner = appContent.indexOf(plannerKey);
const indexIntelligence = appContent.indexOf(intelligenceKey);

if (indexPlanner !== -1 && indexIntelligence !== -1) {
    appContent = appContent.substring(0, indexPlanner) + ganttHTML + appContent.substring(indexIntelligence);
    fs.writeFileSync('js/app.js', appContent);
    console.log("Successfully deployed Dynamic Tactical Gantt Engine!");
} else {
    console.log("Error finding planner view bounds in app.js.");
}
