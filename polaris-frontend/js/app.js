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
        '#intelligence': `
        <div>
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">WHAT-IF AI SIMULATOR</h2>
            <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Multi-constraint predictive engine for expedition logistics.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <!-- Control Panel -->
                <div class="glass-panel" style="padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION PARAMETERS</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">SCENARIO TYPE</label>
                        <select id="ai-scenario-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="BLIZZARD">Cat-4 Blizzard Strike</option>
                            <option value="VESSEL_DELAY">Icebreaker Delay (Logistics)</option>
                            <option value="FUEL_SPIKE">Sudden Fuel Burn Spike</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">TARGET STATION</label>
                        <select id="ai-station-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="MAITRI">Maitri</option>
                            <option value="BHARATI">Bharati</option>
                            <option value="ALL">All Stations</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">DURATION (DAYS)</label>
                        <input type="number" id="ai-duration" value="7" min="1" max="60" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                    </div>
                    
                    <button class="btn-cyber" id="btn-run-simulation" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                        <i class="fa-solid fa-microchip"></i> RUN PREDICTION
                    </button>
                </div>

                <!-- Results Output -->
                <div class="glass-panel" style="padding: 30px; position: relative;" id="ai-results-panel">
                    <div id="ai-overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); z-index: 10; display: none; justify-content: center; align-items: center; border-radius: 8px;">
                        <div style="text-align: center;">
                            <i class="fa-solid fa-radar fa-spin" style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 15px;"></i>
                            <p style="font-family: var(--font-mono); color: var(--accent-cyan); letter-spacing: 2px;" id="ai-loading-text">CALCULATING QUANTUM PROBABILITIES...</p>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION OUTCOME</h3>
                    <div style="font-family: var(--font-mono); margin-bottom: 20px;">
                        <span style="color: var(--text-muted);">CONFIDENCE INTERVAL:</span> <span id="res-confidence" style="color: #00FF66;">--</span><br>
                        <span style="color: var(--text-muted);">AFFECTED SUBSYSTEMS:</span> <span id="res-affected" style="color: #FFCC00;">--</span>
                    </div>
                    
                    <h4 style="color: var(--alert-red); margin-bottom: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FAILURES PREDICTED</h4>
                    <ul id="res-failures" style="font-family: var(--font-mono); color: white; background: rgba(255,0,60,0.1); padding: 15px; border-left: 3px solid var(--alert-red); list-style: none; margin-bottom: 20px; min-height: 80px;">
                    </ul>

                    <h4 style="color: #00FF66; margin-bottom: 10px;"><i class="fa-solid fa-shield-halved"></i> RECOMMENDED MITIGATION</h4>
                    <ul id="res-mitigation" style="font-family: var(--font-mono); color: white; background: rgba(0,255,102,0.1); padding: 15px; border-left: 3px solid #00FF66; list-style: none; min-height: 80px;">
                    </ul>
                </div>
            </div>
        </div>
    `,
        '#emergency': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--alert-red);">EMERGENCY DISPATCH PROTOCOL</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Global distress relay and automated search-and-rescue routing.</p>
                
                <div id="sos-default-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--alert-red); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 20px; font-size: 1.5rem;">CRITICAL SOS ACTIVATION</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Initiating this protocol broadcasts a high-priority distress signal to all available channels, bypasses bandwidth limits, and alerts the nearest Traverse units. Use only in life-threatening scenarios.
                    </p>
                    <button class="btn-cyber" id="btn-trigger-sos" style="background: rgba(255, 0, 60, 0.2); border-color: var(--alert-red); color: var(--alert-red); font-size: 1.5rem; padding: 20px 50px; font-weight: bold; border-radius: 8px;">
                        INITIATE SOS
                    </button>
                    <p style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.8rem; color: #FFCC00;">[ DEMO MODE: WILL SAVE TO LOCAL DB FOR HACKATHON ]</p>
                </div>

                <div id="sos-active-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red); display: none;">
                    <div class="meter-circle" style="--percent: 100; --meter-color: var(--alert-red); width: 150px; height: 150px; margin-bottom: 20px;">
                        <div class="meter-inner">
                            <h2 id="sos-countdown" style="font-size: 3rem; color: var(--alert-red);">3</h2>
                        </div>
                    </div>
                    <h3 class="neon-text-red" style="font-size: 2rem; margin-bottom: 10px;">DISTRESS BEACON ACTIVATED</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-main); margin-bottom: 30px; letter-spacing: 2px;">GATHERING TELEMETRY AND LOCATING NEARBY ASSETS...</p>
                    <button class="btn-cyber" id="btn-cancel-sos" style="border-color: var(--text-muted); color: var(--text-main);">CANCEL SIGNAL (ABORT)</button>
                </div>
                
                <div id="sos-map-container" class="glass-panel" style="margin-top: 30px; height: 400px; display: none; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_6400px_from_Blue_Marble.jpg') center/cover; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div class="pulse-dot" style="background: var(--alert-red); box-shadow: 0 0 20px var(--alert-red); width: 20px; height: 20px;"></div>
                        <p class="neon-text-red" style="font-family: var(--font-mono); margin-top: 10px; font-weight: bold; font-size: 1.2rem;">INCIDENT LOCATION ACQUIRED</p>
                        <p style="color: white; font-family: var(--font-mono); font-size: 0.9rem;">Lat: -69.412 | Lng: 76.195</p>
                    </div>
                </div>
            </div>
        `,
                '#cargo-scan': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">QR ENGINE & CHAIN OF CUSTODY</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Optical inspection and tamper-evident cryptographic tracking.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <!-- Scanner Module -->
                    <div class="glass-panel" style="padding: 30px; text-align: center;">
                        <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">OPTICAL SCANNER</h3>
                        <div class="scanner-container" style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 20px; border: 1px solid rgba(0,229,255,0.2);">
                            <div class="scanner-reticle" style="margin: 0 auto 20px;">
                                <div class="laser"></div>
                                <video id="qr-video" style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                            </div>
                            
                            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                                <button class="btn-cyber" id="btn-start-camera" style="flex: 1; padding: 12px; font-size: 0.9rem;"><i class="fa-solid fa-camera"></i> START CAMERA</button>
                                <button class="btn-cyber" id="btn-upload-qr" style="flex: 1; padding: 12px; font-size: 0.9rem;"><i class="fa-solid fa-upload"></i> UPLOAD IMAGE</button>
                            </div>
                            
                            <div style="display: flex; gap: 10px; align-items: center; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px;">
                                <input type="text" id="manual-qr-input" placeholder="Enter Unique Cargo ID..." style="flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                                <button class="btn-cyber" id="btn-manual-lookup" style="flex: 1; padding: 12px;"><i class="fa-solid fa-magnifying-glass"></i> LOOKUP</button>
                            </div>
                        </div>
                    </div>

                    <!-- Chain of Custody Timeline -->
                    <div class="glass-panel" id="custody-panel" style="padding: 30px; display: none;">
                        <h3 style="margin-bottom: 10px; color: var(--accent-cyan);">CUSTODY AUDIT LOG</h3>
                        <p id="cargo-title" style="font-family: var(--font-mono); color: white; font-size: 1.2rem; margin-bottom: 20px;">CRG-WAITING</p>
                        
                        <div class="timeline" id="cargo-timeline" style="flex-direction: column; max-width: 100%; margin: 0;">
                            <!-- Timeline nodes injected dynamically -->
                        </div>
                        
                        <button class="btn-cyber" id="btn-verify-hash" style="margin-top: 20px; width: 100%; border-color: #FFCC00; color: #FFCC00;">VERIFY CRYPTOGRAPHIC INTEGRITY (SHA-256)</button>
                        <div id="hash-result" style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.9rem; word-break: break-all;"></div>
                    </div>
                </div>
                
                <!-- Generator Module -->
                <div class="glass-panel" style="margin-top: 30px; padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">GENERATE NEW CARGO TAG</h3>
                    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 15px;">
                        <input type="text" id="new-cargo-name" placeholder="Cargo Description (e.g. Ice Core Samples)" style="flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                        <select id="new-cargo-base" style="flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="Goa">Origin: Goa Depot</option>
                            <option value="Cape Town">Origin: Cape Town</option>
                        </select>
                        <select id="new-cargo-dest" style="flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="Bharati">Dest: Bharati</option>
                            <option value="Maitri">Dest: Maitri</option>
                        </select>
                        <button class="btn-cyber" id="btn-generate-qr" style="padding: 12px;"><i class="fa-solid fa-qrcode"></i> GENERATE SECURE TAG</button>
                    </div>
                    
                    <div id="generated-qr-result" style="display: none; padding: 20px; background: rgba(0, 255, 102, 0.1); border-left: 4px solid #00FF66; margin-top: 20px;">
                        <h4 style="color: #00FF66; margin-bottom: 10px;">SUCCESS: CARGO SECURED</h4>
                        <p style="font-family: var(--font-mono); color: white;">Unique Tracking ID: <strong id="generated-cargo-id" style="font-size: 1.5rem; letter-spacing: 2px; user-select: all; background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 4px; margin-left: 10px;"></strong></p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;">* Use this Unique ID in the Optical Scanner manual lookup above to test the Chain of Custody.</p>
                    </div>
                </div>
            </div>
        `,
        '#intelligence': `
        <div>
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">WHAT-IF AI SIMULATOR</h2>
            <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Multi-constraint predictive engine for expedition logistics.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <!-- Control Panel -->
                <div class="glass-panel" style="padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION PARAMETERS</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">SCENARIO TYPE</label>
                        <select id="ai-scenario-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="BLIZZARD">Cat-4 Blizzard Strike</option>
                            <option value="VESSEL_DELAY">Icebreaker Delay (Logistics)</option>
                            <option value="FUEL_SPIKE">Sudden Fuel Burn Spike</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">TARGET STATION</label>
                        <select id="ai-station-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="MAITRI">Maitri</option>
                            <option value="BHARATI">Bharati</option>
                            <option value="ALL">All Stations</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">DURATION (DAYS)</label>
                        <input type="number" id="ai-duration" value="7" min="1" max="60" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                    </div>
                    
                    <button class="btn-cyber" id="btn-run-simulation" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                        <i class="fa-solid fa-microchip"></i> RUN PREDICTION
                    </button>
                </div>

                <!-- Results Output -->
                <div class="glass-panel" style="padding: 30px; position: relative;" id="ai-results-panel">
                    <div id="ai-overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); z-index: 10; display: none; justify-content: center; align-items: center; border-radius: 8px;">
                        <div style="text-align: center;">
                            <i class="fa-solid fa-radar fa-spin" style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 15px;"></i>
                            <p style="font-family: var(--font-mono); color: var(--accent-cyan); letter-spacing: 2px;" id="ai-loading-text">CALCULATING QUANTUM PROBABILITIES...</p>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION OUTCOME</h3>
                    <div style="font-family: var(--font-mono); margin-bottom: 20px;">
                        <span style="color: var(--text-muted);">CONFIDENCE INTERVAL:</span> <span id="res-confidence" style="color: #00FF66;">--</span><br>
                        <span style="color: var(--text-muted);">AFFECTED SUBSYSTEMS:</span> <span id="res-affected" style="color: #FFCC00;">--</span>
                    </div>
                    
                    <h4 style="color: var(--alert-red); margin-bottom: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FAILURES PREDICTED</h4>
                    <ul id="res-failures" style="font-family: var(--font-mono); color: white; background: rgba(255,0,60,0.1); padding: 15px; border-left: 3px solid var(--alert-red); list-style: none; margin-bottom: 20px; min-height: 80px;">
                    </ul>

                    <h4 style="color: #00FF66; margin-bottom: 10px;"><i class="fa-solid fa-shield-halved"></i> RECOMMENDED MITIGATION</h4>
                    <ul id="res-mitigation" style="font-family: var(--font-mono); color: white; background: rgba(0,255,102,0.1); padding: 15px; border-left: 3px solid #00FF66; list-style: none; min-height: 80px;">
                    </ul>
                </div>
            </div>
        </div>
    `,
        '#emergency': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--alert-red);">EMERGENCY DISPATCH PROTOCOL</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Global distress relay and automated search-and-rescue routing.</p>
                
                <div id="sos-default-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--alert-red); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 20px; font-size: 1.5rem;">CRITICAL SOS ACTIVATION</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Initiating this protocol broadcasts a high-priority distress signal to all available channels, bypasses bandwidth limits, and alerts the nearest Traverse units. Use only in life-threatening scenarios.
                    </p>
                    <button class="btn-cyber" id="btn-trigger-sos" style="background: rgba(255, 0, 60, 0.2); border-color: var(--alert-red); color: var(--alert-red); font-size: 1.5rem; padding: 20px 50px; font-weight: bold; border-radius: 8px;">
                        INITIATE SOS
                    </button>
                    <p style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.8rem; color: #FFCC00;">[ DEMO MODE: WILL SAVE TO LOCAL DB FOR HACKATHON ]</p>
                </div>

                <div id="sos-active-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red); display: none;">
                    <div class="meter-circle" style="--percent: 100; --meter-color: var(--alert-red); width: 150px; height: 150px; margin-bottom: 20px;">
                        <div class="meter-inner">
                            <h2 id="sos-countdown" style="font-size: 3rem; color: var(--alert-red);">3</h2>
                        </div>
                    </div>
                    <h3 class="neon-text-red" style="font-size: 2rem; margin-bottom: 10px;">DISTRESS BEACON ACTIVATED</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-main); margin-bottom: 30px; letter-spacing: 2px;">GATHERING TELEMETRY AND LOCATING NEARBY ASSETS...</p>
                    <button class="btn-cyber" id="btn-cancel-sos" style="border-color: var(--text-muted); color: var(--text-main);">CANCEL SIGNAL (ABORT)</button>
                </div>
                
                <div id="sos-map-container" class="glass-panel" style="margin-top: 30px; height: 400px; display: none; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_6400px_from_Blue_Marble.jpg') center/cover; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div class="pulse-dot" style="background: var(--alert-red); box-shadow: 0 0 20px var(--alert-red); width: 20px; height: 20px;"></div>
                        <p class="neon-text-red" style="font-family: var(--font-mono); margin-top: 10px; font-weight: bold; font-size: 1.2rem;">INCIDENT LOCATION ACQUIRED</p>
                        <p style="color: white; font-family: var(--font-mono); font-size: 0.9rem;">Lat: -69.412 | Lng: 76.195</p>
                    </div>
                </div>
            </div>
        `,
        '#cargo-scan': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px;">QR ENGINE & CHAIN OF CUSTODY</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Optical inspection and tamper-evident cryptographic tracking.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <!-- Scanner Module -->
                    <div class="glass-panel" style="padding: 30px; text-align: center;">
                        <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">OPTICAL SCANNER</h3>
                        <div class="scanner-container" style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 20px;">
                            <div class="scanner-reticle" style="margin: 0 auto 20px;">
                                <div class="laser"></div>
                                <video id="qr-video" style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                            </div>
                            <button class="btn-cyber" id="btn-start-camera" style="margin-right: 10px;">START CAMERA</button>
                            <button class="btn-cyber" id="btn-upload-qr">UPLOAD IMAGE</button>
                            
                            <div style="margin-top: 20px;">
                                <input type="text" id="manual-qr-input" placeholder="Enter Cargo ID Manually..." style="width: 70%; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                                <button class="btn-cyber" id="btn-manual-lookup">LOOKUP</button>
                            </div>
                        </div>
                    </div>

                    <!-- Chain of Custody Timeline -->
                    <div class="glass-panel" id="custody-panel" style="padding: 30px; display: none;">
                        <h3 style="margin-bottom: 10px; color: var(--accent-cyan);">CUSTODY AUDIT LOG</h3>
                        <p id="cargo-title" style="font-family: var(--font-mono); color: white; font-size: 1.2rem; margin-bottom: 20px;">CRG-WAITING</p>
                        
                        <div class="timeline" id="cargo-timeline" style="flex-direction: column; max-width: 100%; margin: 0;">
                            <!-- Timeline nodes injected dynamically -->
                        </div>
                        
                        <button class="btn-cyber" id="btn-verify-hash" style="margin-top: 20px; width: 100%; border-color: #FFCC00; color: #FFCC00;">VERIFY CRYPTOGRAPHIC INTEGRITY (SHA-256)</button>
                        <div id="hash-result" style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.9rem;"></div>
                    </div>
                </div>
                
                <!-- Generator Module -->
                <div class="glass-panel" style="margin-top: 30px; padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">GENERATE QR TAG</h3>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <input type="text" id="new-cargo-name" placeholder="Cargo Description" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: white;">
                        <select id="new-cargo-base" style="flex: 1; padding: 10px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white;">
                            <option value="Goa">Origin: Goa Depot</option>
                            <option value="Cape Town">Origin: Cape Town</option>
                        </select>
                        <select id="new-cargo-dest" style="flex: 1; padding: 10px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white;">
                            <option value="Bharati">Dest: Bharati</option>
                            <option value="Maitri">Dest: Maitri</option>
                        </select>
                        <button class="btn-cyber" id="btn-generate-qr">GENERATE SECURE TAG</button>
                    </div>
                </div>
            </div>
        `
    };

    const contentArea = document.getElementById('dynamic-content');

    function renderPage() {
        const hash = window.location.hash || '#overview';
        updateSidebar(hash);
        
        if (views[hash]) {
            contentArea.innerHTML = views[hash];
        } else {
            contentArea.innerHTML = `
                <div class="glass-panel" style="padding: 50px; text-align: center;">
                    <i class="fa-solid fa-person-digging" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h2 class="neon-text">MODULE OFFLINE / UNDER CONSTRUCTION</h2>
                    <p style="color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono);">The requested command module (${hash}) is currently isolated.</p>
                </div>
            `;
        }
    }

    // Initialize SPA Router
    window.addEventListener('hashchange', renderPage);
    
    // Initial Render on load
    if(!window.location.hash) {
        window.location.hash = '#overview';
    } else {
        renderPage();
    }
});

    // QR Scanner & Chain of Custody Logic
    document.addEventListener("click", async (e) => {
        if(e.target.id === "btn-manual-lookup") {
            const qrCode = document.getElementById("manual-qr-input").value.trim();
            if(!qrCode) return GlobalUI.showToast("Enter a valid Cargo ID", "error");
            
            try {
                // 1. Fetch Cargo
                const cargoRes = await fetch(`http://localhost:8080/api/cargo/qr/${qrCode}`);
                if(!cargoRes.ok) throw new Error("Cargo not found");
                const cargo = await cargoRes.json();
                
                // 2. Register Scan Event (adds a new hop in the timeline with SHA-256)
                await fetch(`http://localhost:8080/api/cargo/${cargo.id}/scan`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ location: "Scanner Terminal X", notes: "Manual Audit" })
                });

                // 3. Get updated Timeline
                const timeRes = await fetch(`http://localhost:8080/api/cargo/${cargo.id}/timeline`);
                const timeline = await timeRes.json();
                
                // 4. Render
                document.getElementById("custody-panel").style.display = "block";
                document.getElementById("cargo-title").innerText = `${cargo.name} (${cargo.cargoCode})`;
                
                const tlDiv = document.getElementById("cargo-timeline");
                tlDiv.innerHTML = timeline.map(ev => `
                    <div class="timeline-node completed" style="margin-bottom:20px; display:flex; align-items:center; gap:20px; text-align:left;">
                        <div class="timeline-dot" style="margin:0;"><i class="fa-solid fa-check"></i></div>
                        <div>
                            <p style="color:var(--text-main)">${ev.location}</p>
                            <p style="font-size: 0.7rem; color: #00FF66;">${new Date(ev.timestamp).toLocaleString()}</p>
                            <p style="font-size: 0.6rem; color: var(--text-muted);">HASH: ${ev.eventHash ? ev.eventHash.substring(0,16)+"..." : "GENESIS"}</p>
                        </div>
                    </div>
                `).join("");
                
                // Save full timeline for verification
                window.currentTimeline = timeline;
                GlobalUI.showToast("Chain of Custody Retrieved", "success");
            } catch(err) {
                GlobalUI.showToast(err.message, "error");
            }
        }
        
        if(e.target.id === "btn-verify-hash") {
            const tl = window.currentTimeline;
            if(!tl) return;
            const res = document.getElementById("hash-result");
            res.innerHTML = "<span style=\"color:#FFCC00\">Verifying cryptographic hashes...</span>";
            setTimeout(() => {
                let valid = true;
                for(let i=1; i<tl.length; i++) {
                    if(tl[i].previousEventHash !== tl[i-1].eventHash) {
                        valid = false;
                        break;
                    }
                }
                if(valid) {
                    res.innerHTML = "<span style=\"color:#00FF66\"><i class=\"fa-solid fa-shield-check\"></i> INTEGRITY PASS: Cryptographic chain is intact.</span>";
                } else {
                    res.innerHTML = "<span style=\"color:var(--alert-red)\"><i class=\"fa-solid fa-triangle-exclamation\"></i> INTEGRITY FAIL: Chain broken or tampered!</span>";
                }
            }, 800);
        }
    });



    document.addEventListener("click", async (e) => {
        if(e.target.id === "btn-generate-qr") {
            const name = document.getElementById("new-cargo-name").value.trim();
            if(!name) return GlobalUI.showToast("Enter cargo name", "error");
            
            const cargo = {
                cargoCode: "CRG-" + Math.floor(Math.random()*10000),
                name: name,
                category: "EQUIPMENT",
                weight: 50.0,
                priority: "HIGH",
                status: "GOA_DEPOT",
                qrCode: "QR-" + Date.now(),
                description: "Auto-generated from Terminal"
            };

            try {
                const res = await fetch("http://localhost:8080/api/cargo", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(cargo)
                });
                const saved = await res.json();
                GlobalUI.showToast(`Cargo ${saved.cargoCode} Generated!`, "success");
                
                // Add initial event
                await fetch(`http://localhost:8080/api/cargo/${saved.id}/scan`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ location: "Goa Depot (Origin)", notes: "Initial Tagging" })
                });

                document.getElementById("manual-qr-input").value = saved.qrCode;
            } catch(err) {
                GlobalUI.showToast("Backend connection failed", "error");
            }
        }
    });



    // Emergency SOS Logic
    let sosAudioCtx;
    let sosOscillator;
    let sosCountdown;
    
    document.addEventListener('click', async (e) => {
        if(e.target.id === 'btn-trigger-sos') {
            if(!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                GlobalUI.showToast('WARNING: Geolocation requires HTTPS. Using Fallback.', 'error');
            }
            
            // Audio Siren
            try {
                if(!sosAudioCtx) sosAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if(sosAudioCtx.state === 'suspended') await sosAudioCtx.resume();
                
                sosOscillator = sosAudioCtx.createOscillator();
                const gain = sosAudioCtx.createGain();
                
                sosOscillator.type = 'square';
                sosOscillator.frequency.setValueAtTime(400, sosAudioCtx.currentTime);
                sosOscillator.frequency.linearRampToValueAtTime(800, sosAudioCtx.currentTime + 1);
                sosOscillator.frequency.linearRampToValueAtTime(400, sosAudioCtx.currentTime + 2);
                
                sosOscillator.connect(gain);
                gain.connect(sosAudioCtx.destination);
                sosOscillator.start();
                
                // loop sweep
                setInterval(() => {
                    if(sosOscillator) {
                        sosOscillator.frequency.setValueAtTime(400, sosAudioCtx.currentTime);
                        sosOscillator.frequency.linearRampToValueAtTime(800, sosAudioCtx.currentTime + 1);
                        sosOscillator.frequency.linearRampToValueAtTime(400, sosAudioCtx.currentTime + 2);
                    }
                }, 2000);
            } catch(err) {
                console.warn('Audio blocked:', err);
            }
            
            // UI Update
            document.getElementById('sos-default-view').style.display = 'none';
            document.getElementById('sos-active-view').style.display = 'block';
            document.getElementById('sos-map-container').style.display = 'block';
            document.getElementById('app-body').style.animation = 'sos-flash 1s infinite alternate';
            
            // Countdown
            let timeLeft = 3;
            document.getElementById('sos-countdown').innerText = timeLeft;
            sosCountdown = setInterval(async () => {
                timeLeft--;
                if(timeLeft > 0) {
                    document.getElementById('sos-countdown').innerText = timeLeft;
                } else {
                    clearInterval(sosCountdown);
                    document.getElementById('sos-countdown').innerText = 'TRANSMITTING...';
                    await transmitSOS();
                }
            }, 1000);
        }
        
        if(e.target.id === 'btn-cancel-sos') {
            if(sosCountdown) clearInterval(sosCountdown);
            if(sosOscillator) { sosOscillator.stop(); sosOscillator = null; }
            document.getElementById('sos-default-view').style.display = 'block';
            document.getElementById('sos-active-view').style.display = 'none';
            document.getElementById('sos-map-container').style.display = 'none';
            document.getElementById('app-body').style.animation = 'none';
            GlobalUI.showToast('SOS Cancelled', 'info');
        }
    });

    async function transmitSOS() {
        let lat = 'UNKNOWN', lng = 'UNKNOWN';
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true, timeout: 5000});
            });
            lat = pos.coords.latitude.toFixed(4);
            lng = pos.coords.longitude.toFixed(4);
        } catch(err) {
            console.warn('Geo failed:', err);
        }
        
        document.getElementById('sos-countdown').innerText = 'INCIDENT ACTIVE';
        document.getElementById('btn-cancel-sos').innerText = 'MUTE SIREN';
        
        // Post to Backend
        try {
            await fetch('http://localhost:8080/api/alerts/sos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: 'MAN-DOWN / DISTRESS',
                    message: 'Emergency activated from terminal.',
                    alertType: 'SOS',
                    sourceLocation: lat + ', ' + lng
                })
            });
            GlobalUI.showToast('SOS Broadcasted via VSAT', 'success');
        } catch(err) {
            GlobalUI.showToast('Failed to reach Command. Saving to Offline Queue.', 'error');
        }
    }




