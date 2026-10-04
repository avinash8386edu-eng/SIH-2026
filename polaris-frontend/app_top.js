import db, { initDB } from './db.js';
import { GlobalUI } from './global-ui.js';

// Single Page Application (SPA) Router logic
document.addEventListener('DOMContentLoaded', async () => {
    
    // Initialize Core Foundation
    GlobalUI.init();
    await initDB(); // Will seed if empty

    // Fetch dynamic numbers from Dexie for the single source of truth
    const personnelCount = await db.personnel.count();
    const cargoCount = await db.cargo.count();
    const inventoryItems = await db.inventory.toArray();
    let fuelLevel = 0;
    inventoryItems.forEach(i => { if(i.category === "Fuel") fuelLevel += i.quantity; });
    const missionsCount = await db.missions.count();

    // Highlight sidebar links based on active hash
    const navItems = document.querySelectorAll('.nav-item');
    
    function updateSidebar(hash) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });
    }

    // Views
    const views = {
                '#overview': `
            <div class="him-setu-hud" style="height: 100%; display: flex; flex-direction: column; overflow-y: auto; padding: 30px; box-sizing: border-box; background: radial-gradient(circle at top right, rgba(0,229,255,0.05) 0%, #000 50%);">
                <!-- HUD Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px -15px rgba(0,229,255,0.1);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <div style="width: 12px; height: 12px; background: #00FF66; border-radius: 50%; box-shadow: 0 0 10px #00FF66; animation: hud-pulse 2s infinite;"></div>
                            <span style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">LINK ACTIVE // SECURE CHANNEL</span>
                        </div>
                        <h1 style="color: #fff; font-size: 2.5rem; letter-spacing: 4px; font-weight: 300; margin: 0; text-transform: uppercase; font-family: 'Inter', sans-serif;">HIM-SETU <span style="font-weight: 600; color: #00E5FF;">COMMAND</span></h1>
                        <p style="color: #888; font-family: 'Roboto Mono', monospace; font-size: 12px; margin-top: 8px;">INTEGRATED POLAR EXPEDITION LOGISTICS & ASSET MANAGEMENT</p>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <button class="btn-military" style="border-color: #00E5FF; color: #00E5FF;"><i class="fa-solid fa-satellite" style="margin-right: 8px;"></i> LIVE SAT-LINK</button>
                        <button class="btn-military" style="background: rgba(0, 229, 255, 0.1); border-color: #00E5FF; color: #fff;"><i class="fa-solid fa-qrcode" style="margin-right: 8px;"></i> INITIATE SCAN</button>
                    </div>
                </div>

                <!-- HUD Grid -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
                    <!-- Stat Card 1 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #333; border-left: 3px solid #00E5FF; padding: 20px; border-radius: 4px; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                        <div style="color: #666; font-family: 'Roboto Mono', monospace; font-size: 10px; letter-spacing: 1.5px; margin-bottom: 15px;">TOTAL DEPLOYED PERSONNEL</div>
                        <div style="display: flex; align-items: baseline; gap: 15px;">
                            <div style="font-size: 3rem; color: #fff; font-weight: 300; font-family: 'Inter', sans-serif;">${personnelCount}</div>
                            <div style="color: #00FF66; font-size: 14px; font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-arrow-trend-up"></i> STABLE</div>
                        </div>
                        <i class="fa-solid fa-users" style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; color: rgba(0,229,255,0.05);"></i>
                    </div>

                    <!-- Stat Card 2 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #333; border-left: 3px solid #00FF66; padding: 20px; border-radius: 4px; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                        <div style="color: #666; font-family: 'Roboto Mono', monospace; font-size: 10px; letter-spacing: 1.5px; margin-bottom: 15px;">CARGO MANIFESTS</div>
                        <div style="display: flex; align-items: baseline; gap: 15px;">
                            <div style="font-size: 3rem; color: #fff; font-weight: 300; font-family: 'Inter', sans-serif;">${cargoCount}</div>
                            <div style="color: #00E5FF; font-size: 14px; font-family: 'Roboto Mono', monospace;">INTACT</div>
                        </div>
                        <i class="fa-solid fa-boxes-stacked" style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; color: rgba(0,255,102,0.05);"></i>
                    </div>

                    <!-- Stat Card 3 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #333; border-left: 3px solid #FF003C; padding: 20px; border-radius: 4px; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                        <div style="color: #666; font-family: 'Roboto Mono', monospace; font-size: 10px; letter-spacing: 1.5px; margin-bottom: 15px;">RESERVE FUEL (kL)</div>
                        <div style="display: flex; align-items: baseline; gap: 15px;">
                            <div style="font-size: 3rem; color: #fff; font-weight: 300; font-family: 'Inter', sans-serif;">${fuelLevel}</div>
                            <div style="color: #FF003C; font-size: 14px; font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-arrow-trend-down"></i> BURN RATE</div>
                        </div>
                        <i class="fa-solid fa-gas-pump" style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; color: rgba(255,0,60,0.05);"></i>
                    </div>

                    <!-- Stat Card 4 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #333; border-left: 3px solid #F39C12; padding: 20px; border-radius: 4px; position: relative; overflow: hidden; backdrop-filter: blur(5px);">
                        <div style="color: #666; font-family: 'Roboto Mono', monospace; font-size: 10px; letter-spacing: 1.5px; margin-bottom: 15px;">ACTIVE MISSIONS</div>
                        <div style="display: flex; align-items: baseline; gap: 15px;">
                            <div style="font-size: 3rem; color: #fff; font-weight: 300; font-family: 'Inter', sans-serif;">${missionsCount}</div>
                            <div style="color: #F39C12; font-size: 14px; font-family: 'Roboto Mono', monospace;">IN PROGRESS</div>
                        </div>
                        <i class="fa-solid fa-truck-fast" style="position: absolute; right: -10px; bottom: -10px; font-size: 5rem; color: rgba(243,156,18,0.05);"></i>
                    </div>
                </div>

                <!-- HUD Main Section -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; flex: 1;">
                    <!-- Map / Timeline Hybrid -->
                    <div style="background: rgba(5,5,5,0.9); border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column;">
                        <h3 style="color: #00E5FF; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; margin: 0 0 20px 0; letter-spacing: 1px;"><i class="fa-solid fa-route" style="margin-right:8px;"></i> LOGISTICS CORRIDOR STATUS</h3>
                        <div style="flex: 1; border: 1px dashed #333; border-radius: 4px; display: flex; justify-content: center; align-items: center; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_relief_location_map.jpg') center/cover no-repeat; position: relative; overflow: hidden;">
                            <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8);"></div>
                            <div style="position: relative; z-index: 2; text-align: center;">
                                <div style="width: 150px; height: 150px; border: 2px solid rgba(0,229,255,0.3); border-radius: 50%; display: flex; justify-content: center; align-items: center; position: relative;">
                                    <div style="width: 100px; height: 100px; border: 1px dashed #00E5FF; border-radius: 50%; animation: spin 10s linear infinite;"></div>
                                    <div style="position: absolute; color: #00E5FF; font-size: 2rem;"><i class="fa-solid fa-crosshairs"></i></div>
                                </div>
                                <div style="margin-top: 15px; color: #fff; font-family: 'Roboto Mono', monospace; font-size: 12px;">TRACKING: MV VASILIY GOLOVNIN</div>
                                <div style="color: #00FF66; font-family: 'Roboto Mono', monospace; font-size: 10px; margin-top: 5px;">ETA BHARATI: 14 DAYS</div>
                            </div>
                        </div>
                    </div>

                    <!-- Alerts / Activity -->
                    <div style="background: rgba(5,5,5,0.9); border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column;">
                        <h3 style="color: #FF003C; font-family: 'Roboto Mono', monospace; font-size: 12px; text-transform: uppercase; margin: 0 0 20px 0; letter-spacing: 1px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:8px;"></i> CRITICAL ALERTS</h3>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="background: rgba(255,0,60,0.05); border-left: 2px solid #FF003C; padding: 15px;">
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 5px;">Katabatic Storm Warning</div>
                                <div style="color: #aaa; font-size: 11px; font-family: 'Roboto Mono', monospace;">Maitri Station - Expect 60kt winds. Halt all traverse operations.</div>
                            </div>
                            <div style="background: rgba(243,156,18,0.05); border-left: 2px solid #F39C12; padding: 15px;">
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 5px;">Helicopter Grounded</div>
                                <div style="color: #aaa; font-size: 11px; font-family: 'Roboto Mono', monospace;">Ka-32 VT-XYZ requires engine maintenance.</div>
                            </div>
                            <div style="background: rgba(0,255,102,0.05); border-left: 2px solid #00FF66; padding: 15px;">
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 5px;">Cargo Offload Complete</div>
                                <div style="color: #aaa; font-size: 11px; font-family: 'Roboto Mono', monospace;">CRG-2026-004 secured at Bharati Ice-shelf.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`,
                                                '#planner': `
            <div class="him-setu-dashboard planner-dual-panel" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', 'Segoe UI', sans-serif;">
                
                <!-- ================= TOP PANEL: CONFIGURATOR ================= -->
                <div class="dash-header" style="flex-shrink: 0; margin-bottom: 20px;">
                    <h1 style="color: #fff; font-size: 1.8rem; letter-spacing: 2px; font-weight: 500; text-transform: uppercase; margin: 0 0 5px 0;">HIM-SETU PAYLOAD & SURVIVAL CONFIGURATOR</h1>
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
`,
        '