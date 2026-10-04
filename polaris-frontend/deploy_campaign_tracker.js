const fs = require('fs');

// --- 1. NEW HTML CONTENT FOR CAMPAIGN TRACKER ---
const trackerHTML = `
            <div class="dhruv-dashboard campaign-tracker" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif;">
                
                <!-- HEADER -->
                <div class="dash-header" style="flex-shrink: 0; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0; font-family: 'Inter', sans-serif;">CAMPAIGN PHASES & SCHEDULE EXECUTION</h1>
                    <p style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0;"><i class="fa-solid fa-satellite-dish"></i> ELITE MILITARY LOGISTICS TIMELINE // 46TH ISEA</p>
                </div>
                
                <!-- LIST CONTAINER -->
                <div class="elite-planner-scroll" style="flex: 1; overflow-y: auto; padding-right: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
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
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Scientific personnel medical clearance sign-off (AIIMS Medical Board)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Cold-region survival training in Auli, Uttarakhand (ITBP/NCPOR)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Goa Central Depot container packing & sealing (NCPOR Logistics)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
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
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Hazardous chemicals & lithium battery sea-freight booking (DG Shipping India)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Cape Town bonded harbor intake & RFID tagging (South African Port Agent)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>MV Vasiliy Golovnin heavy crane loading (Vessel Master)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
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
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Roaring Forties & Furious Fifties ocean crossing (Icebreaker Navigation)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-solid fa-check" style="color:#00FF66; margin-right:8px;"></i>Offshore fast-ice mooring in Prydz Bay (14km from Bharati) (Ship-to-Shore Team)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-green" style="width: 0%;" data-target="100%"></div></div>
                                        <span class="prog-text">100%</span>
                                    </div>
                                </div>
                                <div class="task-row active-task-row">
                                    <div class="task-desc"><i class="fa-solid fa-spinner fa-spin" style="color:#00E5FF; margin-right:8px;"></i>Ka-32 helicopter sling load transfers (Weather Hold) (Aviation Wing)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill prog-cyan" style="width: 0%;" data-target="45%"></div></div>
                                        <span class="prog-text" style="color:#00E5FF; font-weight:bold;">45%</span>
                                    </div>
                                </div>
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
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>Winter-over crew debrief & clinical check (Dr. Ananya Sen)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div>
                                        <span class="prog-text">0%</span>
                                    </div>
                                </div>
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>DROMLAN Basler BT-67 flight rotation to Maitri (Air Transport Ops)</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div>
                                        <span class="prog-text">0%</span>
                                    </div>
                                </div>
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
                                <div class="task-row">
                                    <div class="task-desc"><i class="fa-regular fa-circle" style="color:#444; margin-right:8px;"></i>Ensure all critical life-support systems are online before isolation</div>
                                    <div class="task-prog-wrap">
                                        <div class="prog-bg"><div class="prog-fill" style="width: 0%;" data-target="0%"></div></div>
                                        <span class="prog-text">0%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

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
    appJS = pre + "'#planner': `" + trackerHTML + "`,\n        " + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Successfully replaced #planner in app.js with Campaign Tracker");
} else {
    console.error("Could not find planner or intelligence anchors in app.js");
    process.exit(1);
}


// --- 3. CSS ADDITIONS FOR CAMPAIGN TRACKER ---
let cssContent = fs.readFileSync('css/main.css', 'utf8');
const newCSS = `
/* --- ELITE CAMPAIGN TRACKER STYLES --- */
.phase-card {
    background: #050505;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}
.phase-card.completed {
    border-color: #1a1a1a;
    opacity: 0.7;
}
.phase-card.active {
    border: 1px solid #00E5FF;
    box-shadow: 0 0 15px rgba(0,229,255,0.15);
    background: rgba(0,229,255,0.02);
}
.phase-card.scheduled {
    border-color: #1a1a1a;
}
.phase-header {
    padding: 15px 20px;
    border-bottom: 1px solid #222;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0a0a0a;
}
.phase-card.active .phase-header {
    border-bottom: 1px solid rgba(0,229,255,0.3);
    background: rgba(0,229,255,0.08);
}
.phase-num {
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
    font-weight: bold;
    color: #666;
    margin-right: 15px;
    letter-spacing: 1px;
}
.phase-title {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
    letter-spacing: 0.5px;
}
.phase-meta {
    display: flex;
    align-items: center;
    gap: 20px;
}
.phase-date {
    color: #888;
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
}
.phase-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 10px;
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    letter-spacing: 1px;
}
.badge-completed { background: rgba(0,255,102,0.1); color: #00FF66; border: 1px solid #00FF66; }
.badge-active { background: rgba(0,229,255,0.15); color: #00E5FF; border: 1px solid #00E5FF; box-shadow: 0 0 10px rgba(0,229,255,0.3); }
.badge-scheduled { background: #111; color: #555; border: 1px solid #333; }

.phase-body {
    padding: 15px 20px;
}
.task-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #151515;
}
.task-row:last-child {
    border-bottom: none;
}
.task-desc {
    color: #aaa;
    font-size: 13px;
    flex: 1;
    padding-right: 20px;
    font-family: 'Inter', sans-serif;
}
.active-task-row .task-desc {
    color: #fff;
}
.task-prog-wrap {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 250px;
}
.prog-bg {
    flex: 1;
    height: 6px;
    background: #1a1a1a;
    border-radius: 3px;
    overflow: hidden;
}
.prog-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.prog-green { background: #00FF66; box-shadow: 0 0 10px #00FF66; }
.prog-cyan { background: #00E5FF; box-shadow: 0 0 10px #00E5FF; }
.prog-text {
    color: #888;
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
    width: 40px;
    text-align: right;
}
`;
if (!cssContent.includes('.phase-card')) {
    fs.appendFileSync('css/main.css', newCSS);
}


// --- 4. REWRITE PLANNER.JS ---
const trackerJS = `
// Logic to animate progress bars on load
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
            const tracker = document.querySelector('.campaign-tracker');
            if (tracker && !triggered) {
                triggered = true;
                // Reset to 0 first to ensure animation plays again if user navigates back and forth
                document.querySelectorAll('.prog-fill').forEach(bar => { bar.style.width = '0%'; });
                animateProgressBars();
            }
        }
    }
});
observer.observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true });

// Fallback if already rendered
if(document.querySelector('.campaign-tracker')) {
    animateProgressBars();
}
`;
fs.writeFileSync('js/planner.js', trackerJS);
console.log("Campaign Tracker JS injected.");