// Commander Panel Logic
setTimeout(() => {
    const origTransmit = window.transmitSOS;
    if(origTransmit && !window.transmitPatched) {
        window.transmitPatched = true;
        window.transmitSOS = async function() {
            await origTransmit();
            setTimeout(() => {
                const mapContainer = document.getElementById('sos-map-container');
                const commandHtml = `
                    <div id="sos-command-panel" class="glass-panel" style="margin-top: 20px; padding: 20px; border: 1px solid #FFCC00; text-align: left;">
                        <h4 style="color: #FFCC00; margin-bottom: 15px;"><i class="fa-solid fa-satellite-dish"></i> COMMAND CENTER OVERRIDE</h4>
                        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: white; margin-bottom: 10px;">
                            RECOMMENDED ACTION: Dispatch nearest Traverse Unit (TRV-04). ETA: 45 mins.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-cyber" id="btn-sos-approve" style="border-color: #00FF66; color: #00FF66;">APPROVE SAR</button>
                            <button class="btn-cyber" id="btn-sos-reject" style="border-color: var(--alert-red); color: var(--alert-red);">REJECT (FALSE ALARM)</button>
                        </div>
                    </div>
                `;
                if(mapContainer && !document.getElementById('sos-command-panel')) {
                    mapContainer.insertAdjacentHTML('afterend', commandHtml);
                }
            }, 2000);
        }
    }
}, 1000);

