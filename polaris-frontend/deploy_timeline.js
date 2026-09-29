const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#timeline': `")) {
    console.log("Timeline already exists. Run a replacement logic instead.");
    process.exit(0);
}

const timelineHTML = `
        '#timeline': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0;">TACTICAL GANTT <span style="color: #00E5FF;">TIMELINE</span></h1>
                        <div style="color: #666; font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px;"><i class="fa-solid fa-clock"></i> LIVE EXPEDITION SCHEDULER & WEATHER SIMULATION</div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-outline" style="border-color: #333; color: #888;"><i class="fa-solid fa-filter"></i> ASSETS</button>
                        <button class="btn-outline" style="border-color: #FF003C; color: #FF003C; background: rgba(255,0,60,0.05);"><i class="fa-solid fa-cloud-bolt"></i> WEATHER OVERLAYS</button>
                        <button class="btn-outline" style="border-color: #00FF66; color: #00FF66;"><i class="fa-solid fa-plus"></i> NEW OPERATION</button>
                    </div>
                </div>

                <!-- MAIN GANTT CONTAINER -->
                <div style="flex: 1; display: grid; grid-template-columns: 280px 1fr; border: 1px solid #222; border-radius: 4px; overflow: hidden; background: #0a0a0a; position: relative;">
                    
                    <!-- LEFT PANEL: ASSET LABELS -->
                    <div style="background: #0f0f0f; border-right: 1px solid #333; display: flex; flex-direction: column; z-index: 10;">
                        <!-- Header -->
                        <div style="height: 40px; border-bottom: 1px solid #333; display: flex; align-items: center; padding: 0 15px; color: #888; font-family: var(--font-mono); font-size: 10px; background: #151515;">DEPLOYED ASSETS</div>
                        
                        <!-- Rows -->
                        <div style="height: 80px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 15px;">
                            <i class="fa-solid fa-ship" style="color: #00E5FF; font-size: 1.5rem; margin-right: 15px; width: 30px; text-align: center;"></i>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500;">MV Vasiliy Golovnin</div>
                                <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-top:3px;">ICE-CLASS VESSEL</div>
                            </div>
                        </div>
                        <div style="height: 80px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 15px;">
                            <i class="fa-solid fa-helicopter" style="color: #00FF66; font-size: 1.5rem; margin-right: 15px; width: 30px; text-align: center;"></i>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500;">Kamov Ka-32 (VT-XYZ)</div>
                                <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-top:3px;">HEAVY AIR-LIFT</div>
                            </div>
                        </div>
                        <div style="height: 80px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 15px;">
                            <i class="fa-solid fa-snowplow" style="color: #F39C12; font-size: 1.5rem; margin-right: 15px; width: 30px; text-align: center;"></i>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500;">Convoy Alpha (PistenBully)</div>
                                <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-top:3px;">ICE-SHELF TRAVERSE</div>
                            </div>
                        </div>
                        <div style="height: 80px; border-bottom: 1px solid #222; display: flex; align-items: center; padding: 0 15px;">
                            <i class="fa-solid fa-igloo" style="color: #fff; font-size: 1.5rem; margin-right: 15px; width: 30px; text-align: center;"></i>
                            <div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500;">Bharati Station Ops</div>
                                <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-top:3px;">BASE LOGISTICS</div>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT PANEL: TIMELINE GRID -->
                    <div style="position: relative; overflow-x: auto; overflow-y: hidden; background: #050505; display: flex; flex-direction: column;">
                        
                        <!-- Timeline Header (Months/Days) -->
                        <div style="height: 40px; border-bottom: 1px solid #333; display: flex; width: 150%; background: #151515;">
                            <!-- Nov -->
                            <div style="flex: 1; border-right: 1px solid #333; position: relative;">
                                <div style="position: absolute; top: 12px; left: 15px; color: #888; font-family: var(--font-mono); font-size: 10px; font-weight: bold;">NOV</div>
                            </div>
                            <!-- Dec -->
                            <div style="flex: 1; border-right: 1px solid #333; position: relative;">
                                <div style="position: absolute; top: 12px; left: 15px; color: #888; font-family: var(--font-mono); font-size: 10px; font-weight: bold;">DEC</div>
                            </div>
                            <!-- Jan -->
                            <div style="flex: 1; border-right: 1px solid #333; position: relative; background: rgba(0,229,255,0.02);">
                                <div style="position: absolute; top: 12px; left: 15px; color: #00E5FF; font-family: var(--font-mono); font-size: 10px; font-weight: bold;">JAN (CURRENT)</div>
                            </div>
                            <!-- Feb -->
                            <div style="flex: 1; border-right: 1px solid #333; position: relative;">
                                <div style="position: absolute; top: 12px; left: 15px; color: #888; font-family: var(--font-mono); font-size: 10px; font-weight: bold;">FEB</div>
                            </div>
                            <!-- Mar -->
                            <div style="flex: 1; position: relative;">
                                <div style="position: absolute; top: 12px; left: 15px; color: #888; font-family: var(--font-mono); font-size: 10px; font-weight: bold;">MAR</div>
                            </div>
                        </div>

                        <!-- Grid Lines Container -->
                        <div style="position: absolute; top: 40px; left: 0; width: 150%; height: calc(100% - 40px); display: flex; pointer-events: none; z-index: 1;">
                            <div style="flex: 1; border-right: 1px dashed #222;"></div>
                            <div style="flex: 1; border-right: 1px dashed #222;"></div>
                            <div style="flex: 1; border-right: 1px dashed #333; background: rgba(0,229,255,0.02);"></div>
                            <div style="flex: 1; border-right: 1px dashed #222;"></div>
                            <div style="flex: 1;"></div>
                        </div>

                        <!-- WEATHER OVERLAY (Storm Warning) -->
                        <div style="position: absolute; top: 40px; left: 45%; width: 10%; height: calc(100% - 40px); background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,0,60,0.1) 10px, rgba(255,0,60,0.1) 20px); border-left: 1px solid #FF003C; border-right: 1px solid #FF003C; z-index: 2; pointer-events: none; display: flex; justify-content: center; padding-top: 10px;">
                            <div style="background: #FF003C; color: #fff; font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: 2px; height: fit-content; text-transform: uppercase; font-weight: bold;">Katabatic Storm</div>
                        </div>

                        <!-- LIVE PLAYHEAD (TODAY) -->
                        <div style="position: absolute; top: 40px; left: 42%; width: 2px; height: calc(100% - 40px); background: #00E5FF; box-shadow: 0 0 10px #00E5FF; z-index: 5; pointer-events: none;">
                            <div style="position: absolute; top: -5px; left: -4px; width: 10px; height: 10px; background: #00E5FF; border-radius: 50%;"></div>
                        </div>

                        <!-- ROW CONTENT -->
                        <div style="position: relative; width: 150%; z-index: 3;">
                            
                            <!-- Ship Row -->
                            <div style="height: 80px; border-bottom: 1px solid #222; position: relative;">
                                <!-- Task 1: Complete -->
                                <div style="position: absolute; top: 25px; left: 5%; width: 15%; height: 30px; background: rgba(0, 255, 102, 0.15); border: 1px solid #00FF66; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,255,102,0.3)'" onmouseout="this.style.background='rgba(0,255,102,0.15)'">
                                    <span style="color: #00FF66; font-size: 11px; font-weight: 500;"><i class="fa-solid fa-check-circle"></i> Goa Loadout</span>
                                </div>
                                <!-- Task 2: Active -->
                                <div style="position: absolute; top: 25px; left: 22%; width: 18%; height: 30px; background: rgba(0, 229, 255, 0.15); border: 1px solid #00E5FF; box-shadow: 0 0 10px rgba(0,229,255,0.2); border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; cursor: pointer;">
                                    <div style="position: absolute; bottom: -1px; left: 0; height: 2px; background: #00E5FF; width: 85%;"></div>
                                    <span style="color: #00E5FF; font-size: 11px; font-weight: 500;"><i class="fa-solid fa-water"></i> Southern Ocean Transit</span>
                                </div>
                            </div>

                            <!-- Heli Row -->
                            <div style="height: 80px; border-bottom: 1px solid #222; position: relative;">
                                <!-- Task 3: Scheduled -->
                                <div style="position: absolute; top: 25px; left: 43%; width: 8%; height: 30px; background: rgba(255, 255, 255, 0.05); border: 1px dashed #888; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; cursor: pointer;">
                                    <span style="color: #aaa; font-size: 11px; font-weight: 500;">Sling Ops</span>
                                </div>
                                <!-- Task 4: Future -->
                                <div style="position: absolute; top: 25px; left: 60%; width: 12%; height: 30px; background: rgba(255, 255, 255, 0.05); border: 1px dashed #888; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; cursor: pointer;">
                                    <span style="color: #aaa; font-size: 11px; font-weight: 500;">Maitri Drop</span>
                                </div>
                            </div>

                            <!-- Traverse Row -->
                            <div style="height: 80px; border-bottom: 1px solid #222; position: relative;">
                                <!-- Task 5: Risk Zone -->
                                <div style="position: absolute; top: 25px; left: 40%; width: 18%; height: 30px; background: rgba(255, 0, 60, 0.15); border: 1px solid #FF003C; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; cursor: pointer; box-shadow: 0 0 10px rgba(255,0,60,0.3);">
                                    <i class="fa-solid fa-triangle-exclamation" style="color: #FF003C; margin-right: 8px;"></i>
                                    <span style="color: #FF003C; font-size: 11px; font-weight: 500;">Convoy Alpha (DELAYED)</span>
                                </div>
                            </div>

                            <!-- Base Ops Row -->
                            <div style="height: 80px; border-bottom: 1px solid #222; position: relative;">
                                <!-- Task 6 -->
                                <div style="position: absolute; top: 25px; left: 35%; width: 35%; height: 30px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0,229,255,0.3); border-radius: 4px; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box;">
                                    <span style="color: #00E5FF; font-size: 11px; font-weight: 500;">Bharati Winter Pre-checks & Diesel Storage</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; display: flex; gap: 20px; font-family: var(--font-mono); font-size: 11px; color: #888;">
                    <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 10px; height: 10px; background: rgba(0,255,102,0.3); border: 1px solid #00FF66;"></div> COMPLETED</div>
                    <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 10px; height: 10px; background: rgba(0,229,255,0.3); border: 1px solid #00E5FF;"></div> ACTIVE</div>
                    <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 10px; height: 10px; background: rgba(255,255,255,0.1); border: 1px dashed #888;"></div> SCHEDULED</div>
                    <div style="display: flex; align-items: center; gap: 5px;"><div style="width: 10px; height: 10px; background: rgba(255,0,60,0.3); border: 1px solid #FF003C;"></div> AT RISK / STORM WINDOW</div>
                </div>
            </div>
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + timelineHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Timeline injected successfully!");
} else {
    console.log("Could not find anchor to inject timeline.");
}
