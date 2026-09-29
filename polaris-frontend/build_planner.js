const fs = require('fs');

// 1. UPDATE CSS
let cssContent = fs.readFileSync('css/main.css', 'utf-8');

const newCSS = `
/* Planner Specifics */
.task-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.task-name {
    font-size: 13px;
    color: #ddd;
}
.task-meta {
    font-size: 11px;
    color: #666;
    margin-left: 8px;
}
.task-progress {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 300px;
}
.progress-track {
    flex: 1;
    height: 4px;
    background: #222;
    border-radius: 2px;
    overflow: visible; /* To allow glow */
}
.progress-fill {
    height: 100%;
    background: #fff;
    box-shadow: 0 0 8px rgba(255,255,255,0.8);
    border-radius: 2px;
}
.progress-pct {
    font-size: 11px;
    color: #888;
    font-family: var(--font-mono);
    width: 35px;
    text-align: right;
}
`;

if (!cssContent.includes('.task-row')) {
    fs.appendFileSync('css/main.css', newCSS);
}


// 2. UPDATE APP.JS
let appContent = fs.readFileSync('js/app.js', 'utf-8');

const plannerHTML = `        '#planner': \`
            <div class="dhruv-dashboard">
                <div class="dash-header">
                    <div class="dash-meta" style="display:flex; justify-content:space-between;">
                        <div><i class="fa-solid fa-arrow-left"></i> &nbsp; Back to 46th ISEA</div>
                        <div style="color: #FFCC00; border: 1px solid rgba(255, 204, 0, 0.3); padding: 4px 12px; border-radius: 4px; font-size: 11px; letter-spacing: 1px; background: rgba(255,204,0,0.1);">
                            <span class="dot" style="background:#FFCC00; box-shadow:0 0 5px #FFCC00; display:inline-block; width:6px; height:6px; border-radius:50%; margin-right:5px;"></span> PHASE 3 ACTIVE (WEATHER HOLD)
                        </div>
                    </div>
                    <div class="dash-title-row" style="margin-bottom: 30px;">
                        <div>
                            <h1 class="serif-title">EXPEDITION PLANNING WORKSPACE</h1>
                            <p class="dash-subtitle">Constraint-driven visual scheduling across transport windows, payloads, and station reserves.</p>
                        </div>
                        <div class="dash-actions">
                            <button class="btn-cyber" onclick="window.location.hash='#intelligence'" style="border-color: var(--accent-cyan); color: var(--accent-cyan);"><i class="fa-solid fa-microchip"></i> RUN AI OPTIMIZER</button>
                            <button class="btn-outline"><i class="fa-solid fa-download"></i> Export Gantt</button>
                        </div>
                    </div>
                </div>

                <h4 class="section-title">OPERATIONAL CONSTRAINTS • REAL-TIME ENFORCEMENT <span style="float:right; font-size:10px; color:#555; font-family:var(--font-mono); text-transform:none;">6 Active Constraint Guards</span></h4>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 50px;">
                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid #FFCC00;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Weather & Katabatics</h5>
                            <span style="color:#FFCC00; font-size:10px; font-weight:600; letter-spacing:1px;">ACTIVE CONSTRAINT</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">Sustained winds &gt;35 kts ground Ka-32 helicopters. Flight envelopes average 3.8 hours per day.</p>
                    </div>
                    
                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid #0088ff;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Vessel Cargo Capacity</h5>
                            <span style="color:#0088ff; font-size:10px; font-weight:600; letter-spacing:1px;">MONITORED</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">1,842 tonnes stowed. Deck capacity at 94% limit. Offload sequence must maintain ship stability.</p>
                    </div>
                    
                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid var(--alert-red);">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Hazard Class Restrictions</h5>
                            <span style="color:var(--alert-red); font-size:10px; font-weight:600; letter-spacing:1px;">STRICT PROTOCOL</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">50,000L polar diesel transfer requires floating hose over 1.8m fast ice with crack sensor acoustic monitoring.</p>
                    </div>

                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid #FFCC00;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Aircraft Payload Limit</h5>
                            <span style="color:#FFCC00; font-size:10px; font-weight:600; letter-spacing:1px;">PAYLOAD GUARDED</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">Ka-32 external sling limit is 3,500 kg per sortie at -20°C density altitude.</p>
                    </div>
                    
                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid var(--success-green);">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Personnel Availability</h5>
                            <span style="color:var(--success-green); font-size:10px; font-weight:600; letter-spacing:1px;">100% CERTIFIED</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">124 personnel active. All hold certified polar survival and cold-injury triage certs.</p>
                    </div>
                    
                    <div class="glass-panel" style="padding: 20px; border-top: 2px solid var(--alert-red); box-shadow: inset 0 0 20px rgba(255,51,51,0.1);">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                            <h5 style="color: #eee; font-weight: 500;">Station Fuel Reserve</h5>
                            <span style="color:var(--alert-red); font-size:10px; font-weight:600; letter-spacing:1px;">PRIORITY #1</span>
                        </div>
                        <p style="font-size:12px; color:#888; line-height:1.5;">Bharati current diesel: <strong style="color:var(--alert-red);">6.9 days left</strong>. Resupply pumping from ship is the top operational priority.</p>
                    </div>
                </div>

                <h4 class="section-title">CAMPAIGN PHASES & SCHEDULE EXECUTION</h4>
                
                <div style="display: flex; flex-direction: column; gap: 30px;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #1a1a1a; padding-bottom:10px; margin-bottom:15px;">
                            <div style="display:flex; align-items:center; gap: 15px;">
                                <span style="background: rgba(0,255,102,0.1); color: var(--success-green); border: 1px solid rgba(0,255,102,0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 1px;">COMPLETED</span>
                                <h4 style="color: #fff; font-size: 14px; font-weight: 500;">01 • Expedition Mobilization & Departure</h4>
                            </div>
                            <span style="color: #888; font-size: 12px; font-family: var(--font-mono);">15 Oct - 15 Nov 2026</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px; padding-left: 10px;">
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Scientific personnel medical clearance sign-off <span class="task-meta">(AIIMS Medical Board)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Cold-region survival training in Auli, Uttarakhand <span class="task-meta">(ITBP / NCPOR)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Goa Central Depot container packing & sealing <span class="task-meta">(NCPOR Logistics)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #1a1a1a; padding-bottom:10px; margin-bottom:15px;">
                            <div style="display:flex; align-items:center; gap: 15px;">
                                <span style="background: rgba(0,255,102,0.1); color: var(--success-green); border: 1px solid rgba(0,255,102,0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 1px;">COMPLETED</span>
                                <h4 style="color: #fff; font-size: 14px; font-weight: 500;">02 • Cargo Staging & Customs Cutoff</h4>
                            </div>
                            <span style="color: #888; font-size: 12px; font-family: var(--font-mono);">16 Nov - 04 Dec 2026</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px; padding-left: 10px;">
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Hazardous chemicals & lithium battery sea-freight booking <span class="task-meta">(DG Shipping India)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Cape Town bonded harbor intake & RFID tagging <span class="task-meta">(South African Port Agent)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> MV Vasiliy Golovnin heavy crane loading <span class="task-meta">(Vessel Master)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 100%;"></div></div><span class="progress-pct">100%</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #1a1a1a; padding-bottom:10px; margin-bottom:15px;">
                            <div style="display:flex; align-items:center; gap: 15px;">
                                <span style="background: rgba(255,204,0,0.1); color: #FFCC00; border: 1px solid rgba(255,204,0,0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 1px;">ACTIVE (DELAYED)</span>
                                <h4 style="color: #fff; font-size: 14px; font-weight: 500;">03 • Fast Ice Mooring & Helicopter Offload</h4>
                            </div>
                            <span style="color: #888; font-size: 12px; font-family: var(--font-mono);">05 Dec - 28 Dec 2026</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px; padding-left: 10px;">
                            <div class="task-row">
                                <div class="task-name"><span style="color:#FFCC00; margin-right:8px;">•</span> Ice-breaking approach to Bharati Station <span class="task-meta">(Current Distance: 14nm)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 85%; background: #FFCC00; box-shadow: 0 0 10px #FFCC00;"></div></div><span class="progress-pct" style="color: #FFCC00;">85%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Aerial reconnaissance of fast ice cracks <span class="task-meta">(Ka-32)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 30%; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan);"></div></div><span class="progress-pct" style="color: var(--accent-cyan);">30%</span></div>
                            </div>
                            <div class="task-row">
                                <div class="task-name"><span style="color:#555; margin-right:8px;">•</span> Establish fuel pumping hose over ice <span class="task-meta" style="color:var(--alert-red);">(Critical: Waiting for wind window)</span></div>
                                <div class="task-progress"><div class="progress-track"><div class="progress-fill" style="width: 0%;"></div></div><span class="progress-pct">0%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        \`,
`;

// Insert after overview
const overviewKey = "'#overview': `";
const intelligenceKey = "'#intelligence': `";
const indexOverview = appContent.indexOf(overviewKey);
const indexIntelligence = appContent.indexOf(intelligenceKey);

if (indexOverview !== -1 && indexIntelligence !== -1) {
    // Make sure we don't insert it multiple times if run twice
    if (!appContent.includes("'#planner': `")) {
        appContent = appContent.substring(0, indexIntelligence) + plannerHTML + appContent.substring(indexIntelligence);
        fs.writeFileSync('js/app.js', appContent);
        console.log("Successfully injected #planner view into app.js");
    } else {
        console.log("Planner view already exists, skipping inject.");
    }
} else {
    console.log("Could not find overview/intelligence anchors in app.js.");
}