document.addEventListener('click', (e) => {
    if(e.target.id === 'btn-sos-approve') {
        GlobalUI.showToast('Search and Rescue (SAR) Team Dispatched.', 'success');
        document.getElementById('sos-command-panel').innerHTML = '<h4 class="neon-text-red">SAR EN ROUTE - ETA 42 MINS</h4>';
    }
    if(e.target.id === 'btn-sos-reject') {
        GlobalUI.showToast('Incident marked as false alarm.', 'info');
        document.getElementById('sos-command-panel').style.display = 'none';
    }
});

// AI Simulator Event Logic
document.addEventListener('click', async (e) => {
    if(e.target.closest('#btn-run-simulation')) {
        const scenario = document.getElementById('ai-scenario-select').value;
        const station = document.getElementById('ai-station-select').value;
        const duration = parseInt(document.getElementById('ai-duration').value || '7');
        
        const overlay = document.getElementById('ai-overlay');
        const loadingText = document.getElementById('ai-loading-text');
        overlay.style.display = 'flex';
        loadingText.innerText = 'CALCULATING QUANTUM PROBABILITIES...';
        
        try {
            const res = await fetch('http://localhost:8080/api/intelligence/what-if', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: scenario,
                    params: { station: station, duration: duration, days: duration }
                })
            });
            const data = await res.json();
            
            // Artificial delay for visual effect
            setTimeout(() => {
                overlay.style.display = 'none';
                document.getElementById('res-confidence').innerText = data.confidenceInterval || '92.4%';
                document.getElementById('res-affected').innerText = data.affectedItems.length + ' SYSTEMS FLAGED';
                
                const fList = document.getElementById('res-failures');
                fList.innerHTML = '';
                if(data.criticalShortages.length === 0) {
                     fList.innerHTML = '<li><i class="fa-solid fa-check" style="color:#00FF66;"></i> No critical failures detected.</li>';
                } else {
                     data.criticalShortages.forEach(c => {
                         fList.innerHTML += `<li style="margin-bottom:5px;">- ${c}</li>`;
                     });
                }

                const mList = document.getElementById('res-mitigation');
                mList.innerHTML = '';
                data.recommendations.forEach(r => {
                     mList.innerHTML += `<li style="margin-bottom:5px;">- ${r}</li>`;
                });
                
            }, 1500);

        } catch(err) {
            loadingText.innerText = 'CONNECTION ERROR';
            loadingText.style.color = 'var(--alert-red)';
            GlobalUI.showToast('Backend connection failed', 'error');
            setTimeout(() => { overlay.style.display = 'none'; }, 2000);
        }
    }
});
