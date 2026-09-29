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

        '#data-sync': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-satellite-dish"></i> POLARIS MESH NETWORK</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">DATA <span style="font-weight: 700; color: #00E5FF;">UPLINK</span></h1>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
                    <!-- LEFT COLUMN: STATUS & CONTROLS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- SAT LINK VISUALIZER -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-height: 250px;">
                            <div id="sync-radar-ring" style="width: 150px; height: 150px; border-radius: 50%; border: 2px dashed #00FF66; position: absolute; animation: slowSpin 10s linear infinite;"></div>
                            <i id="sync-sat-icon" class="fa-solid fa-satellite-dish" style="font-size: 3rem; color: #00FF66; z-index: 2; text-shadow: 0 0 20px rgba(0,255,102,0.8);"></i>
                            <div id="sync-status-main" style="margin-top: 25px; font-family: var(--font-mono); font-size: 1.2rem; color: #00FF66; font-weight: bold; z-index: 2; letter-spacing: 2px;">CONNECTION ACTIVE</div>
                            <div id="sync-bandwidth" style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-top: 5px; z-index: 2;">Bandwidth: 256 kbps (KU-Band)</div>
                        </div>

                        <!-- CONTROLS -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px;">
                            <div style="color: #fff; font-size: 14px; font-weight: bold; margin-bottom: 15px;"><i class="fa-solid fa-gamepad"></i> DEMO CONTROLS</div>
                            <div style="display: flex; gap: 10px;">
                                <button onclick="window.severUplink()" style="flex: 1; background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(255,0,60,0.2)'" onmouseout="this.style.background='rgba(255,0,60,0.1)'">
                                    <i class="fa-solid fa-bolt-lightning"></i> SEVER UPLINK (OFFLINE)
                                </button>
                                <button onclick="window.restoreUplink()" style="flex: 1; background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; color: #00FF66; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,255,102,0.2)'" onmouseout="this.style.background='rgba(0,255,102,0.1)'">
                                    <i class="fa-solid fa-satellite-dish"></i> RESTORE & SYNC
                                </button>
                            </div>
                            <p style="color: #555; font-size: 11px; margin-top: 15px; font-family: var(--font-mono);">Use these controls to demonstrate offline-first architecture. When severed, all app actions cache locally. When restored, they sync automatically.</p>
                        </div>

                    </div>

                    <!-- RIGHT COLUMN: LOCAL QUEUE -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; display: flex; flex-direction: column;">
                        
                        <div style="padding: 20px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #00E5FF; font-size: 14px; font-weight: bold; font-family: var(--font-mono);"><i class="fa-solid fa-database"></i> LOCAL IndexedDB QUEUE</div>
                            <div id="sync-queue-count" style="background: #111; border: 1px solid #333; color: #fff; padding: 4px 10px; font-family: var(--font-mono); font-size: 10px; border-radius: 12px;">0 PENDING</div>
                        </div>

                        <div id="sync-terminal" style="flex: 1; padding: 20px; font-family: var(--font-mono); font-size: 11px; color: #aaa; overflow-y: auto; background: #000;">
                            <div>[SYSTEM] Listening for data mutations...</div>
                        </div>
                        
                        <div id="sync-progress-bar" style="height: 4px; background: #00FF66; width: 0%; transition: width 0.2s;"></div>

                    </div>
                </div>
            </div>
            <style>
                @keyframes slowSpin { 100% { transform: rotate(360deg); } }
            </style>
        `,

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
                                                
        '#timeline': `
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
        `,

        '#personnel': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #666; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-fingerprint"></i> SECURE IDENTITY ACCESS</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">BIOMETRIC <span style="font-weight: 700; color: #00FF66;">ROSTER</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="background: rgba(0, 255, 102, 0.1); border: 1px solid rgba(0, 255, 102, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center;">
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 18px;">142</div>
                            <div style="color: #888; font-size: 9px; letter-spacing: 1px; margin-top: 3px;">TOTAL DEPLOYED</div>
                        </div>
                        <div style="background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 18px;">4</div>
                            <div style="color: #888; font-size: 9px; letter-spacing: 1px; margin-top: 3px;">ACTIVE TEAMS</div>
                        </div>
                        <div style="background: rgba(255, 0, 60, 0.1); border: 1px solid rgba(255, 0, 60, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center;">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px;">0</div>
                            <div style="color: #888; font-size: 9px; letter-spacing: 1px; margin-top: 3px;">MEDICAL ALERTS</div>
                        </div>
                    </div>
                </div>

                <!-- CONTROLS -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" placeholder="Search ID or Name..." style="background: #111; border: 1px solid #333; color: #fff; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); width: 250px; outline: none;">
                        <select style="background: #111; border: 1px solid #333; color: #fff; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); outline: none;">
                            <option>All Stations</option>
                            <option>Bharati (68°S)</option>
                            <option>Maitri (70°S)</option>
                            <option>MV Vasiliy Golovnin</option>
                        </select>
                    </div>
                    <button style="background: transparent; border: 1px solid #00E5FF; color: #00E5FF; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.1)'" onmouseout="this.style.background='transparent'"><i class="fa-solid fa-file-export"></i> EXPORT LOGS</button>
                </div>

                <!-- PERSONNEL GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding-bottom: 40px;">
                    
                    <!-- Card 1 -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 6px; overflow: hidden; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div>
                        <div style="padding: 20px; display: flex; gap: 15px; border-bottom: 1px solid #1a1a1a;">
                            <div style="width: 60px; height: 60px; border-radius: 4px; background: #222 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Raj&backgroundColor=111111') center/cover; border: 1px solid #444;"></div>
                            <div>
                                <div style="color: #fff; font-size: 16px; font-weight: 500;">Dr. Raj Varma</div>
                                <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-top: 4px;">Chief Glaciologist</div>
                                <div style="color: #00FF66; font-size: 10px; font-family: var(--font-mono); margin-top: 4px; background: rgba(0,255,102,0.1); display: inline-block; padding: 2px 6px; border-radius: 2px;">ON DUTY</div>
                            </div>
                        </div>
                        <div style="padding: 15px; background: #111;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">LOCATION</div>
                                <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono);">Bharati Sector 4</div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">VITALS</div>
                                <div style="color: #fff; font-size: 11px; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
                                    <span><i class="fa-solid fa-heart-pulse" style="color:#FF003C; animation: pulse 1s infinite;"></i> 72 BPM</span>
                                    <span style="color:#444;">|</span>
                                    <span><i class="fa-solid fa-lungs"></i> 98%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 6px; overflow: hidden; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div>
                        <div style="padding: 20px; display: flex; gap: 15px; border-bottom: 1px solid #1a1a1a;">
                            <div style="width: 60px; height: 60px; border-radius: 4px; background: #222 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Anita&backgroundColor=111111') center/cover; border: 1px solid #444;"></div>
                            <div>
                                <div style="color: #fff; font-size: 16px; font-weight: 500;">Anita Desai</div>
                                <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-top: 4px;">Logistics Commander</div>
                                <div style="color: #00FF66; font-size: 10px; font-family: var(--font-mono); margin-top: 4px; background: rgba(0,255,102,0.1); display: inline-block; padding: 2px 6px; border-radius: 2px;">ON DUTY</div>
                            </div>
                        </div>
                        <div style="padding: 15px; background: #111;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">LOCATION</div>
                                <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono);">Maitri Base</div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">VITALS</div>
                                <div style="color: #fff; font-size: 11px; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
                                    <span><i class="fa-solid fa-heart-pulse" style="color:#FF003C; animation: pulse 1.2s infinite;"></i> 68 BPM</span>
                                    <span style="color:#444;">|</span>
                                    <span><i class="fa-solid fa-lungs"></i> 99%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3 -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 6px; overflow: hidden; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #F39C12; box-shadow: 0 0 10px #F39C12;"></div>
                        <div style="padding: 20px; display: flex; gap: 15px; border-bottom: 1px solid #1a1a1a;">
                            <div style="width: 60px; height: 60px; border-radius: 4px; background: #222 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir&backgroundColor=111111') center/cover; border: 1px solid #444;"></div>
                            <div>
                                <div style="color: #fff; font-size: 16px; font-weight: 500;">Kabir Singh</div>
                                <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-top: 4px;">PistenBully Operator</div>
                                <div style="color: #F39C12; font-size: 10px; font-family: var(--font-mono); margin-top: 4px; background: rgba(243,156,18,0.1); display: inline-block; padding: 2px 6px; border-radius: 2px;">IN TRANSIT</div>
                            </div>
                        </div>
                        <div style="padding: 15px; background: #111;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">LOCATION</div>
                                <div style="color: #F39C12; font-size: 11px; font-family: var(--font-mono);">Convoy Alpha (Ice-Shelf)</div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">VITALS</div>
                                <div style="color: #fff; font-size: 11px; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
                                    <span><i class="fa-solid fa-heart-pulse" style="color:#FF003C; animation: pulse 0.8s infinite;"></i> 85 BPM</span>
                                    <span style="color:#444;">|</span>
                                    <span><i class="fa-solid fa-lungs"></i> 96%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4 -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 6px; overflow: hidden; position: relative;">
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div>
                        <div style="padding: 20px; display: flex; gap: 15px; border-bottom: 1px solid #1a1a1a;">
                            <div style="width: 60px; height: 60px; border-radius: 4px; background: #222 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=111111') center/cover; border: 1px solid #444;"></div>
                            <div>
                                <div style="color: #fff; font-size: 16px; font-weight: 500;">Dr. Elena R.</div>
                                <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-top: 4px;">Medical Officer</div>
                                <div style="color: #00E5FF; font-size: 10px; font-family: var(--font-mono); margin-top: 4px; background: rgba(0,229,255,0.1); display: inline-block; padding: 2px 6px; border-radius: 2px;">RESTING</div>
                            </div>
                        </div>
                        <div style="padding: 15px; background: #111;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">LOCATION</div>
                                <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono);">Bharati Quarters</div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div style="color: #555; font-size: 10px; font-family: var(--font-mono);">VITALS</div>
                                <div style="color: #fff; font-size: 11px; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
                                    <span><i class="fa-solid fa-heart-pulse" style="color:#FF003C; animation: pulse 1.5s infinite;"></i> 58 BPM</span>
                                    <span style="color:#444;">|</span>
                                    <span><i class="fa-solid fa-lungs"></i> 99%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `,

        '#movement': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #666; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-satellite"></i> GLOBAL POSITIONING SYSTEM</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">LIVE ASSET <span style="font-weight: 700; color: #00E5FF;">MOVEMENT</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF; background: rgba(0, 229, 255, 0.05);"><i class="fa-solid fa-location-crosshairs"></i> RE-CENTER MAP</button>
                    </div>
                </div>

                <!-- MAIN CONTENT GRID -->
                <div style="flex: 1; display: grid; grid-template-columns: 350px 1fr; gap: 25px; overflow: hidden;">
                    
                    <!-- LEFT PANEL: ACTIVE MOVEMENTS -->
                    <div style="display: flex; flex-direction: column; gap: 15px; overflow-y: auto; padding-right: 5px;">
                        
                        <!-- Tracked Asset 1 -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; border-radius: 4px; padding: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #fff; font-size: 14px; font-weight: 600;"><i class="fa-solid fa-ship" style="color:#00E5FF; margin-right:5px;"></i> MV Vasiliy Golovnin</div>
                                    <div style="color: #888; font-size: 10px; font-family: var(--font-mono); margin-top:2px;">ICE-CLASS EXPEDITION VESSEL</div>
                                </div>
                                <div style="background: rgba(0,229,255,0.1); color: #00E5FF; font-size: 9px; padding: 2px 6px; border-radius: 2px; font-family: var(--font-mono);">EN ROUTE</div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #050505; padding: 10px; border: 1px solid #111; border-radius: 4px; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">SPEED</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">14.2 KNOTS</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">BEARING</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">184° SOUTH</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LATITUDE</div>
                                    <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono);">54° 23' 12" S</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LONGITUDE</div>
                                    <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono);">42° 11' 08" E</div>
                                </div>
                            </div>
                            <div style="color: #aaa; font-size: 11px;"><strong>DEST:</strong> Bharati Station (ETA: 4 Days)</div>
                        </div>

                        <!-- Tracked Asset 2 -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #F39C12; border-radius: 4px; padding: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #fff; font-size: 14px; font-weight: 600;"><i class="fa-solid fa-snowplow" style="color:#F39C12; margin-right:5px;"></i> Convoy Alpha</div>
                                    <div style="color: #888; font-size: 10px; font-family: var(--font-mono); margin-top:2px;">PISTENBULLY TRAVERSE TEAM</div>
                                </div>
                                <div style="background: rgba(243,156,18,0.1); color: #F39C12; font-size: 9px; padding: 2px 6px; border-radius: 2px; font-family: var(--font-mono);">TRAVERSING</div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #050505; padding: 10px; border: 1px solid #111; border-radius: 4px; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">SPEED</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">12.5 KM/H</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">BEARING</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">085° EAST</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LATITUDE</div>
                                    <div style="color: #F39C12; font-size: 11px; font-family: var(--font-mono);">69° 14' 22" S</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LONGITUDE</div>
                                    <div style="color: #F39C12; font-size: 11px; font-family: var(--font-mono);">76° 45' 10" E</div>
                                </div>
                            </div>
                            <div style="color: #aaa; font-size: 11px;"><strong>DEST:</strong> Maitri Base (ETA: 18 Hours)</div>
                        </div>

                        <!-- Tracked Asset 3 -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00FF66; border-radius: 4px; padding: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #fff; font-size: 14px; font-weight: 600;"><i class="fa-solid fa-helicopter" style="color:#00FF66; margin-right:5px;"></i> Ka-32 (VT-XYZ)</div>
                                    <div style="color: #888; font-size: 10px; font-family: var(--font-mono); margin-top:2px;">HEAVY AIR-LIFT HELICOPTER</div>
                                </div>
                                <div style="background: rgba(0,255,102,0.1); color: #00FF66; font-size: 9px; padding: 2px 6px; border-radius: 2px; font-family: var(--font-mono);">HOVERING</div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #050505; padding: 10px; border: 1px solid #111; border-radius: 4px; margin-bottom: 10px;">
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">SPEED</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">0 KNOTS</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">ALTITUDE</div>
                                    <div style="color: #fff; font-size: 12px; font-family: var(--font-mono);">150 FEET</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LATITUDE</div>
                                    <div style="color: #00FF66; font-size: 11px; font-family: var(--font-mono);">69° 24' 28" S</div>
                                </div>
                                <div>
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">LONGITUDE</div>
                                    <div style="color: #00FF66; font-size: 11px; font-family: var(--font-mono);">76° 11' 14" E</div>
                                </div>
                            </div>
                            <div style="color: #aaa; font-size: 11px;"><strong>TASK:</strong> Sling Load Offload (Bharati)</div>
                        </div>

                    </div>

                    <!-- RIGHT PANEL: TACTICAL MAP -->
                    <div style="position: relative; border: 1px solid #222; border-radius: 4px; background: #030303; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                        
                        <!-- Stylized Dark Map Background -->
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_relief_location_map.jpg" style="position: absolute; width: 150%; height: 150%; object-fit: cover; opacity: 0.15; filter: grayscale(100%) contrast(150%) brightness(0.8); pointer-events: none;">
                        
                        <!-- Grid Overlay -->
                        <div style="position: absolute; top:0; left:0; right:0; bottom:0; background-image: linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none;"></div>

                        <!-- Map HUD Elements -->
                        <div style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.8); border: 1px solid #333; padding: 10px; font-family: var(--font-mono); font-size: 10px; color: #00E5FF;">
                            <div style="color:#fff; margin-bottom:5px;">TACTICAL FEED: ONLINE</div>
                            <div style="color:#888;">SAT-LINK: <span style="color:#00FF66;">SECURE</span></div>
                            <div style="color:#888;">ENCRYPTION: AES-256</div>
                        </div>

                        <!-- Asset Markers on Map -->
                        <!-- Ship Marker -->
                        <div style="position: absolute; top: 30%; left: 65%; display: flex; flex-direction: column; align-items: center;">
                            <div style="color: #00E5FF; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px; background: rgba(0,0,0,0.7); padding: 2px 5px; border-radius: 2px; border: 1px solid #00E5FF;">MV VASILIY</div>
                            <div style="position: relative; width: 14px; height: 14px;">
                                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: #00E5FF; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; top:-5px; left:-5px; right:-5px; bottom:-5px; border: 1px solid #00E5FF; border-radius: 50%; animation: pulse 2s infinite;"></div>
                            </div>
                            <!-- Trailing Path -->
                            <div style="position: absolute; top: 14px; left: 6px; width: 2px; height: 100px; background: repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,229,255,0.4) 4px, rgba(0,229,255,0.4) 8px); transform-origin: top; transform: rotate(-10deg);"></div>
                        </div>

                        <!-- Convoy Marker -->
                        <div style="position: absolute; top: 55%; left: 55%; display: flex; flex-direction: column; align-items: center;">
                            <div style="color: #F39C12; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px; background: rgba(0,0,0,0.7); padding: 2px 5px; border-radius: 2px; border: 1px solid #F39C12;">CONVOY ALPHA</div>
                            <div style="position: relative; width: 12px; height: 12px;">
                                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: #F39C12; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; top:-4px; left:-4px; right:-4px; bottom:-4px; border: 1px solid #F39C12; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
                            </div>
                        </div>

                        <!-- Heli Marker (At Base) -->
                        <div style="position: absolute; top: 60%; left: 70%; display: flex; flex-direction: column; align-items: center;">
                            <div style="color: #00FF66; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px; background: rgba(0,0,0,0.7); padding: 2px 5px; border-radius: 2px; border: 1px solid #00FF66;">KA-32 (BHARATI)</div>
                            <div style="position: relative; width: 14px; height: 14px;">
                                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: #00FF66; border-radius: 50%; opacity: 0.8;"></div>
                                <div style="position: absolute; top:-6px; left:-6px; right:-6px; bottom:-6px; border: 1px dashed #00FF66; border-radius: 50%; animation: spin 4s linear infinite;"></div>
                            </div>
                        </div>

                        <!-- Radar Scanning Effect overlay -->
                        <div style="position: absolute; top: 50%; left: 50%; width: 400px; height: 400px; margin-top: -200px; margin-left: -200px; border-radius: 50%; border: 1px solid rgba(0,229,255,0.1); pointer-events: none;">
                            <div style="position: absolute; top: 50%; left: 50%; width: 200px; height: 2px; background: linear-gradient(90deg, rgba(0,229,255,0), rgba(0,229,255,0.4)); transform-origin: left center; animation: spin 6s linear infinite;"></div>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
            </style>
        `,

        '#medical': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px; font-weight: bold;"><i class="fa-solid fa-briefcase-medical"></i> CMO DASHBOARD</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">MEDICAL & <span style="font-weight: 700; color: #00E5FF;">TRAINING</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="background: rgba(0, 255, 102, 0.1); border: 1px solid rgba(0, 255, 102, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center;">
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 18px;">140/142</div>
                            <div style="color: #888; font-size: 9px; letter-spacing: 1px; margin-top: 3px;">FIT FOR DUTY</div>
                        </div>
                        <div style="background: rgba(255, 0, 60, 0.1); border: 1px solid rgba(255, 0, 60, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center; box-shadow: 0 0 10px rgba(255,0,60,0.2);">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px; animation: pulse 2s infinite;">2</div>
                            <div style="color: #FF003C; font-size: 9px; letter-spacing: 1px; margin-top: 3px; font-weight:bold;">IN SICKBAY</div>
                        </div>
                        <div style="background: rgba(243, 156, 18, 0.1); border: 1px solid rgba(243, 156, 18, 0.4); padding: 10px 15px; border-radius: 4px; text-align: center;">
                            <div style="color: #F39C12; font-family: var(--font-mono); font-size: 18px;">STANDBY</div>
                            <div style="color: #888; font-size: 9px; letter-spacing: 1px; margin-top: 3px;">MEDEVAC STATUS</div>
                        </div>
                    </div>
                </div>

                <!-- MAIN 3-COLUMN GRID -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; flex: 1;">
                    
                    <!-- COLUMN 1: TRIAGE & SICKBAY -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="color: #fff; font-family: var(--font-mono); font-size: 13px; letter-spacing: 1px; padding: 10px; background: #111; border-left: 3px solid #FF003C;"><i class="fa-solid fa-bed-pulse" style="color: #FF003C; margin-right: 8px;"></i> ACTIVE TRIAGE</div>
                        
                        <!-- Patient 1 -->
                        <div style="background: rgba(255, 0, 60, 0.05); border: 1px solid rgba(255, 0, 60, 0.2); border-radius: 4px; padding: 15px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top:0; right:0; padding: 4px 8px; background: #FF003C; color: #fff; font-size: 9px; font-family: var(--font-mono); font-weight: bold;">SEVERITY: MODERATE</div>
                            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #FF003C; background: #111 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Amit') center/cover;"></div>
                                <div>
                                    <div style="color: #fff; font-size: 14px; font-weight: 500;">Amit Patel</div>
                                    <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Expedition Engineer (Team B)</div>
                                </div>
                            </div>
                            <div style="background: #000; padding: 10px; border-radius: 4px; border: 1px solid #222;">
                                <div style="color: #FF003C; font-size: 11px; margin-bottom: 5px;"><strong>DIAGNOSIS:</strong> Grade 1 Frostbite (Fingers)</div>
                                <div style="color: #aaa; font-size: 10px;"><strong>TREATMENT:</strong> Rewarming protocol initiated. Continuous monitoring.</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-family: var(--font-mono); font-size: 10px;">
                                <span style="color: #555;">BPM: <span style="color:#00FF66;">82</span></span>
                                <span style="color: #555;">TEMP: <span style="color:#F39C12;">35.8°C</span></span>
                                <span style="color: #555;">SpO2: <span style="color:#00FF66;">97%</span></span>
                            </div>
                        </div>

                        <!-- Patient 2 -->
                        <div style="background: rgba(243, 156, 18, 0.05); border: 1px solid rgba(243, 156, 18, 0.2); border-radius: 4px; padding: 15px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top:0; right:0; padding: 4px 8px; background: #F39C12; color: #fff; font-size: 9px; font-family: var(--font-mono); font-weight: bold;">SEVERITY: LOW</div>
                            <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #F39C12; background: #111 url('https://api.dicebear.com/7.x/avataaars/svg?seed=Priya') center/cover;"></div>
                                <div>
                                    <div style="color: #fff; font-size: 14px; font-weight: 500;">Dr. Priya N.</div>
                                    <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Atmospheric Scientist</div>
                                </div>
                            </div>
                            <div style="background: #000; padding: 10px; border-radius: 4px; border: 1px solid #222;">
                                <div style="color: #F39C12; font-size: 11px; margin-bottom: 5px;"><strong>DIAGNOSIS:</strong> Snow Blindness (Photokeratitis)</div>
                                <div style="color: #aaa; font-size: 10px;"><strong>TREATMENT:</strong> Eye patching. Restricted to dark quarters for 48 hrs.</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-family: var(--font-mono); font-size: 10px;">
                                <span style="color: #555;">BPM: <span style="color:#00FF66;">68</span></span>
                                <span style="color: #555;">TEMP: <span style="color:#00FF66;">36.5°C</span></span>
                                <span style="color: #555;">SpO2: <span style="color:#00FF66;">99%</span></span>
                            </div>
                        </div>
                    </div>

                    <!-- COLUMN 2: MEDICAL CACHE & VITALS -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="color: #fff; font-family: var(--font-mono); font-size: 13px; letter-spacing: 1px; padding: 10px; background: #111; border-left: 3px solid #00FF66;"><i class="fa-solid fa-kit-medical" style="color: #00FF66; margin-right: 8px;"></i> BASE MEDICAL CACHE</div>
                        
                        <!-- Inventory Bars -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 15px;">
                            
                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-family: var(--font-mono); font-size: 10px;">
                                    <span style="color:#aaa;">O-Negative Blood Supply</span>
                                    <span style="color:#00FF66;">18 / 20 Units</span>
                                </div>
                                <div style="height: 6px; background: #222; border-radius: 3px; overflow: hidden;">
                                    <div style="height: 100%; width: 90%; background: #00FF66; box-shadow: 0 0 5px #00FF66;"></div>
                                </div>
                            </div>

                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-family: var(--font-mono); font-size: 10px;">
                                    <span style="color:#aaa;">Emergency Oxygen Cylinders</span>
                                    <span style="color:#00E5FF;">45 / 50 Tanks</span>
                                </div>
                                <div style="height: 6px; background: #222; border-radius: 3px; overflow: hidden;">
                                    <div style="height: 100%; width: 90%; background: #00E5FF; box-shadow: 0 0 5px #00E5FF;"></div>
                                </div>
                            </div>

                            <div style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-family: var(--font-mono); font-size: 10px;">
                                    <span style="color:#aaa;">Adrenaline Auto-Injectors</span>
                                    <span style="color:#F39C12;">12 / 30 Kits</span>
                                </div>
                                <div style="height: 6px; background: #222; border-radius: 3px; overflow: hidden;">
                                    <div style="height: 100%; width: 40%; background: #F39C12; box-shadow: 0 0 5px #F39C12;"></div>
                                </div>
                            </div>

                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-family: var(--font-mono); font-size: 10px;">
                                    <span style="color:#aaa;">Frostbite Trauma Kits</span>
                                    <span style="color:#FF003C;">4 / 25 Kits</span>
                                </div>
                                <div style="height: 6px; background: #222; border-radius: 3px; overflow: hidden;">
                                    <div style="height: 100%; width: 16%; background: #FF003C; box-shadow: 0 0 5px #FF003C;"></div>
                                </div>
                                <div style="color: #FF003C; font-size: 9px; font-family: var(--font-mono); margin-top: 5px; animation: pulse 2s infinite;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL LOW SUPPLY</div>
                            </div>

                        </div>

                        <!-- LIVE ECG MONITOR (Pure CSS/SVG) -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 15px; position: relative;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;"><i class="fa-solid fa-wave-square"></i> LIVE BIOMETRIC AGGREGATE</div>
                            <div style="background: #020202; border: 1px solid #111; height: 100px; border-radius: 4px; position: relative; overflow: hidden;">
                                <!-- Grid -->
                                <div style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: linear-gradient(rgba(0, 255, 102, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 102, 0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
                                <!-- ECG SVG Line -->
                                <svg viewBox="0 0 500 100" style="position: absolute; top:0; left:0; width:100%; height:100%; filter: drop-shadow(0 0 4px #00FF66);">
                                    <path fill="none" stroke="#00FF66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        d="M 0 50 L 80 50 L 95 30 L 110 90 L 125 10 L 140 70 L 155 50 L 330 50 L 345 30 L 360 90 L 375 10 L 390 70 L 405 50 L 500 50"
                                        style="stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: ecg-sweep 3s linear infinite;" />
                                </svg>
                                <div style="position: absolute; top: 10px; right: 10px; color: #00FF66; font-family: var(--font-mono); font-size: 14px;">72 BPM</div>
                            </div>
                        </div>
                    </div>

                    <!-- COLUMN 3: TRAINING & ACADEMY -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="color: #fff; font-family: var(--font-mono); font-size: 13px; letter-spacing: 1px; padding: 10px; background: #111; border-left: 3px solid #00E5FF;"><i class="fa-solid fa-person-snowboarding" style="color: #00E5FF; margin-right: 8px;"></i> WINTER SURVIVAL ACADEMY</div>
                        
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 15px; display: flex; flex-direction: column; gap: 15px;">
                            
                            <!-- Course 1 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5px;">
                                    <div>
                                        <div style="color: #fff; font-size: 13px; font-weight: 500;">Crevasse Rescue Operations</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Mandatory for Traverse Teams</div>
                                    </div>
                                    <div style="color: #00FF66; font-size: 14px; font-family: var(--font-mono);">100%</div>
                                </div>
                                <div style="height: 4px; background: #222; border-radius: 2px;">
                                    <div style="height: 100%; width: 100%; background: #00FF66; box-shadow: 0 0 5px #00FF66;"></div>
                                </div>
                                <div style="color: #555; font-size: 9px; font-family: var(--font-mono); margin-top: 4px;">42 / 42 Personnel Certified</div>
                            </div>

                            <!-- Course 2 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5px;">
                                    <div>
                                        <div style="color: #fff; font-size: 13px; font-weight: 500;">Extreme Cold Water Survival</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Mandatory for Vessel Crew</div>
                                    </div>
                                    <div style="color: #00E5FF; font-size: 14px; font-family: var(--font-mono);">88%</div>
                                </div>
                                <div style="height: 4px; background: #222; border-radius: 2px;">
                                    <div style="height: 100%; width: 88%; background: #00E5FF; box-shadow: 0 0 5px #00E5FF;"></div>
                                </div>
                                <div style="color: #555; font-size: 9px; font-family: var(--font-mono); margin-top: 4px;">60 / 68 Personnel Certified</div>
                            </div>

                            <!-- Course 3 -->
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 5px;">
                                    <div>
                                        <div style="color: #fff; font-size: 13px; font-weight: 500;">Ka-32 Helicopter Evacuation</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">General Orientation</div>
                                    </div>
                                    <div style="color: #F39C12; font-size: 14px; font-family: var(--font-mono);">65%</div>
                                </div>
                                <div style="height: 4px; background: #222; border-radius: 2px;">
                                    <div style="height: 100%; width: 65%; background: #F39C12; box-shadow: 0 0 5px #F39C12;"></div>
                                </div>
                                <div style="color: #555; font-size: 9px; font-family: var(--font-mono); margin-top: 4px;">92 / 142 Personnel Certified (Session Scheduled)</div>
                            </div>

                            <!-- Alert Box -->
                            <div style="background: rgba(0, 229, 255, 0.05); border: 1px dashed #00E5FF; padding: 10px; border-radius: 4px; margin-top: 10px;">
                                <div style="color: #00E5FF; font-size: 11px; font-family: var(--font-mono); margin-bottom: 5px;"><i class="fa-solid fa-bullhorn"></i> UPCOMING DRILL</div>
                                <div style="color: #ccc; font-size: 11px;">"Blizzard Code Red" lockdown drill scheduled for Jan 25, 14:00 HRS. All personnel must report to safe zones.</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes ecg-sweep {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                }
            </style>
        `,

        '#all-expeditions': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505; position: relative;">
                
                <!-- Background ambient glow -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 300px; background: radial-gradient(circle at 50% -50%, rgba(0, 229, 255, 0.05) 0%, transparent 100%); pointer-events: none; z-index: 0;"></div>

                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px; position: relative; z-index: 1;">
                    <div>
                        <div style="color: #888; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-server"></i> CLASSIFIED DOSSIERS</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">ISEA <span style="font-weight: 700; color: #00E5FF;">ARCHIVE</span></h1>
                    </div>
                    
                    <!-- Filters -->
                    <div style="display: flex; gap: 10px;">
                        <button style="background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; cursor: pointer; text-transform: uppercase;">All Missions</button>
                        <button style="background: transparent; border: 1px solid #333; color: #888; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; cursor: pointer; text-transform: uppercase;">Active</button>
                        <button style="background: transparent; border: 1px solid #333; color: #888; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; cursor: pointer; text-transform: uppercase;">Completed</button>
                        <button style="background: transparent; border: 1px solid #333; color: #888; padding: 8px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; cursor: pointer; text-transform: uppercase;">Planned</button>
                    </div>
                </div>

                <!-- MAIN DOSSIER GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; position: relative; z-index: 1; padding-bottom: 50px;">
                    
                    <!-- DOSSIER 1: 46th ISEA (ACTIVE) -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #00E5FF; border-radius: 4px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" onmouseover="this.style.borderColor='#00E5FF'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#222'; this.style.transform='translateY(0)';">
                        <!-- Watermark -->
                        <div style="position: absolute; bottom: -20px; right: -10px; font-size: 120px; font-weight: 900; color: rgba(0, 229, 255, 0.03); font-family: 'Inter'; pointer-events: none; user-select: none;">46</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; margin-bottom: 5px;">CURRENT DEPLOYMENT</div>
                                <div style="color: #fff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">46th ISEA</div>
                            </div>
                            <div style="background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0,229,255,0.4); color: #00E5FF; font-size: 9px; padding: 4px 8px; border-radius: 2px; font-family: var(--font-mono); font-weight: bold; animation: pulse 2s infinite;">LIVE</div>
                        </div>

                        <div style="background: #000; padding: 15px; border-radius: 4px; border: 1px solid #111; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">PRIMARY VESSEL</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">MV Vasiliy Golovnin</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">CREW STRENGTH</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">142 Personnel</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">DEPARTURE</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">Goa / Cape Town</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">STATIONS</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">Bharati & Maitri</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 25px;">
                            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px;">
                                <span style="color:#aaa;">Overall Mission Progress</span>
                                <span style="color:#00E5FF;">45%</span>
                            </div>
                            <div style="height: 4px; background: #222; border-radius: 2px;">
                                <div style="height: 100%; width: 45%; background: #00E5FF; box-shadow: 0 0 5px #00E5FF;"></div>
                            </div>
                        </div>

                        <button style="width: 100%; background: transparent; border: 1px dashed #00E5FF; color: #00E5FF; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.1)'" onmouseout="this.style.background='transparent'" onclick="window.location.hash='#overview'">ACCESS COMMAND HUB <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i></button>
                    </div>

                    <!-- DOSSIER 2: 47th ISEA (PLANNING) -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #F39C12; border-radius: 4px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" onmouseover="this.style.borderColor='#F39C12'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#222'; this.style.transform='translateY(0)';">
                        <!-- Watermark -->
                        <div style="position: absolute; bottom: -20px; right: -10px; font-size: 120px; font-weight: 900; color: rgba(243, 156, 18, 0.03); font-family: 'Inter'; pointer-events: none; user-select: none;">47</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #F39C12; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; margin-bottom: 5px;">FUTURE DEPLOYMENT</div>
                                <div style="color: #fff; font-size: 22px; font-weight: 700; letter-spacing: 1px;">47th ISEA</div>
                            </div>
                            <div style="background: rgba(243, 156, 18, 0.1); border: 1px solid rgba(243, 156, 18, 0.4); color: #F39C12; font-size: 9px; padding: 4px 8px; border-radius: 2px; font-family: var(--font-mono); font-weight: bold;">PLANNING</div>
                        </div>

                        <div style="background: #000; padding: 15px; border-radius: 4px; border: 1px solid #111; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">PRIMARY VESSEL</div>
                                <div style="color: #888; font-size: 12px; font-weight: 500; font-style: italic;">To be chartered</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">CREW STRENGTH</div>
                                <div style="color: #888; font-size: 12px; font-weight: 500; font-style: italic;">Estimating 150+</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">EST. DEPARTURE</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">Nov 2027</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">FOCUS</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">Maitri-II Survey</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 25px;">
                            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px;">
                                <span style="color:#aaa;">Procurement & Planning</span>
                                <span style="color:#F39C12;">15%</span>
                            </div>
                            <div style="height: 4px; background: #222; border-radius: 2px;">
                                <div style="height: 100%; width: 15%; background: #F39C12; box-shadow: 0 0 5px #F39C12;"></div>
                            </div>
                        </div>

                        <button style="width: 100%; background: transparent; border: 1px solid #333; color: #888; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'">OPEN DRAFT DOSSIER</button>
                    </div>

                    <!-- DOSSIER 3: 45th ISEA (COMPLETED) -->
                    <div style="background: rgba(10,10,10,0.5); border: 1px solid #222; border-top: 3px solid #00FF66; border-radius: 4px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.borderColor='#00FF66'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#222'; this.style.transform='translateY(0)';">
                        <!-- Watermark -->
                        <div style="position: absolute; bottom: -20px; right: -10px; font-size: 120px; font-weight: 900; color: rgba(0, 255, 102, 0.02); font-family: 'Inter'; pointer-events: none; user-select: none;">45</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; margin-bottom: 5px;">COMPLETED (2025)</div>
                                <div style="color: #aaa; font-size: 22px; font-weight: 700; letter-spacing: 1px;">45th ISEA</div>
                            </div>
                            <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0, 255, 102, 0.3); color: #00FF66; font-size: 9px; padding: 4px 8px; border-radius: 2px; font-family: var(--font-mono); font-weight: bold;">SUCCESS</div>
                        </div>

                        <div style="background: #000; padding: 15px; border-radius: 4px; border: 1px solid #111; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; opacity: 0.7;">
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">PRIMARY VESSEL</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">MV Vasiliy Golovnin</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">CREW STRENGTH</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">138 Personnel</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">RETURNED</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">April 2026</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">INCIDENTS</div>
                                <div style="color: #00FF66; font-size: 12px; font-weight: 500;">0 (Zero Harm)</div>
                            </div>
                        </div>

                        <button style="width: 100%; background: transparent; border: 1px solid #333; color: #888; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'">VIEW AFTER-ACTION REPORT</button>
                    </div>

                    <!-- DOSSIER 4: 44th ISEA (COMPLETED) -->
                    <div style="background: rgba(10,10,10,0.5); border: 1px solid #222; border-top: 3px solid #00FF66; border-radius: 4px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.borderColor='#00FF66'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#222'; this.style.transform='translateY(0)';">
                        <!-- Watermark -->
                        <div style="position: absolute; bottom: -20px; right: -10px; font-size: 120px; font-weight: 900; color: rgba(0, 255, 102, 0.02); font-family: 'Inter'; pointer-events: none; user-select: none;">44</div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px; letter-spacing: 1px; margin-bottom: 5px;">COMPLETED (2024)</div>
                                <div style="color: #aaa; font-size: 22px; font-weight: 700; letter-spacing: 1px;">44th ISEA</div>
                            </div>
                            <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0, 255, 102, 0.3); color: #00FF66; font-size: 9px; padding: 4px 8px; border-radius: 2px; font-family: var(--font-mono); font-weight: bold;">SUCCESS</div>
                        </div>

                        <div style="background: #000; padding: 15px; border-radius: 4px; border: 1px solid #111; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; opacity: 0.7;">
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">PRIMARY VESSEL</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">Ivan Papanin</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">CREW STRENGTH</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">122 Personnel</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">RETURNED</div>
                                <div style="color: #ddd; font-size: 12px; font-weight: 500;">April 2025</div>
                            </div>
                            <div>
                                <div style="color: #666; font-size: 9px; font-family: var(--font-mono);">INCIDENTS</div>
                                <div style="color: #F39C12; font-size: 12px; font-weight: 500;">2 (Minor)</div>
                            </div>
                        </div>

                        <button style="width: 100%; background: transparent; border: 1px solid #333; color: #888; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'">VIEW AFTER-ACTION REPORT</button>
                    </div>

                </div>
            </div>
        `,

        '#cargo-dashboard': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px; font-weight: bold;"><i class="fa-solid fa-boxes-stacked"></i> RFID LOGISTICS & PAYLOAD</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">CARGO <span style="font-weight: 700; color: #00E5FF;">DASHBOARD</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF;"><i class="fa-solid fa-barcode"></i> OPEN RFID SCANNER</button>
                        <button class="btn-outline" style="border-color: #00FF66; color: #00FF66;"><i class="fa-solid fa-file-invoice"></i> GENERATE MANIFEST</button>
                    </div>
                </div>

                <!-- KPI STATS ROW -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                    <!-- Stat 1 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; padding: 15px; border-radius: 4px;">
                        <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">TOTAL PAYLOAD WEIGHT</div>
                        <div style="color: #00E5FF; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">12,450 <span style="font-size:12px; color:#aaa;">MT</span></div>
                        <div style="color: #888; font-size: 10px; margin-top: 5px;"><i class="fa-solid fa-arrow-up" style="color:#00FF66;"></i> 14% vs last expedition</div>
                    </div>
                    <!-- Stat 2 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #F39C12; padding: 15px; border-radius: 4px;">
                        <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">HEAVY MACHINERY & VEHICLES</div>
                        <div style="color: #F39C12; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">24 <span style="font-size:12px; color:#aaa;">UNITS</span></div>
                        <div style="color: #888; font-size: 10px; margin-top: 5px;">PistenBullys, Cranes, Hägglunds</div>
                    </div>
                    <!-- Stat 3 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00FF66; padding: 15px; border-radius: 4px;">
                        <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">SCIENTIFIC EQUIPMENT</div>
                        <div style="color: #00FF66; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">1,280 <span style="font-size:12px; color:#aaa;">CRATES</span></div>
                        <div style="color: #888; font-size: 10px; margin-top: 5px;">Fully RFID Tagged & Verified</div>
                    </div>
                    <!-- Stat 4 -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #FF003C; padding: 15px; border-radius: 4px; box-shadow: 0 0 10px rgba(255,0,60,0.1);">
                        <div style="color: #666; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">HAZMAT / POLAR DIESEL</div>
                        <div style="color: #FF003C; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">8,500 <span style="font-size:12px; color:#aaa;">BARRELS</span></div>
                        <div style="color: #FF003C; font-size: 10px; margin-top: 5px; animation: pulse 2s infinite;"><i class="fa-solid fa-triangle-exclamation"></i> CLASS 3 FLAMMABLE</div>
                    </div>
                </div>

                <!-- MAIN 2-COLUMN LAYOUT -->
                <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 25px; flex: 1;">
                    
                    <!-- LEFT COLUMN: VESSEL HOLD CAPACITY -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #111; padding: 10px; border-left: 3px solid #00E5FF;">
                            <div style="color: #fff; font-family: var(--font-mono); font-size: 13px; letter-spacing: 1px;"><i class="fa-solid fa-ship" style="color: #00E5FF; margin-right: 8px;"></i> MV VASILIY GOLOVNIN - HOLD VISUALIZER</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px;">CAPACITY: 85% OVERALL</div>
                        </div>

                        <!-- Ship Visualizer Box -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 20px;">
                            
                            <!-- Deck A -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; align-items: flex-end;">
                                    <div>
                                        <div style="color: #fff; font-size: 14px; font-weight: 500;">Upper Deck (Helipad & Light Cargo)</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Scientific Instruments, Chopper Spares</div>
                                    </div>
                                    <div style="color: #00E5FF; font-size: 14px; font-family: var(--font-mono);">65%</div>
                                </div>
                                <div style="height: 25px; background: #111; border: 1px solid #333; border-radius: 2px; display: flex; overflow: hidden; position: relative;">
                                    <!-- Container Blocks -->
                                    <div style="width: 65%; background: rgba(0, 229, 255, 0.2); border-right: 1px solid #00E5FF; display: flex;">
                                        <div style="flex:1; border-right: 1px dashed rgba(0,229,255,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(0,229,255,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(0,229,255,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(0,229,255,0.4);"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Deck B -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; align-items: flex-end;">
                                    <div>
                                        <div style="color: #fff; font-size: 14px; font-weight: 500;">Middle Hold (Heavy Vehicles)</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">PistenBullys, Cranes, Traverse Modules</div>
                                    </div>
                                    <div style="color: #F39C12; font-size: 14px; font-family: var(--font-mono);">92%</div>
                                </div>
                                <div style="height: 25px; background: #111; border: 1px solid #333; border-radius: 2px; display: flex; overflow: hidden; position: relative;">
                                    <!-- Container Blocks -->
                                    <div style="width: 92%; background: rgba(243, 156, 18, 0.2); border-right: 1px solid #F39C12; display: flex;">
                                        <div style="flex:1; border-right: 1px dashed rgba(243, 156, 18,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(243, 156, 18,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(243, 156, 18,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(243, 156, 18,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(243, 156, 18,0.4);"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Deck C -->
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; align-items: flex-end;">
                                    <div>
                                        <div style="color: #fff; font-size: 14px; font-weight: 500;">Lower Hold (Fuel & Provisions)</div>
                                        <div style="color: #888; font-size: 10px; font-family: var(--font-mono);">Antarctic Diesel, Food Rations (18 Months)</div>
                                    </div>
                                    <div style="color: #FF003C; font-size: 14px; font-family: var(--font-mono); font-weight: bold;">98%</div>
                                </div>
                                <div style="height: 25px; background: #111; border: 1px solid #333; border-radius: 2px; display: flex; overflow: hidden; position: relative;">
                                    <!-- Container Blocks -->
                                    <div style="width: 98%; background: rgba(255, 0, 60, 0.2); border-right: 1px solid #FF003C; display: flex; box-shadow: inset 0 0 10px rgba(255,0,60,0.5);">
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                        <div style="flex:1; border-right: 1px dashed rgba(255, 0, 60,0.4);"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- RIGHT COLUMN: LIVE RFID SCAN TERMINAL -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #111; padding: 10px; border-left: 3px solid #00FF66;">
                            <div style="color: #fff; font-family: var(--font-mono); font-size: 13px; letter-spacing: 1px;"><i class="fa-solid fa-wifi" style="color: #00FF66; margin-right: 8px;"></i> LIVE RFID TERMINAL FEED</div>
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px; animation: pulse 1s infinite;">Gantry Active</div>
                        </div>

                        <div style="background: #020202; border: 1px solid #222; border-radius: 4px; padding: 15px; flex: 1; font-family: var(--font-mono); font-size: 11px; color: #00FF66; overflow-y: auto; display: flex; flex-direction: column; justify-content: flex-end; position: relative;">
                            
                            <!-- Terminal Ambient Scanline -->
                            <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(rgba(0,255,102,0) 50%, rgba(0,255,102,0.05) 50%); background-size: 100% 4px; pointer-events: none; z-index: 0;"></div>

                            <!-- Feed Lines -->
                            <div style="position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px;">
                                <div style="color: #555;">[14:22:05] SYSTEM REBOOT... SUCCESS</div>
                                <div style="color: #555;">[14:22:12] RFID SCANNER MODULE ENCRYPTED (AES-256)</div>
                                <div style="color: #888;">[14:25:33] CONNECTING TO GANTRY 4... ESTABLISHED</div>
                                
                                <div style="border-left: 2px solid #00E5FF; padding-left: 8px; margin: 4px 0;">
                                    <span style="color:#00E5FF;">[14:30:11] NEW TAG DETECTED:</span> RFID-3920-X <br>
                                    <span style="color:#fff;">ASSET: Crate (Medical Supplies - Paracetamol)</span> <br>
                                    <span style="color:#aaa;">DEST: Bharati Base (Sector 4) | STATUS: <span style="color:#00FF66;">[STOWED - DECK A]</span></span>
                                </div>

                                <div style="border-left: 2px solid #F39C12; padding-left: 8px; margin: 4px 0;">
                                    <span style="color:#F39C12;">[14:34:55] NEW TAG DETECTED:</span> RFID-PB-04 <br>
                                    <span style="color:#fff;">ASSET: Vehicle (PistenBully 400 W Polar)</span> <br>
                                    <span style="color:#aaa;">DEST: Maitri Traverse | STATUS: <span style="color:#00FF66;">[STOWED - DECK B]</span></span>
                                </div>

                                <div style="border-left: 2px solid #FF003C; padding-left: 8px; margin: 4px 0; background: rgba(255,0,60,0.1);">
                                    <span style="color:#FF003C;">[14:42:10] CRITICAL ASSET DETECTED:</span> RFID-HAZ-99 <br>
                                    <span style="color:#fff;">ASSET: POLAR DIESEL (BARREL #804)</span> <br>
                                    <span style="color:#aaa;">DEST: Maitri Backup Tanks | STATUS: <span style="color:#F39C12;">[LOADING...]</span></span>
                                </div>

                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                                    <div style="width: 8px; height: 12px; background: #00FF66; animation: blink 1s infinite;"></div>
                                    <span style="color: #00FF66;">WAITING FOR NEXT SCAN...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            </style>
        `,

        '#cargo-details': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #888; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-list-check"></i> GLOBAL LOGISTICS DATABASE</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">MASTER CARGO <span style="font-weight: 700; color: #00E5FF;">MANIFEST</span></h1>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-outline" style="border-color: #333; color: #aaa;"><i class="fa-solid fa-print"></i> PRINT MANIFEST</button>
                        <button class="btn-outline" style="border-color: #00FF66; color: #00FF66; background: rgba(0,255,102,0.05);"><i class="fa-solid fa-download"></i> EXPORT TO CSV</button>
                    </div>
                </div>

                <!-- SEARCH & FILTERS -->
                <div style="display: flex; gap: 15px; margin-bottom: 20px; background: rgba(10,10,10,0.8); border: 1px solid #222; padding: 15px; border-radius: 4px;">
                    <div style="flex: 1; position: relative;">
                        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 15px; top: 12px; color: #00E5FF;"></i>
                        <input type="text" placeholder="Search by RFID, Asset Name, or Container ID..." style="width: 100%; background: #000; border: 1px solid #333; color: #00E5FF; padding: 10px 10px 10px 40px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <select style="background: #000; border: 1px solid #333; color: #888; padding: 10px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                        <option>ALL CATEGORIES</option>
                        <option>Heavy Machinery</option>
                        <option>Medical/Cold-Chain</option>
                        <option>Hazmat/Fuel</option>
                        <option>Scientific Equipment</option>
                        <option>Provisions</option>
                    </select>
                    <select style="background: #000; border: 1px solid #333; color: #888; padding: 10px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                        <option>ALL LOCATIONS</option>
                        <option>MV Vasiliy (Ship)</option>
                        <option>Bharati Station</option>
                        <option>Maitri Station</option>
                        <option>Goa Depot</option>
                    </select>
                </div>

                <!-- MANIFEST TABLE -->
                <div style="flex: 1; background: #0a0a0a; border: 1px solid #222; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Table Header -->
                    <div style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; background: #111; border-bottom: 1px solid #333; padding: 15px; font-family: var(--font-mono); font-size: 10px; color: #888; letter-spacing: 1px;">
                        <div>RFID / BARCODE</div>
                        <div>ASSET DESCRIPTION</div>
                        <div>CATEGORY</div>
                        <div>WEIGHT</div>
                        <div>CURRENT LOCATION</div>
                        <div>STATUS</div>
                        <div style="text-align: right;">ACTION</div>
                    </div>

                    <!-- Table Body (Scrollable) -->
                    <div style="flex: 1; overflow-y: auto;">
                        
                        <!-- Row 1 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-X992</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">PistenBully 400 W Polar (Tracked Vehicle)</div>
                            <div style="color: #aaa; font-size: 11px;">Heavy Machinery</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">10,500 kg</div>
                            <div style="color: #00E5FF; font-size: 12px;"><i class="fa-solid fa-ship" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Deck B</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: 1px solid rgba(0,229,255,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">STOWED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 2 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-M041</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">O-Negative Blood Plasma (Cold-Chain Box)</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">45 kg</div>
                            <div style="color: #00FF66; font-size: 12px;"><i class="fa-solid fa-igloo" style="margin-right:5px; font-size:10px;"></i> Bharati Base - Sickbay</div>
                            <div><span style="background: rgba(0, 255, 102, 0.1); color: #00FF66; border: 1px solid rgba(0,255,102,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">DEPLOYED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 3 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-F881</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Antarctic Aviation Fuel (Jet A-1 Drum)</div>
                            <div style="color: #aaa; font-size: 11px;">Hazmat/Fuel</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">210 kg</div>
                            <div style="color: #F39C12; font-size: 12px;"><i class="fa-solid fa-helicopter" style="margin-right:5px; font-size:10px;"></i> Sling Ops (Transit)</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); color: #F39C12; border: 1px solid rgba(243,156,18,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">IN-TRANSIT</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 4 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-S440</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Ice-Core Drilling Rig Mk4 (Module A)</div>
                            <div style="color: #aaa; font-size: 11px;">Scientific Equipment</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">3,200 kg</div>
                            <div style="color: #888; font-size: 12px;"><i class="fa-solid fa-anchor" style="margin-right:5px; font-size:10px;"></i> Goa Port (Dock 4)</div>
                            <div><span style="background: rgba(255, 255, 255, 0.05); color: #888; border: 1px solid #555; font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">PENDING LOAD</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 5 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#FF003C;"></i>RFID-H019</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Lithium-Ion Battery Bank (Unstable Temp)</div>
                            <div style="color: #aaa; font-size: 11px;">Power/Hazmat</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">850 kg</div>
                            <div style="color: #FF003C; font-size: 12px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Quarantine Zone</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); color: #FF003C; border: 1px solid rgba(255,0,60,0.4); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px; animation: pulse 2s infinite;">QUARANTINED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 6 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-R102</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Winter Rations Pallet (Dry Food - 6 Months)</div>
                            <div style="color: #aaa; font-size: 11px;">Provisions</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">500 kg</div>
                            <div style="color: #00E5FF; font-size: 12px;"><i class="fa-solid fa-ship" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Deck C</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: 1px solid rgba(0,229,255,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">STOWED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                    </div>
                    
                    <!-- Table Footer / Pagination -->
                    <div style="background: #050505; border-top: 1px solid #333; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #666; font-family: var(--font-mono); font-size: 10px;">SHOWING 1 - 6 OF 4,290 SCANNED ASSETS</div>
                        <div style="display: flex; gap: 5px;">
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">PREV</button>
                            <button style="background: rgba(0,229,255,0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 5px 10px; border-radius: 4px; cursor: pointer;">1</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">2</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">3</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">NEXT</button>
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
        
        '#chain-of-custody': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-link"></i> IMMUTABLE TRACKING LEDGER</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">CHAIN OF <span style="font-weight: 700; color: #00E5FF;">CUSTODY</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid #00E5FF; padding: 10px 15px; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-shield-halved" style="color: #00E5FF; font-size: 20px;"></i>
                            <div>
                                <div style="color: #888; font-size: 9px; font-family: var(--font-mono);">NETWORK STATUS</div>
                                <div style="color: #00E5FF; font-size: 12px; font-family: var(--font-mono); font-weight: bold;">LEDGER SYNCED</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MAIN INTERFACE -->
                <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: ASSET SUMMARY (THE TARGET) -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- Search Box -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 15px; display: flex; gap: 10px;">
                            <input type="text" value="RFID-M041-992" style="flex:1; background: #000; border: 1px solid #333; color: #00E5FF; padding: 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                            <button style="background: #00E5FF; border: none; color: #000; padding: 10px 15px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>

                        <!-- Asset Details Card -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; border-radius: 4px; padding: 25px;">
                            <div style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 5px;">O-Negative Blood Plasma</div>
                            <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-bottom: 20px;">Cold-Chain Box (Type 4)</div>
                            
                            <div style="display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">CURRENT CUSTODIAN</span>
                                    <span style="color: #fff; font-family: var(--font-mono); font-size: 11px;">Capt. R. Sharma</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">AUTHORIZATION</span>
                                    <span style="color: #00FF66; font-family: var(--font-mono); font-size: 11px;">LEVEL 4 (MEDICAL)</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">TEMP THRESHOLD</span>
                                    <span style="color: #F39C12; font-family: var(--font-mono); font-size: 11px;">-20°C to -25°C</span>
                                </div>
                            </div>

                            <div style="background: #000; border: 1px dashed #333; padding: 15px; border-radius: 4px;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">ACTIVE SMART CONTRACT</div>
                                <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; word-break: break-all;">0x8f2a99d3...c8996fb92427ae41e4649b934ca495991b7852b855</div>
                            </div>
                            
                            <button style="width: 100%; margin-top: 15px; background: rgba(0,255,102,0.1); border: 1px solid #00FF66; color: #00FF66; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                                <i class="fa-solid fa-file-contract"></i> VERIFY INTEGRITY
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: THE LEDGER TIMELINE -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 30px; position: relative;">
                        
                        <h3 style="color: #fff; font-size: 14px; margin: 0 0 30px 0; font-family: 'Inter'; font-weight: 500; letter-spacing: 1px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px;">CUSTODY HANDOVER LOG</h3>

                        <!-- Timeline Container -->
                        <div style="position: relative; padding-left: 30px;">
                            
                            <!-- Vertical Connecting Line -->
                            <div style="position: absolute; top: 10px; bottom: 50px; left: 11px; width: 2px; background: linear-gradient(to bottom, #00FF66 0%, #00E5FF 60%, #333 100%);"></div>

                            <!-- BLOCK 1 (Origin) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <!-- Node Dot -->
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00FF66; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 10px #00FF66;"></div>
                                
                                <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0,255,102,0.2); padding: 15px; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00FF66; font-size: 12px; font-weight: bold;">ORIGIN - GOA DEPOT (INDIA)</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">12-JAN-2026 | 08:30 IST</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">AUTHORIZED BY</div>
                                            <div style="color: #ddd; font-size: 11px;">Dr. Anil Kapoor (Logistics Head)</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Packaged & Sealed in Cold-Chain</div>
                                        </div>
                                    </div>
                                    <div style="color: #444; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock" style="color: #00FF66;"></i> HASH: 7b8c...92f1 (Verified)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 2 (Loading) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00FF66; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 10px #00FF66;"></div>
                                
                                <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0,255,102,0.2); padding: 15px; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00FF66; font-size: 12px; font-weight: bold;">MV VASILIY GOLOVNIN - HOLD STOWAGE</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">15-JAN-2026 | 14:45 IST</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">RECEIVED BY</div>
                                            <div style="color: #ddd; font-size: 11px;">Chief Mate V. Orlov</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Loaded to Deck A (Med Sector)</div>
                                        </div>
                                    </div>
                                    <div style="color: #444; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock" style="color: #00FF66;"></i> HASH: a1d3...88be (Verified)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 3 (Current / Pulse) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00E5FF; border-radius: 50%; border: 3px solid #111; animation: pulse 2s infinite;"></div>
                                
                                <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid #00E5FF; padding: 15px; border-radius: 4px; box-shadow: 0 0 15px rgba(0,229,255,0.1);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00E5FF; font-size: 12px; font-weight: bold;">CAPE TOWN PORT - REFUELING / CUSTOMS</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">22-JAN-2026 | 09:12 UTC</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">CUSTODIAN</div>
                                            <div style="color: #ddd; font-size: 11px;">Capt. R. Sharma (Acting)</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Customs Inspection & Seal Check</div>
                                        </div>
                                    </div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock"></i> HASH: e3b0...b855 (Active Smart Contract)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 4 (Future Pending) -->
                            <div style="position: relative;">
                                <div style="position: absolute; left: -24px; top: 10px; width: 10px; height: 10px; background: #333; border-radius: 50%; border: 3px solid #111;"></div>
                                
                                <div style="background: transparent; border: 1px dashed #333; padding: 15px; border-radius: 4px; opacity: 0.5;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #888; font-size: 12px; font-weight: bold;">BHARATI BASE (SICKBAY)</div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">PENDING ARRIVAL</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">EXPECTED RECEIVER</div>
                                            <div style="color: #888; font-size: 11px;">CMO Dr. Raj Varma</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">EXPECTED ACTION</div>
                                            <div style="color: #888; font-size: 11px;">Final Unpacking & Storage</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        `,

        '#station-inventory': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER & STATION SWITCHER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-warehouse"></i> RESOURCE MANAGEMENT (WINTER-OVER)</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">STATION <span style="font-weight: 700; color: #00E5FF;">INVENTORY</span></h1>
                    </div>
                    
                    <!-- Station Toggle -->
                    <div style="display: flex; gap: 0; border: 1px solid #333; border-radius: 4px; overflow: hidden;">
                        <button style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: none; padding: 10px 20px; font-family: var(--font-mono); font-weight: bold; font-size: 12px; cursor: pointer;">BHARATI STATION</button>
                        <button style="background: #000; color: #888; border: none; border-left: 1px solid #333; padding: 10px 20px; font-family: var(--font-mono); font-weight: bold; font-size: 12px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='#000'">MAITRI STATION</button>
                    </div>
                </div>

                <!-- AI PREDICTIVE ALERT BANNER -->
                <div style="background: rgba(255, 0, 60, 0.05); border: 1px solid rgba(255,0,60,0.4); border-left: 4px solid #FF003C; padding: 15px; border-radius: 4px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #FF003C; font-size: 24px; animation: pulse 2s infinite;"></i>
                        <div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 13px; font-weight: bold; letter-spacing: 1px;">AI PREDICTION: WINTER-OVER SHORTAGE DETECTED</div>
                            <div style="color: #aaa; font-size: 11px; margin-top: 3px;">3 Critical items will deplete before the next scheduled vessel arrival (120 Days). Re-order required immediately.</div>
                        </div>
                    </div>
                    <button style="background: #FF003C; border: none; color: #fff; padding: 10px 15px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; border-radius: 2px; cursor: pointer;">GENERATE RE-ORDER INDENT</button>
                </div>

                <!-- KPI DASHBOARD -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
                    
                    <!-- KPI 1: Fuel -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">ANTARCTIC DIESEL (JET A-1)</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">450,000</span>
                            <span style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;">LITERS</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Tank Capacity (70%)</span>
                            <span style="color: #00E5FF;">EST: 14 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 70%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div>
                        </div>
                    </div>

                    <!-- KPI 2: Food -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">DRY RATIONS & PROVISIONS</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">14,500</span>
                            <span style="color: #00FF66; font-family: var(--font-mono); font-size: 12px;">KG</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Winter-Over Safe Line</span>
                            <span style="color: #00FF66;">EST: 18 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 85%; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div>
                        </div>
                    </div>

                    <!-- KPI 3: Medical -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">MEDICAL & LIFE SAVING</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">85</span>
                            <span style="color: #FF003C; font-family: var(--font-mono); font-size: 12px;">CRITICAL KITS</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Stock Level (Warning)</span>
                            <span style="color: #FF003C;">EST: 2 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 25%; background: #FF003C; box-shadow: 0 0 10px #FF003C;"></div>
                        </div>
                    </div>

                </div>

                <!-- DETAILED INVENTORY GRID -->
                <div style="flex: 1; background: #0a0a0a; border: 1px solid #222; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Table Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #222; background: #0f0f0f;">
                        <div style="display: flex; gap: 10px;">
                            <select style="background: #000; border: 1px solid #333; color: #888; padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none;">
                                <option>CATEGORY: ALL</option>
                                <option>Fuel & Lubes</option>
                                <option>Food & Rations</option>
                                <option>Medical</option>
                                <option>Vehicle Spares</option>
                            </select>
                            <select style="background: #000; border: 1px solid #333; color: #888; padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none;">
                                <option>STATUS: ALL</option>
                                <option>Optimal</option>
                                <option>Low Stock</option>
                                <option>Critical</option>
                                <option>Expired/Spoiled</option>
                            </select>
                        </div>
                        <div style="position: relative;">
                            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 9px; color: #555; font-size: 12px;"></i>
                            <input type="text" placeholder="Search item or SKU..." style="background: #000; border: 1px solid #333; color: #00E5FF; padding: 8px 8px 8px 30px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none; width: 250px;">
                        </div>
                    </div>

                    <!-- Table Header -->
                    <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; background: #111; border-bottom: 1px solid #333; padding: 12px 15px; font-family: var(--font-mono); font-size: 9px; color: #888; letter-spacing: 1px;">
                        <div>ITEM CODE</div>
                        <div>DESCRIPTION</div>
                        <div>CATEGORY</div>
                        <div>QTY (QoH)</div>
                        <div>MIN REQ.</div>
                        <div>DEPLETION EST.</div>
                        <div>HEALTH / EXPIRY</div>
                    </div>

                    <!-- Table Body (Scrollable) -->
                    <div style="flex: 1; overflow-y: auto;">
                        
                        <!-- Row: Critical Alert -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center; background: rgba(255, 0, 60, 0.03);">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px;">MED-8042</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Broad-Spectrum Antibiotics (Amoxicillin)</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">120 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">500 Units</div>
                            <div style="color: #FF003C; font-size: 11px;"><i class="fa-solid fa-clock"></i> 45 Days</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">CRITICAL SHORTAGE</span></div>
                        </div>

                        <!-- Row: Critical Alert 2 -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center; background: rgba(255, 0, 60, 0.03);">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px;">VSP-T220</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">PistenBully Snow Tracks (Replacement)</div>
                            <div style="color: #aaa; font-size: 11px;">Vehicle Spares</div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">1 Set</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">4 Sets</div>
                            <div style="color: #FF003C; font-size: 11px;"><i class="fa-solid fa-clock"></i> Next Breakdown</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">CRITICAL SHORTAGE</span></div>
                        </div>

                        <!-- Row: Optimal -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">FUE-0010</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Antarctic Diesel (Jet A-1) Bulk</div>
                            <div style="color: #aaa; font-size: 11px;">Fuel & Lubes</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">450,000 L</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">200,000 L</div>
                            <div style="color: #888; font-size: 11px;">> 14 Months</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">OPTIMAL</span></div>
                        </div>

                        <!-- Row: Optimal -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">PRO-2930</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Dehydrated Vegetables & Pulses</div>
                            <div style="color: #aaa; font-size: 11px;">Food & Rations</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">8,200 KG</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">4,000 KG</div>
                            <div style="color: #888; font-size: 11px;">> 18 Months</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">OPTIMAL</span></div>
                        </div>

                        <!-- Row: Warning -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">SCI-1042</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Weather Balloon Helium Canisters</div>
                            <div style="color: #aaa; font-size: 11px;">Scientific</div>
                            <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px;">40 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">50 Units</div>
                            <div style="color: #F39C12; font-size: 11px;">90 Days</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); border: 1px solid #F39C12; color: #F39C12; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">LOW STOCK</span></div>
                        </div>

                        <!-- Row: Expiring -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">MED-9930</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Epinephrine Auto-Injectors</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">45 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">20 Units</div>
                            <div style="color: #888; font-size: 11px;">Ample Supply</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); border: 1px solid #F39C12; color: #F39C12; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">EXPIRING SOON</span></div>
                        </div>

                    </div>
                </div>
            </div>
        `,

        '#transfers': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-truck-fast"></i> CONVOYS & HELO-LIFTS</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">ACTIVE <span style="font-weight: 700; color: #F39C12;">TRANSFERS</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF;"><i class="fa-solid fa-plus"></i> NEW TRANSFER INDENT</button>
                    </div>
                </div>

                <!-- OVERALL STATUS MAP (CSS BASED) -->
                <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 30px; margin-bottom: 30px; position: relative;">
                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 20px;">MACRO LOGISTICS NETWORK</div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <!-- Connection Lines -->
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 2px; background: #333; z-index: 0; border-top: 1px dashed #555;"></div>
                        <div style="position: absolute; top: 50%; left: 10%; width: 35%; height: 2px; background: #00E5FF; z-index: 0; box-shadow: 0 0 10px #00E5FF; animation: pulse 2s infinite;"></div>
                        
                        <!-- Node 1: Supply Ship -->
                        <div style="position: relative; z-index: 1; text-align: center; background: #000; padding: 10px;">
                            <div style="width: 60px; height: 60px; background: rgba(0, 229, 255, 0.1); border: 2px solid #00E5FF; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 10px;">
                                <i class="fa-solid fa-ship" style="color: #00E5FF; font-size: 24px;"></i>
                            </div>
                            <div style="color: #fff; font-size: 12px; font-weight: bold;">MV VASILIY</div>
                            <div style="color: #888; font-size: 9px; font-family: var(--font-mono);">MOORED (ICE SHELF)</div>
                        </div>

                        <!-- Node 2: Helipad / Transit -->
                        <div style="position: relative; z-index: 1; text-align: center; background: #000; padding: 10px;">
                            <div style="width: 60px; height: 60px; background: rgba(243, 156, 18, 0.1); border: 2px solid #F39C12; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 10px; animation: pulse 2s infinite;">
                                <i class="fa-solid fa-helicopter" style="color: #F39C12; font-size: 24px;"></i>
                            </div>
                            <div style="color: #fff; font-size: 12px; font-weight: bold;">IN TRANSIT</div>
                            <div style="color: #F39C12; font-size: 9px; font-family: var(--font-mono);">3 ACTIVE MISSIONS</div>
                        </div>

                        <!-- Node 3: Bases -->
                        <div style="position: relative; z-index: 1; text-align: center; background: #000; padding: 10px;">
                            <div style="width: 60px; height: 60px; background: rgba(0, 255, 102, 0.1); border: 2px solid #00FF66; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 10px;">
                                <i class="fa-solid fa-igloo" style="color: #00FF66; font-size: 24px;"></i>
                            </div>
                            <div style="color: #fff; font-size: 12px; font-weight: bold;">BHARATI / MAITRI</div>
                            <div style="color: #888; font-size: 9px; font-family: var(--font-mono);">RECEIVING BAYS</div>
                        </div>
                    </div>
                </div>

                <!-- ACTIVE TRANSFERS GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 25px; padding-bottom: 30px;">
                    
                    <!-- TRANSFER 1: HELO LIFT -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #00E5FF; border-radius: 4px; padding: 25px; position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TRANSFER ID: TRX-8041</div>
                                <div style="color: #fff; font-size: 18px; font-weight: bold;"><i class="fa-solid fa-helicopter" style="margin-right: 8px;"></i> Kamov Ka-32 (Sling Load)</div>
                            </div>
                            <div style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold; border: 1px solid rgba(0,229,255,0.4); animation: pulse 2s infinite;">
                                AIRBORNE
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #000; padding: 15px; border-radius: 4px; border: 1px dashed #222;">
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">ORIGIN</div>
                                <div style="color: #fff; font-size: 12px;">MV Vasiliy</div>
                            </div>
                            <div style="color: #00E5FF; font-size: 14px;"><i class="fa-solid fa-plane-departure"></i></div>
                            <div style="flex: 1; border-top: 1px dashed #333; margin: 0 15px; position: relative;">
                                <div style="position: absolute; top: -10px; left: 75%; color: #00E5FF; font-size: 16px;"><i class="fa-solid fa-helicopter"></i></div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">DESTINATION</div>
                                <div style="color: #fff; font-size: 12px;">Bharati Base</div>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">Payload: <span style="color:#fff;">Medical Plasma, Sensitive Instruments</span></div>
                            <div style="color: #888; font-size: 11px;">ETA: <span style="color:#00FF66;">14 mins</span></div>
                        </div>

                        <div style="height: 4px; background: #222; border-radius: 2px; margin-bottom: 10px;">
                            <div style="height: 100%; width: 75%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #555; font-family: var(--font-mono); font-size: 9px;">
                            <span>DEPARTED: 10:15</span>
                            <span>75% COMPLETED</span>
                        </div>
                    </div>

                    <!-- TRANSFER 2: SNOW TRAVERSE (CONVOY) -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #F39C12; border-radius: 4px; padding: 25px; position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #F39C12; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TRANSFER ID: TRX-8042</div>
                                <div style="color: #fff; font-size: 18px; font-weight: bold;"><i class="fa-solid fa-truck" style="margin-right: 8px;"></i> Convoy Delta (4x PistenBullys)</div>
                            </div>
                            <div style="background: rgba(243, 156, 18, 0.1); color: #F39C12; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold; border: 1px solid rgba(243,156,18,0.4);">
                                EN ROUTE (SLOW)
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #000; padding: 15px; border-radius: 4px; border: 1px dashed #222;">
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">ORIGIN</div>
                                <div style="color: #fff; font-size: 12px;">Ice Shelf Depot</div>
                            </div>
                            <div style="color: #F39C12; font-size: 14px;"><i class="fa-solid fa-snowplow"></i></div>
                            <div style="flex: 1; border-top: 1px dashed #333; margin: 0 15px; position: relative;">
                                <div style="position: absolute; top: -10px; left: 40%; color: #F39C12; font-size: 16px;"><i class="fa-solid fa-truck"></i></div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">DESTINATION</div>
                                <div style="color: #fff; font-size: 12px;">Maitri Base</div>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">Payload: <span style="color:#fff;">Jet A-1 Fuel, Gen Spares (32 MT)</span></div>
                            <div style="color: #888; font-size: 11px;">Status: <span style="color:#FF003C;">Whiteout conditions (Speed: 8 km/h)</span></div>
                        </div>

                        <div style="height: 4px; background: #222; border-radius: 2px; margin-bottom: 10px;">
                            <div style="height: 100%; width: 40%; background: #F39C12; box-shadow: 0 0 10px #F39C12;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #555; font-family: var(--font-mono); font-size: 9px;">
                            <span>DIST: 85 KM TOTAL</span>
                            <span>40% COMPLETED</span>
                        </div>
                    </div>

                    <!-- TRANSFER 3: SHIP UNLOADING -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #00FF66; border-radius: 4px; padding: 25px; position: relative;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div>
                                <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TRANSFER ID: TRX-8043</div>
                                <div style="color: #fff; font-size: 18px; font-weight: bold;"><i class="fa-solid fa-crane" style="margin-right: 8px;"></i> Ice-Crane Cargo Lift</div>
                            </div>
                            <div style="background: rgba(0, 255, 102, 0.1); color: #00FF66; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold; border: 1px solid rgba(0, 255, 102, 0.4);">
                                ACTIVE OFF-LOAD
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #000; padding: 15px; border-radius: 4px; border: 1px dashed #222;">
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">ORIGIN</div>
                                <div style="color: #fff; font-size: 12px;">Ship Hold (Deck C)</div>
                            </div>
                            <div style="color: #00FF66; font-size: 14px;"><i class="fa-solid fa-boxes-packing"></i></div>
                            <div style="flex: 1; border-top: 1px dashed #333; margin: 0 15px; position: relative;">
                                <div style="position: absolute; top: -10px; left: 15%; color: #00FF66; font-size: 16px;"><i class="fa-solid fa-arrow-right"></i></div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">DESTINATION</div>
                                <div style="color: #fff; font-size: 12px;">Ice Shelf Depot</div>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">Payload: <span style="color:#fff;">General Provisions (Dry Food)</span></div>
                            <div style="color: #888; font-size: 11px;">Pace: <span style="color:#00FF66;">12 Containers / Hr</span></div>
                        </div>

                        <div style="height: 4px; background: #222; border-radius: 2px; margin-bottom: 10px;">
                            <div style="height: 100%; width: 15%; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #555; font-family: var(--font-mono); font-size: 9px;">
                            <span>SHIFT STARTED: 06:00</span>
                            <span>15% COMPLETED</span>
                        </div>
                    </div>

                </div>
            </div>
        `,

        '#forecast': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-cloud-bolt"></i> METEOROLOGY & OPERATIONAL IMPACT</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">WEATHER <span style="font-weight: 700; color: #00E5FF;">FORECAST</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #333; color: #888;"><i class="fa-solid fa-satellite"></i> REFRESH SATELLITE DATA</button>
                    </div>
                </div>

                <!-- TOP ROW: AI IMPACT & RADAR -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    
                    <!-- LEFT: AI LOGISTICS IMPACT (Crucial for SIH) -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 4px solid #FF003C; border-radius: 4px; padding: 25px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <i class="fa-solid fa-brain" style="color: #FF003C; font-size: 20px; animation: pulse 2s infinite;"></i>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 14px; font-weight: bold; letter-spacing: 1px;">AI LOGISTICS ADVISORY</div>
                        </div>
                        <p style="color: #fff; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                            Severe Katabatic wind storm forming over the Larsemann Hills (Bharati Region). Operational window will close in <span style="color: #FF003C; font-weight: bold;">04:30:00</span>.
                        </p>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="background: rgba(255, 0, 60, 0.1); border: 1px solid rgba(255, 0, 60, 0.3); padding: 10px; border-radius: 4px; display: flex; justify-content: space-between;">
                                <span style="color: #FF003C; font-family: var(--font-mono); font-size: 11px;"><i class="fa-solid fa-helicopter"></i> HELO OPS</span>
                                <span style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">GROUNDED (ETA: 4 HRS)</span>
                            </div>
                            <div style="background: rgba(243, 156, 18, 0.1); border: 1px solid rgba(243, 156, 18, 0.3); padding: 10px; border-radius: 4px; display: flex; justify-content: space-between;">
                                <span style="color: #F39C12; font-family: var(--font-mono); font-size: 11px;"><i class="fa-solid fa-truck"></i> ICE CONVOYS</span>
                                <span style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">RESTRICTED (WHITEOUT)</span>
                            </div>
                            <div style="background: rgba(0, 255, 102, 0.1); border: 1px solid rgba(0, 255, 102, 0.3); padding: 10px; border-radius: 4px; display: flex; justify-content: space-between;">
                                <span style="color: #00FF66; font-family: var(--font-mono); font-size: 11px;"><i class="fa-solid fa-ship"></i> SHIP UNLOADING</span>
                                <span style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">CLEARED (MAITRI SHELF)</span>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: RADAR VISUAL -->
                    <div style="background: #000; border: 1px solid #222; border-radius: 4px; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                        <!-- Radar grid lines -->
                        <div style="position: absolute; width: 100%; height: 100%; background: 
                            linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
                            background-size: 40px 40px; z-index: 0;">
                        </div>
                        
                        <!-- Radar Circles -->
                        <div style="width: 200px; height: 200px; border: 1px dashed rgba(0,229,255,0.2); border-radius: 50%; position: absolute; z-index: 1;"></div>
                        <div style="width: 100px; height: 100px; border: 1px solid rgba(0,229,255,0.4); border-radius: 50%; position: absolute; z-index: 1;"></div>
                        
                        <!-- Storm Mass -->
                        <div style="position: absolute; width: 150px; height: 100px; background: radial-gradient(circle, rgba(255,0,60,0.4) 0%, rgba(243,156,18,0.2) 50%, transparent 70%); top: 30%; left: 20%; z-index: 2; animation: drift 10s infinite alternate;"></div>
                        <div style="position: absolute; width: 80px; height: 80px; background: radial-gradient(circle, rgba(255,0,60,0.6) 0%, transparent 60%); top: 40%; left: 30%; z-index: 2; animation: drift 8s infinite alternate-reverse;"></div>

                        <!-- Scanner Line -->
                        <div style="position: absolute; width: 50%; height: 2px; background: #00E5FF; top: 50%; left: 50%; transform-origin: 0% 50%; animation: spin 4s linear infinite; box-shadow: 0 0 15px #00E5FF; z-index: 3;"></div>

                        <div style="position: absolute; bottom: 15px; left: 15px; z-index: 4; color: #00E5FF; font-family: var(--font-mono); font-size: 10px;">
                            DOPPLER: ACTIVE <br> REGION: LARSEMANN HILLS
                        </div>
                    </div>
                </div>

                <!-- BOTTOM ROW: STATION METRICS -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    
                    <!-- BHARATI STATION -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #FF003C; border-radius: 4px; padding: 25px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                            <div style="color: #fff; font-size: 18px; font-weight: bold;">BHARATI STATION</div>
                            <div style="background: rgba(255,0,60,0.1); color: #FF003C; border: 1px solid rgba(255,0,60,0.3); font-family: var(--font-mono); font-size: 10px; padding: 4px 8px; border-radius: 2px; animation: pulse 1s infinite;">BLIZZARD WARNING</div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TEMPERATURE</div>
                                <div style="color: #00E5FF; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">-32<span style="font-size:12px;">°C</span></div>
                            </div>
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center; border-color: rgba(255,0,60,0.4);">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">WIND SPEED</div>
                                <div style="color: #FF003C; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">68<span style="font-size:12px;"> KTS</span></div>
                            </div>
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center; border-color: rgba(255,0,60,0.4);">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">VISIBILITY</div>
                                <div style="color: #FF003C; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">&lt;10<span style="font-size:12px;"> M</span></div>
                            </div>
                        </div>

                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;">48-HOUR TREND</div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed #333; padding-top: 15px;">
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">TUE</div>
                                <i class="fa-solid fa-cloud-showers-heavy" style="color: #FF003C; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">65 Kts</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">WED</div>
                                <i class="fa-solid fa-snowflake" style="color: #00E5FF; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">35 Kts</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">THU</div>
                                <i class="fa-solid fa-sun" style="color: #F39C12; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">12 Kts</div>
                            </div>
                        </div>
                    </div>

                    <!-- MAITRI STATION -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-top: 3px solid #00FF66; border-radius: 4px; padding: 25px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                            <div style="color: #fff; font-size: 18px; font-weight: bold;">MAITRI STATION</div>
                            <div style="background: rgba(0,255,102,0.1); color: #00FF66; border: 1px solid rgba(0,255,102,0.3); font-family: var(--font-mono); font-size: 10px; padding: 4px 8px; border-radius: 2px;">CLEAR FOR OPS</div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TEMPERATURE</div>
                                <div style="color: #00E5FF; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">-18<span style="font-size:12px;">°C</span></div>
                            </div>
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">WIND SPEED</div>
                                <div style="color: #00FF66; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">14<span style="font-size:12px;"> KTS</span></div>
                            </div>
                            <div style="background: #000; border: 1px solid #1a1a1a; padding: 15px; border-radius: 4px; text-align: center;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">VISIBILITY</div>
                                <div style="color: #00FF66; font-size: 22px; font-family: var(--font-mono); font-weight: bold;">>5<span style="font-size:12px;"> KM</span></div>
                            </div>
                        </div>

                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;">48-HOUR TREND</div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px dashed #333; padding-top: 15px;">
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">TUE</div>
                                <i class="fa-solid fa-cloud" style="color: #aaa; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">18 Kts</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">WED</div>
                                <i class="fa-solid fa-snowflake" style="color: #00E5FF; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">22 Kts</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #fff; font-size: 12px; margin-bottom: 3px;">THU</div>
                                <i class="fa-solid fa-wind" style="color: #F39C12; font-size: 16px; margin-bottom: 3px;"></i>
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">40 Kts</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes drift { 0% { transform: translate(0, 0); } 100% { transform: translate(20px, -20px); } }
            </style>
        `,

        '#all-assets': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-truck"></i> HEAVY MACHINERY & FLEET COMMAND</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">ALL <span style="font-weight: 700; color: #00E5FF;">ASSETS</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #333; color: #888;"><i class="fa-solid fa-wrench"></i> MAINTENANCE LOGS</button>
                    </div>
                </div>

                <!-- FLEET KPI ROW -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; padding: 15px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">TOTAL FLEET SIZE</div>
                        <div style="color: #00E5FF; font-size: 22px; font-weight: bold;">32 <span style="font-size:12px; color:#aaa; font-weight: normal;">VEHICLES</span></div>
                    </div>
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00FF66; padding: 15px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">ACTIVE (DEPLOYED)</div>
                        <div style="color: #00FF66; font-size: 22px; font-weight: bold;">18 <span style="font-size:12px; color:#aaa; font-weight: normal;">ON-ICE</span></div>
                    </div>
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #F39C12; padding: 15px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">IN TRANSIT</div>
                        <div style="color: #F39C12; font-size: 22px; font-weight: bold;">09 <span style="font-size:12px; color:#aaa; font-weight: normal;">CONVOY</span></div>
                    </div>
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #FF003C; padding: 15px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">UNDER MAINTENANCE</div>
                        <div style="color: #FF003C; font-size: 22px; font-weight: bold;">05 <span style="font-size:12px; color:#aaa; font-weight: normal;">GARAGED</span></div>
                    </div>
                </div>

                <!-- ASSET GRID -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; padding-bottom: 30px;">
                    
                    <!-- ASSET 1: PISTENBULLY -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; overflow: hidden; position: relative;">
                        <!-- Schematic Header -->
                        <div style="background: rgba(0, 229, 255, 0.05); border-bottom: 1px solid #222; padding: 20px; position: relative; overflow: hidden;">
                            <!-- Blueprint grid -->
                            <div style="position: absolute; width: 100%; height: 100%; top:0; left:0; background: linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px); background-size: 20px 20px; z-index: 0; pointer-events: none;"></div>
                            
                            <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-snowplow"></i> PB-400-ALPHA</div>
                                    <div style="color: #fff; font-size: 16px; margin-top: 5px;">PistenBully 400 W Polar</div>
                                </div>
                                <div style="background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; color: #00FF66; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold;">
                                    ACTIVE TRAVERSE
                                </div>
                            </div>
                        </div>

                        <!-- Telemetry Body -->
                        <div style="padding: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">CURRENT LOCATION</div>
                                    <div style="color: #ddd; font-size: 12px;">Maitri Ice Shelf Route</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">OPERATOR</div>
                                    <div style="color: #ddd; font-size: 12px;">Sgt. Vikram Singh</div>
                                </div>
                            </div>

                            <!-- Gauges -->
                            <div style="background: #000; border: 1px solid #111; padding: 15px; border-radius: 4px; display: flex; flex-direction: column; gap: 12px;">
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">FUEL LEVEL (DIESEL)</span>
                                        <span style="color: #00E5FF;">82%</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 82%; background: #00E5FF; box-shadow: 0 0 5px #00E5FF;"></div></div>
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">ENGINE TEMP</span>
                                        <span style="color: #00FF66;">88°C (OPTIMAL)</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 45%; background: #00FF66;"></div></div>
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">TRACK INTEGRITY</span>
                                        <span style="color: #F39C12;">74% (CHECK REQ)</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 74%; background: #F39C12;"></div></div>
                                </div>
                            </div>

                            <button style="width: 100%; margin-top: 20px; background: transparent; border: 1px dashed #00E5FF; color: #00E5FF; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.1)'" onmouseout="this.style.background='transparent'">
                                VIEW FULL TELEMETRY
                            </button>
                        </div>
                    </div>

                    <!-- ASSET 2: HELICOPTER -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; overflow: hidden; position: relative;">
                        <!-- Schematic Header -->
                        <div style="background: rgba(243, 156, 18, 0.05); border-bottom: 1px solid #222; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; width: 100%; height: 100%; top:0; left:0; background: linear-gradient(rgba(243, 156, 18,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243, 156, 18,0.05) 1px, transparent 1px); background-size: 20px 20px; z-index: 0; pointer-events: none;"></div>
                            
                            <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="color: #F39C12; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-helicopter"></i> HELO-KA-01</div>
                                    <div style="color: #fff; font-size: 16px; margin-top: 5px;">Kamov Ka-32 (Sling Load)</div>
                                </div>
                                <div style="background: rgba(243, 156, 18, 0.1); border: 1px solid #F39C12; color: #F39C12; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold; animation: pulse 2s infinite;">
                                    AIRBORNE
                                </div>
                            </div>
                        </div>

                        <!-- Telemetry Body -->
                        <div style="padding: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">CURRENT LOCATION</div>
                                    <div style="color: #ddd; font-size: 12px;">Alt: 4,200 ft (En-route Bharati)</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">PILOT IN COMMAND</div>
                                    <div style="color: #ddd; font-size: 12px;">Cmdr. A. Verma (IAF)</div>
                                </div>
                            </div>

                            <!-- Gauges -->
                            <div style="background: #000; border: 1px solid #111; padding: 15px; border-radius: 4px; display: flex; flex-direction: column; gap: 12px;">
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">JET A-1 FUEL</span>
                                        <span style="color: #F39C12;">54%</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 54%; background: #F39C12; box-shadow: 0 0 5px #F39C12;"></div></div>
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">ROTOR RPM</span>
                                        <span style="color: #00FF66;">98% (STABLE)</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 98%; background: #00FF66;"></div></div>
                                </div>
                                <div>
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">
                                        <span style="color: #888;">SLING LOAD TENSION</span>
                                        <span style="color: #00E5FF;">4,200 KG (NOMINAL)</span>
                                    </div>
                                    <div style="height: 4px; background: #222; border-radius: 2px;"><div style="height: 100%; width: 85%; background: #00E5FF;"></div></div>
                                </div>
                            </div>

                            <button style="width: 100%; margin-top: 20px; background: transparent; border: 1px dashed #F39C12; color: #F39C12; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(243,156,18,0.1)'" onmouseout="this.style.background='transparent'">
                                VIEW FULL TELEMETRY
                            </button>
                        </div>
                    </div>

                    <!-- ASSET 3: DRILL RIG (MAINTENANCE) -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; overflow: hidden; position: relative; opacity: 0.8;">
                        <!-- Schematic Header -->
                        <div style="background: rgba(255, 0, 60, 0.05); border-bottom: 1px solid #222; padding: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; width: 100%; height: 100%; top:0; left:0; background: linear-gradient(rgba(255, 0, 60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60,0.05) 1px, transparent 1px); background-size: 20px 20px; z-index: 0; pointer-events: none;"></div>
                            
                            <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-screwdriver-wrench"></i> RIG-MK4-09</div>
                                    <div style="color: #fff; font-size: 16px; margin-top: 5px;">Ice-Core Drilling Rig Mk4</div>
                                </div>
                                <div style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 4px 8px; border-radius: 2px; font-size: 9px; font-family: var(--font-mono); font-weight: bold;">
                                    OFFLINE (REPAIR)
                                </div>
                            </div>
                        </div>

                        <!-- Telemetry Body -->
                        <div style="padding: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">CURRENT LOCATION</div>
                                    <div style="color: #ddd; font-size: 12px;">Bharati Base (Garage Bay 2)</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">CHIEF MECHANIC</div>
                                    <div style="color: #ddd; font-size: 12px;">M. Patil</div>
                                </div>
                            </div>

                            <!-- Maintenance Info -->
                            <div style="background: #000; border: 1px dashed #FF003C; padding: 15px; border-radius: 4px; display: flex; flex-direction: column; gap: 12px;">
                                <div style="color: #FF003C; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FAULT DETECTED</div>
                                <div style="color: #aaa; font-size: 11px;">Hydraulic pressure loss in main drill shaft seal. Requires replacement part (SKU: HYD-449).</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px; border-top: 1px solid #222; padding-top: 10px;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 9px;">ETA TO FIX</span>
                                    <span style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">Awaiting Parts (4 Days)</span>
                                </div>
                            </div>

                            <button style="width: 100%; margin-top: 20px; background: transparent; border: 1px dashed #555; color: #888; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                                OPEN SERVICE TICKET
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `,

        '#assignments': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-clipboard-user"></i> PERSONNEL DUTY ROSTER</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">MISSION <span style="font-weight: 700; color: #00E5FF;">ASSIGNMENTS</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF;"><i class="fa-solid fa-plus"></i> CREATE NEW DIRECTIVE</button>
                    </div>
                </div>

                <!-- METRICS ROW -->
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; padding: 15px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">ACTIVE SHIFT OPERATIONS</div>
                            <div style="color: #fff; font-size: 22px; font-weight: bold;">12 <span style="font-size:12px; color:#00E5FF; font-weight: normal;">ONGOING</span></div>
                        </div>
                        <i class="fa-solid fa-person-digging" style="color: rgba(0,229,255,0.2); font-size: 30px;"></i>
                    </div>
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #FF003C; padding: 15px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">CRITICAL PRIORITY</div>
                            <div style="color: #fff; font-size: 22px; font-weight: bold;">03 <span style="font-size:12px; color:#FF003C; font-weight: normal;">URGENT</span></div>
                        </div>
                        <i class="fa-solid fa-triangle-exclamation" style="color: rgba(255,0,60,0.2); font-size: 30px;"></i>
                    </div>
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #F39C12; padding: 15px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">PENDING CLEARANCE</div>
                            <div style="color: #fff; font-size: 22px; font-weight: bold;">08 <span style="font-size:12px; color:#F39C12; font-weight: normal;">DELAYED</span></div>
                        </div>
                        <i class="fa-solid fa-clock-rotate-left" style="color: rgba(243,156,18,0.2); font-size: 30px;"></i>
                    </div>
                </div>

                <!-- TACTICAL KANBAN BOARD -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; flex: 1;">
                    
                    <!-- COLUMN 1: PENDING -->
                    <div style="background: rgba(10,10,10,0.5); border: 1px solid #111; border-radius: 6px; display: flex; flex-direction: column;">
                        <div style="padding: 15px; border-bottom: 2px solid #333; display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #888; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-list-ul"></i> PENDING QUEUE</div>
                            <div style="background: #222; color: #888; padding: 2px 6px; border-radius: 10px; font-size: 10px;">8</div>
                        </div>
                        <div style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                            
                            <!-- Card: Pending -->
                            <div style="background: #0a0a0a; border: 1px solid #222; border-left: 3px solid #F39C12; border-radius: 4px; padding: 15px; cursor: grab; transition: 0.2s;" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#222'">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="background: rgba(243, 156, 18, 0.1); color: #F39C12; font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px; border: 1px solid rgba(243,156,18,0.3);">MAINTENANCE</span>
                                    <i class="fa-solid fa-ellipsis" style="color: #555;"></i>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 10px;">Solar Panel Array De-Icing</div>
                                <div style="color: #888; font-size: 11px; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;"><i class="fa-solid fa-location-dot"></i> Maitri Base (Sector 4 Roof)</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 20px; height: 20px; border-radius: 50%; background: #333; display: flex; justify-content: center; align-items: center; font-size: 9px; color: #aaa;">?</div>
                                        <span style="color: #666; font-family: var(--font-mono); font-size: 9px;">UNASSIGNED</span>
                                    </div>
                                    <div style="color: #F39C12; font-family: var(--font-mono); font-size: 9px;"><i class="fa-solid fa-clock"></i> DELAYED (WIND)</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- COLUMN 2: ACTIVE ON-ICE -->
                    <div style="background: rgba(0, 229, 255, 0.02); border: 1px solid #111; border-top: 2px solid #00E5FF; border-radius: 6px; display: flex; flex-direction: column; box-shadow: inset 0 0 50px rgba(0,229,255,0.01);">
                        <div style="padding: 15px; border-bottom: 1px solid rgba(0,229,255,0.2); display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-person-snowboarding"></i> ACTIVE OPERATIONS</div>
                            <div style="background: rgba(0,229,255,0.1); color: #00E5FF; border: 1px solid #00E5FF; padding: 2px 6px; border-radius: 10px; font-size: 10px; animation: pulse 2s infinite;">12</div>
                        </div>
                        <div style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                            
                            <!-- Card: Active Critical -->
                            <div style="background: #0a0a0a; border: 1px solid #222; border-left: 3px solid #FF003C; border-radius: 4px; padding: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="background: rgba(255, 0, 60, 0.1); color: #FF003C; font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px; border: 1px solid rgba(255,0,60,0.3); animation: pulse 1s infinite;">CRITICAL</span>
                                    <i class="fa-solid fa-ellipsis" style="color: #555;"></i>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 5px;">Main Generator #2 Thermal Anomaly</div>
                                <div style="color: #888; font-size: 11px; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;"><i class="fa-solid fa-location-dot"></i> Bharati Power Grid (Sub-level)</div>
                                
                                <!-- Progress -->
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #555; margin-bottom: 5px;">
                                        <span>DIAGNOSTICS & REPAIR</span>
                                        <span style="color: #FF003C;">45%</span>
                                    </div>
                                    <div style="height: 3px; background: #222; border-radius: 2px;">
                                        <div style="height: 100%; width: 45%; background: #FF003C; box-shadow: 0 0 5px #FF003C;"></div>
                                    </div>
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 20px; height: 20px; border-radius: 50%; background: #222; border: 1px solid #FF003C; display: flex; justify-content: center; align-items: center; font-size: 9px; color: #fff;">MP</div>
                                        <span style="color: #ccc; font-family: var(--font-mono); font-size: 9px;">Eng. M. Patil</span>
                                    </div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 9px;"><i class="fa-solid fa-stopwatch"></i> T+ 01:15:00</div>
                                </div>
                            </div>

                            <!-- Card: Active Scientific -->
                            <div style="background: #0a0a0a; border: 1px solid #222; border-left: 3px solid #00E5FF; border-radius: 4px; padding: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px; border: 1px solid rgba(0,229,255,0.3);">SCIENTIFIC</span>
                                    <i class="fa-solid fa-ellipsis" style="color: #555;"></i>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 5px;">Deep Ice-Core Sample Retrieval (Vostok Method)</div>
                                <div style="color: #888; font-size: 11px; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;"><i class="fa-solid fa-location-dot"></i> Larsemann Hills (69°24'S)</div>
                                
                                <!-- Progress -->
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #555; margin-bottom: 5px;">
                                        <span>DRILL DEPTH: 145m / 200m</span>
                                        <span style="color: #00E5FF;">72%</span>
                                    </div>
                                    <div style="height: 3px; background: #222; border-radius: 2px;">
                                        <div style="height: 100%; width: 72%; background: #00E5FF; box-shadow: 0 0 5px #00E5FF;"></div>
                                    </div>
                                </div>

                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="width: 20px; height: 20px; border-radius: 50%; background: #222; border: 1px solid #00E5FF; display: flex; justify-content: center; align-items: center; font-size: 9px; color: #fff;">AS</div>
                                        <span style="color: #ccc; font-family: var(--font-mono); font-size: 9px;">Dr. A. Sen + 3</span>
                                    </div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 9px;"><i class="fa-solid fa-stopwatch"></i> T+ 05:40:00</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- COLUMN 3: COMPLETED -->
                    <div style="background: rgba(10,10,10,0.5); border: 1px solid #111; border-radius: 6px; display: flex; flex-direction: column;">
                        <div style="padding: 15px; border-bottom: 2px solid #333; display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 12px; font-weight: bold;"><i class="fa-solid fa-check-double"></i> LOGGED & COMPLETED</div>
                            <div style="background: rgba(0,255,102,0.1); color: #00FF66; padding: 2px 6px; border-radius: 10px; font-size: 10px;">45</div>
                        </div>
                        <div style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                            
                            <!-- Card: Completed -->
                            <div style="background: #050505; border: 1px solid #1a1a1a; border-left: 3px solid #00FF66; border-radius: 4px; padding: 15px; opacity: 0.7;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="color: #00FF66; font-family: var(--font-mono); font-size: 9px; font-weight: bold;"><i class="fa-solid fa-check"></i> MISSION SUCCESS</span>
                                </div>
                                <div style="color: #aaa; font-size: 13px; font-weight: 500; margin-bottom: 10px; text-decoration: line-through;">Perimeter Fence Reinforcement</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <span style="color: #555; font-family: var(--font-mono); font-size: 9px;">Team Bravo</span>
                                    <span style="color: #555; font-family: var(--font-mono); font-size: 9px;">Logged: 08:30 IST</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        `,

        '#maintenance': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-wrench"></i> PREVENTATIVE MAINTENANCE & DIAGNOSTICS</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">FAULT <span style="font-weight: 700; color: #F39C12;">LOGS</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #FF003C; color: #FF003C; background: rgba(255,0,60,0.05);"><i class="fa-solid fa-triangle-exclamation"></i> REPORT NEW FAULT</button>
                    </div>
                </div>

                <!-- KPI METRICS -->
                <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00FF66; padding: 20px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">BASE INFRASTRUCTURE HEALTH</div>
                        <div style="color: #00FF66; font-size: 28px; font-weight: bold;">92<span style="font-size:16px;">%</span></div>
                    </div>
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #FF003C; padding: 20px; border-radius: 4px; box-shadow: 0 0 15px rgba(255,0,60,0.1);">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">CRITICAL FAULTS (OFFLINE)</div>
                        <div style="color: #FF003C; font-size: 28px; font-weight: bold;">02 <span style="font-size:12px; color:#FF003C; font-weight: normal; animation: pulse 2s infinite;">REQUIRES ACTION</span></div>
                    </div>
                    <div style="flex: 1; background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #F39C12; padding: 20px; border-radius: 4px;">
                        <div style="color: #555; font-size: 10px; font-family: var(--font-mono); margin-bottom: 5px;">UPCOMING ROUTINE MAINTENANCE</div>
                        <div style="color: #F39C12; font-size: 28px; font-weight: bold;">14 <span style="font-size:12px; color:#aaa; font-weight: normal;">TASKS THIS WEEK</span></div>
                    </div>
                </div>

                <!-- MAIN INTERFACE -->
                <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; flex: 1; padding-bottom: 30px;">
                    
                    <!-- LEFT: LIVE DIAGNOSTIC HUD -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- Diagnostic View -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                                <i class="fa-solid fa-microchip"></i> LIVE TELEMETRY: GENERATOR #2
                            </div>
                            
                            <!-- Isometric / Schematic Wireframe Container -->
                            <div style="flex: 1; border: 1px dashed #333; position: relative; display: flex; justify-content: center; align-items: center; background: radial-gradient(circle at center, #111 0%, #000 100%);">
                                
                                <!-- Core Machine Icon -->
                                <i class="fa-solid fa-car-battery" style="font-size: 120px; color: rgba(0, 229, 255, 0.1);"></i>
                                
                                <!-- Diagnostic Scanner Line -->
                                <div style="position: absolute; width: 100%; height: 2px; background: rgba(255,0,60,0.5); top: 0; animation: scanDown 3s linear infinite;"></div>

                                <!-- Fault Node (Red Pulse) -->
                                <div style="position: absolute; top: 60%; left: 55%; width: 20px; height: 20px;">
                                    <div style="width: 10px; height: 10px; background: #FF003C; border-radius: 50%; margin: 5px; position: relative; z-index: 2;"></div>
                                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #FF003C; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: 1;"></div>
                                </div>

                                <!-- Overlay Text -->
                                <div style="position: absolute; top: 58%; left: 65%; color: #FF003C; font-family: var(--font-mono); font-size: 9px; font-weight: bold; background: rgba(0,0,0,0.8); padding: 4px; border: 1px solid #FF003C;">
                                    THERMAL ANOMALY (+18°C)
                                </div>
                            </div>

                            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="background: #000; border: 1px solid #222; padding: 10px; text-align: center;">
                                    <div style="color: #666; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">OUTPUT</div>
                                    <div style="color: #F39C12; font-size: 14px; font-weight: bold;">420 kW</div>
                                </div>
                                <div style="background: rgba(255,0,60,0.05); border: 1px solid rgba(255,0,60,0.3); padding: 10px; text-align: center;">
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 9px; margin-bottom: 5px;">CORE TEMP</div>
                                    <div style="color: #FF003C; font-size: 14px; font-weight: bold;">104°C <i class="fa-solid fa-arrow-up"></i></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT: WORK ORDER QUEUE -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column;">
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px;">
                            <div style="color: #fff; font-size: 14px; font-weight: 500;">SERVICE TICKET QUEUE</div>
                            <div style="display: flex; gap: 10px;">
                                <span style="color: #555; font-family: var(--font-mono); font-size: 10px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.color='#00E5FF'" onmouseout="this.style.color='#555'">FILTER: CRITICAL</span>
                                <span style="color: #555; font-family: var(--font-mono); font-size: 10px;">|</span>
                                <span style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; cursor: pointer;">ALL TICKETS</span>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 15px; overflow-y: auto; flex: 1; padding-right: 10px;">
                            
                            <!-- Ticket 1: CRITICAL -->
                            <div style="background: #000; border: 1px solid #111; border-left: 4px solid #FF003C; border-radius: 4px; padding: 15px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#111'">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">TKT-8841: MAIN GENERATOR #2</div>
                                    <div style="background: rgba(255, 0, 60, 0.1); color: #FF003C; font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: 2px;">CRITICAL / OFFLINE</div>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 10px;">Thermal overload and coolant pressure drop.</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-location-dot"></i> Bharati Power Grid</div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-clock"></i> SLA: &lt; 2 HOURS</div>
                                </div>
                            </div>

                            <!-- Ticket 2: HIGH -->
                            <div style="background: #000; border: 1px solid #111; border-left: 4px solid #F39C12; border-radius: 4px; padding: 15px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#111'">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">TKT-8842: ICE-CORE DRILL RIG MK4</div>
                                    <div style="background: rgba(243, 156, 18, 0.1); color: #F39C12; font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: 2px;">AWAITING PARTS</div>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 10px;">Hydraulic seal failure on main shaft.</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-location-dot"></i> Bharati Garage Bay 2</div>
                                    <div style="color: #aaa; font-family: var(--font-mono); font-size: 10px;">Assigned: M. Patil</div>
                                </div>
                            </div>

                            <!-- Ticket 3: ROUTINE -->
                            <div style="background: #000; border: 1px solid #111; border-left: 4px solid #00E5FF; border-radius: 4px; padding: 15px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#111'">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">TKT-8843: MAIN HVAC SYSTEM</div>
                                    <div style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: 2px;">ROUTINE</div>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 10px;">Quarterly HEPA filter replacement and duct defrost.</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-location-dot"></i> Maitri Life Support Hub</div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px;">Due: Tomorrow</div>
                                </div>
                            </div>

                            <!-- Ticket 4: ROUTINE -->
                            <div style="background: #000; border: 1px solid #111; border-left: 4px solid #00FF66; border-radius: 4px; padding: 15px; cursor: pointer; transition: 0.2s; opacity: 0.7;" onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#111'">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">TKT-8840: KAMOV KA-32 (HELO-01)</div>
                                    <div style="background: rgba(0, 255, 102, 0.1); color: #00FF66; font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: 2px;">COMPLETED</div>
                                </div>
                                <div style="color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 10px; text-decoration: line-through;">Post-blizzard rotor blade de-icing and structural check.</div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #222; padding-top: 10px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px;"><i class="fa-solid fa-location-dot"></i> MV Vasiliy Helipad</div>
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px;">Closed by: Cmdr. A. Verma</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes scanDown {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
                @keyframes ping {
                    75%, 100% { transform: scale(2.5); opacity: 0; }
                }
            </style>
        `,

        '#intelligence': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-brain"></i> PREDICTIVE MODELING & SIMULATION</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">AI <span style="font-weight: 700; color: #00E5FF;">INTELLIGENCE</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF;" onclick="document.getElementById('ai-prompt').value='What if MV Vasiliy is delayed by 14 days due to heavy pack ice?';"><i class="fa-solid fa-bolt"></i> LOAD DEMO SCENARIO</button>
                    </div>
                </div>

                <!-- MAIN INTERACTIVE AREA -->
                <div style="display: flex; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: SIMULATOR INPUT -->
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
                        
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                            <div style="color: #fff; font-size: 16px; font-weight: bold; margin-bottom: 15px;"><i class="fa-solid fa-terminal" style="color:#00E5FF;"></i> WHAT-IF SCENARIO ENGINE</div>
                            <p style="color: #888; font-size: 12px; margin-bottom: 20px;">Enter a logistical disruption, weather event, or resource failure to simulate cascading impacts on Antarctic operations.</p>
                            
                            <textarea id="ai-prompt" style="width: 100%; height: 120px; background: #000; border: 1px solid #333; color: #00E5FF; padding: 15px; font-family: var(--font-mono); font-size: 13px; resize: none; margin-bottom: 15px; border-radius: 4px; box-sizing: border-box;" placeholder="Enter scenario here..."></textarea>
                            
                            <button style="width: 100%; background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 12px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0, 229, 255, 0.2)'" onmouseout="this.style.background='rgba(0, 229, 255, 0.1)'" onclick="window.runAISimulation()">
                                RUN SIMULATION
                            </button>
                        </div>

                        <!-- LIVE SYSTEM METRICS (Context for AI) -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; flex: 1;">
                            <div style="color: #666; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">CURRENT CONTEXT LOADED INTO MODEL</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">MAITRI RATIONS</div>
                                    <div style="color: #fff; font-size: 12px;">72 Days Left</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">BHARATI FUEL</div>
                                    <div style="color: #fff; font-size: 12px;">114 KL</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">SHIP DISTANCE</div>
                                    <div style="color: #fff; font-size: 12px;">4,200 NM</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">HELICOPTER OPS</div>
                                    <div style="color: #00FF66; font-size: 12px;">Active (Clear)</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT: AI OUTPUT RESULT -->
                    <div style="flex: 1.5; background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 20px;">
                            <div style="color: #fff; font-size: 16px; font-weight: bold;"><i class="fa-solid fa-microchip"></i> SIMULATION REPORT</div>
                            <div id="ai-status" style="color: #555; font-family: var(--font-mono); font-size: 10px;">STANDBY</div>
                        </div>

                        <!-- Thinking Animation (Hidden initially) -->
                        <div id="ai-thinking" style="display: none; flex-direction: column; justify-content: center; align-items: center; flex: 1; gap: 20px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; border: 3px solid rgba(0, 229, 255, 0.2); border-top-color: #00E5FF; animation: spin 1s linear infinite;"></div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; animation: blink 1.5s infinite;">CALCULATING CASCADING IMPACTS...</div>
                        </div>

                        <!-- Result Display (Hidden initially) -->
                        <div id="ai-result" style="display: none; flex-direction: column; gap: 20px; overflow-y: auto;">
                            <!-- Dynamically filled by JS -->
                        </div>

                        <!-- Empty State -->
                        <div id="ai-empty" style="display: flex; flex: 1; justify-content: center; align-items: center; color: #333; font-family: var(--font-mono); font-size: 12px; text-align: center;">
                            NO SCENARIO PROCESSED.<br>ENTER PARAMETERS AND RUN SIMULATION.
                        </div>

                    </div>
                </div>
            </div>

            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            </style>

            
        `,

        '#emergency': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505; transition: background 0.5s;" id="emergency-container">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(255, 0, 60, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px; font-weight: bold;"><i class="fa-solid fa-tower-broadcast"></i> COSPAS-SARSAT BEACON LINK</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">SEARCH & <span style="font-weight: 700; color: #FF003C;">RESCUE</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #555; color: #888;" onclick="window.resetSOS()"><i class="fa-solid fa-rotate-right"></i> RESET BEACON DEMO</button>
                    </div>
                </div>

                <!-- IDLE STATE: THE BIG BUTTON -->
                <div id="sos-idle-state" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 250px; height: 250px; border-radius: 50%; border: 4px dashed #FF003C; display: flex; justify-content: center; align-items: center; position: relative; animation: slowSpin 10s linear infinite;">
                        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 0 50px rgba(255,0,60,0.2);"></div>
                    </div>
                    <button id="sos-btn" style="position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, #FF003C 0%, #8a0020 100%); border: 5px solid #111; color: #fff; font-size: 32px; font-weight: 900; letter-spacing: 4px; box-shadow: 0 10px 30px rgba(255,0,60,0.5), inset 0 0 20px rgba(0,0,0,0.5); cursor: pointer; transition: 0.2s;" onclick="window.triggerSOSSequence()">
                        SOS
                    </button>
                    <div style="margin-top: 50px; color: #FF003C; font-family: var(--font-mono); font-size: 14px; letter-spacing: 2px;">
                        CLICK TO TRANSMIT DISTRESS SIGNAL
                    </div>
                    
                </div>

                <!-- ACTIVE STATE: EMERGENCY DASHBOARD (Hidden by default) -->
                <div id="sos-active-state" style="display: none; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: TRANSMISSION & COORDS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div style="background: rgba(255,0,60,0.1); border: 2px solid #FF003C; border-radius: 4px; padding: 25px; box-shadow: inset 0 0 50px rgba(255,0,60,0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="color: #fff; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0;"><i class="fa-solid fa-tower-broadcast" style="animation: ping 1s infinite;"></i> DISTRESS BEACON ACTIVE</h2>
                                <div style="background: #FF003C; color: #fff; font-family: var(--font-mono); font-size: 12px; padding: 4px 10px; font-weight: bold; border-radius: 20px; animation: blink 1s infinite;">TX LIVE</div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div style="background: #000; border: 1px solid #333; padding: 15px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">LATITUDE</div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px; font-weight: bold;">69° 24' 28" S</div>
                                </div>
                                <div style="background: #000; border: 1px solid #333; padding: 15px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">LONGITUDE</div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px; font-weight: bold;">76° 11' 14" E</div>
                                </div>
                            </div>

                            <div style="background: #000; border: 1px dashed #FF003C; padding: 15px; font-family: var(--font-mono); font-size: 12px; color: #00E5FF; height: 180px; overflow-y: auto;" id="sos-terminal">
                                <!-- Logs will appear here dynamically -->
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: RESPONDING ASSETS -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column;">
                        <h3 style="color: #888; font-family: var(--font-mono); font-size: 12px; letter-spacing: 1px; margin: 0 0 20px 0;">NEAREST ASSETS MOBILIZED</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; flex: 1;">
                            <!-- Asset 1 -->
                            <div style="border: 1px solid #F39C12; background: rgba(243,156,18,0.05); padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;" id="rescue-asset-1">
                                <div>
                                    <div style="color: #F39C12; font-family: var(--font-mono); font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-helicopter"></i> HELO-KA-01 (KAMOV)</div>
                                    <div style="color: #ccc; font-size: 11px;">Status: DIVERTED TO YOUR COORDS</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 3px;">ETA</div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">14 MIN</div>
                                </div>
                            </div>

                            <!-- Asset 2 -->
                            <div style="border: 1px solid #00E5FF; background: rgba(0,229,255,0.05); padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; opacity: 0.5;" id="rescue-asset-2">
                                <div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-snowplow"></i> BHARATI QRT SQUAD</div>
                                    <div style="color: #ccc; font-size: 11px;">Status: DEPLOYING</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 3px;">ETA</div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">45 MIN</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,0,60,0.1); border-left: 4px solid #FF003C; padding: 15px; margin-top: 20px;">
                            <div style="color: #FF003C; font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-info-circle"></i> INSTRUCTION</div>
                            <div style="color: #ddd; font-size: 11px; line-height: 1.5;">Remain at current coordinates. Activate personal strobe lights. Conserve thermal energy. Rescue assets are inbound.</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes slowSpin { 100% { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
                @keyframes strobeAlert {
                    0% { background-color: #050505; }
                    5% { background-color: rgba(255,0,60,0.15); }
                    10% { background-color: #050505; }
                }
                .sos-active-bg {
                    animation: strobeAlert 2s infinite !important;
                }
            </style>

            
        `,
        '#cargo-scan': `
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-camera"></i> OPTICAL & RFID INSPECTION</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">ASSET <span style="font-weight: 700; color: #00FF66;">SCANNER</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #333; color: #888;"><i class="fa-solid fa-list-check"></i> VIEW LOGS</button>
                    </div>
                </div>

                <!-- MAIN INTERFACE -->
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: THE SCANNER -->
                    <div style="display: flex; flex-direction: column; background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px;"><i class="fa-solid fa-wifi"></i> UPLINK ACTIVE</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">AES-256 ENCRYPTED</div>
                        </div>

                        <!-- Scanner Viewfinder -->
                        <div style="position: relative; flex: 1; background: #000; border: 1px solid #111; border-radius: 4px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,255,102,0.05);">
                            
                            <!-- Targeting Corners -->
                            <div style="position: absolute; top: 10%; left: 10%; width: 30px; height: 30px; border-top: 3px solid #00FF66; border-left: 3px solid #00FF66;"></div>
                            <div style="position: absolute; top: 10%; right: 10%; width: 30px; height: 30px; border-top: 3px solid #00FF66; border-right: 3px solid #00FF66;"></div>
                            <div style="position: absolute; bottom: 10%; left: 10%; width: 30px; height: 30px; border-bottom: 3px solid #00FF66; border-left: 3px solid #00FF66;"></div>
                            <div style="position: absolute; bottom: 10%; right: 10%; width: 30px; height: 30px; border-bottom: 3px solid #00FF66; border-right: 3px solid #00FF66;"></div>

                            <!-- Mock QR Code (Faded in background) -->
                            <i class="fa-solid fa-qrcode" style="font-size: 150px; color: rgba(0, 255, 102, 0.1);"></i>

                            <!-- Animated Laser -->
                            <div id="scanner-laser" style="position: absolute; top: 15%; left: 5%; width: 90%; height: 2px; background: #FF003C; box-shadow: 0 0 10px #FF003C; animation: scan 2s linear infinite;"></div>
                        </div>

                        <div style="margin-top: 25px; display: flex; gap: 15px;">
                            <button id="btn-mock-scan" style="flex: 1; background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; color: #00FF66; padding: 15px; font-family: var(--font-mono); font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.3s; border-radius: 4px;" onmouseover="this.style.background='rgba(0, 255, 102, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 102, 0.1)'">
                                <i class="fa-solid fa-barcode"></i> MOCK SCAN ASSET
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: DECODED DATA -->
                    <div style="display: flex; flex-direction: column;">
                        
                        <!-- Initial State (Waiting) -->
                        <div id="scan-waiting" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 1px dashed #333; border-radius: 4px; background: rgba(10,10,10,0.5);">
                            <i class="fa-solid fa-radar" style="font-size: 40px; color: #333; margin-bottom: 20px;"></i>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px;">WAITING FOR SIGNAL...</div>
                        </div>

                        <!-- Scanned Data State (Hidden initially) -->
                        <div id="scan-result" style="display: none; flex-direction: column; gap: 15px;">
                            
                            <!-- Success Header -->
                            <div style="background: rgba(0, 255, 102, 0.1); border-left: 4px solid #00FF66; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
                                <div>
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">ASSET VERIFIED <i class="fa-solid fa-circle-check"></i></div>
                                    <div style="color: #aaa; font-family: var(--font-mono); font-size: 10px; margin-top: 5px;">Cryptographic Signature Valid</div>
                                </div>
                                <div style="color: #00FF66; font-size: 30px;"><i class="fa-solid fa-shield-halved"></i></div>
                            </div>

                            <!-- Detailed Specs -->
                            <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px;">
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">ASSET ID</div>
                                        <div style="color: #fff; font-family: var(--font-mono); font-size: 20px;">RFID-M041-992</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TIMESTAMP</div>
                                        <div id="scan-timestamp" style="color: #00E5FF; font-family: var(--font-mono); font-size: 14px;">14:32:05 IST</div>
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">DESCRIPTION</div>
                                        <div style="color: #fff; font-size: 14px; font-weight: 500;">O-Negative Blood Plasma</div>
                                        <div style="color: #888; font-size: 11px; margin-top: 3px;">Cold-Chain Box (Type 4)</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">DESTINATION</div>
                                        <div style="color: #00E5FF; font-size: 14px; font-weight: 500;">Bharati Sickbay (Sec 4)</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">WEIGHT</div>
                                        <div style="color: #ddd; font-family: var(--font-mono); font-size: 14px;">45.2 KG</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TEMPERATURE STATE</div>
                                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 14px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-snowflake"></i> -20.5°C</div>
                                    </div>
                                </div>

                                <!-- Tamper Hash -->
                                <div style="background: #000; border: 1px solid #111; padding: 15px; border-radius: 4px;">
                                    <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">CHAIN OF CUSTODY HASH (SHA-256)</div>
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; word-break: break-all;">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div style="display: flex; gap: 15px;">
                                <button style="flex: 1; background: rgba(0,229,255,0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 15px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.2)'" onmouseout="this.style.background='rgba(0,229,255,0.1)'">
                                    <i class="fa-solid fa-arrow-right-arrow-left"></i> LOG TRANSFER
                                </button>
                                <button style="background: transparent; border: 1px solid #FF003C; color: #FF003C; padding: 15px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                                    <i class="fa-solid fa-triangle-exclamation"></i> FLAG ANOMALY
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes scan {
                    0% { top: 15%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 85%; opacity: 0; }
                }
            </style>
            
            <script>
                // We will attach an event listener globally for this button in global-ui.js or planner.js
                // But for a quick hackathon prototype, if it's rendered, this works:
            </script>
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

// Inject Scanner Logic
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'btn-mock-scan' || e.target.closest('#btn-mock-scan')) {
        const btn = document.getElementById('btn-mock-scan');
        const waiting = document.getElementById('scan-waiting');
        const result = document.getElementById('scan-result');
        const timestamp = document.getElementById('scan-timestamp');
        const laser = document.getElementById('scanner-laser');
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SCANNING...';
        btn.style.borderColor = '#FF003C';
        btn.style.color = '#FF003C';
        laser.style.background = '#00FF66';
        laser.style.boxShadow = '0 0 10px #00FF66';
        
        setTimeout(() => {
            waiting.style.display = 'none';
            result.style.display = 'flex';
            timestamp.innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
            
            btn.innerHTML = '<i class="fa-solid fa-barcode"></i> MOCK SCAN ASSET';
            btn.style.borderColor = '#00FF66';
            btn.style.color = '#00FF66';
            laser.style.background = '#FF003C';
            laser.style.boxShadow = '0 0 10px #FF003C';
        }, 1500);
    }
});


// --- INJECTED MODULE LOGIC ---

window.sosAudioCtx = null;
window.sosOscillator = null;

function playSiren() {
    if (!window.sosAudioCtx) {
        window.sosAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.sosOscillator) {
        window.sosOscillator.stop();
    }
    window.sosOscillator = window.sosAudioCtx.createOscillator();
    const gainNode = window.sosAudioCtx.createGain();
    
    window.sosOscillator.type = 'square';
    window.sosOscillator.frequency.setValueAtTime(400, window.sosAudioCtx.currentTime);
    
    // Siren frequency modulation
    let time = window.sosAudioCtx.currentTime;
    for (let i = 0; i < 20; i++) {
        window.sosOscillator.frequency.linearRampToValueAtTime(800, time + 0.5);
        time += 0.5;
        window.sosOscillator.frequency.linearRampToValueAtTime(400, time + 0.5);
        time += 0.5;
    }
    
    gainNode.gain.setValueAtTime(0.1, window.sosAudioCtx.currentTime);
    
    window.sosOscillator.connect(gainNode);
    gainNode.connect(window.sosAudioCtx.destination);
    window.sosOscillator.start();
}

function stopSiren() {
    if (window.sosOscillator) {
        window.sosOscillator.stop();
        window.sosOscillator = null;
    }
}

window.sosHoldTimer = null;
                window.sosHoldProgress = 0;
                window.sosInterval = null;

                window.startSOSHold = function() {
                    const btn = document.getElementById('sos-btn');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(!btn || !progContainer || !progBar) return;
                    btn.style.transform = 'scale(0.95)';
                    btn.style.boxShadow = '0 0 50px rgba(255,0,60,0.8), inset 0 0 30px rgba(0,0,0,0.8)';
                    progContainer.style.display = 'block';
                    window.sosHoldProgress = 0;
                    window.sosHoldTimer = setInterval(() => {
                        window.sosHoldProgress += 2;
                        progBar.style.width = window.sosHoldProgress + '%';
                        if (window.sosHoldProgress >= 100) {
                            clearInterval(window.sosHoldTimer);
                            window.triggerSOSSequence();
                        }
                    }, 40);
                };

                window.cancelSOSHold = function() {
                    if(window.sosHoldTimer) clearInterval(window.sosHoldTimer);
                    const btn = document.getElementById('sos-btn');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(btn) {
                        btn.style.transform = 'scale(1)';
                        btn.style.boxShadow = '0 10px 30px rgba(255,0,60,0.5), inset 0 0 20px rgba(0,0,0,0.5)';
                    }
                    if(progContainer) progContainer.style.display = 'none';
                    if(progBar) progBar.style.width = '0%';
                };

                window.triggerSOSSequence = function() {
    playSiren();
                    const idle = document.getElementById('sos-idle-state');
                    const active = document.getElementById('sos-active-state');
                    const container = document.getElementById('emergency-container');
                    const term = document.getElementById('sos-terminal');

                    if(idle) idle.style.display = 'none';
                    if(active) active.style.display = 'grid';
                    if(container) container.classList.add('sos-active-bg');

                    if(term) {
                        term.innerHTML = '';
                        const lines = [
                            "> INITIALIZING COSPAS-SARSAT PROTOCOL...",
                            "> ACQUIRING GPS LOCK...",
                            "> LOCK ACQUIRED: 69° 24' 28'' S / 76° 11' 14'' E",
                            "> ENCRYPTING DISTRESS PACKET...",
                            "> TRANSMITTING BEACON BURST 1...",
                            "<span style='color:#00FF66;'>> NCPOR HQ (GOA) ACKNOWLEDGED RECEIPT.</span>",
                            "> BROADCASTING TO LOCAL ASSETS...",
                            "<span style='color:#F39C12;'>> KAMOV HELICOPTER DIVERTED. ETA: 14m.</span>",
                            "> ESTABLISHING CONTINUOUS TELEMETRY LOOP..."
                        ];

                        let i = 0;
                        window.sosInterval = setInterval(() => {
                            if (i < lines.length) {
                                term.innerHTML += '<div>' + lines[i] + '</div>';
                                term.scrollTop = term.scrollHeight;
                                i++;
                            } else {
                                clearInterval(window.sosInterval);
                                setInterval(() => {
                                    if(document.getElementById('sos-terminal')){
                                        document.getElementById('sos-terminal').innerHTML += '<div>> TX PING ' + Date.now() + ' (OK)</div>';
                                        document.getElementById('sos-terminal').scrollTop = document.getElementById('sos-terminal').scrollHeight;
                                    }
                                }, 2000);
                            }
                        }, 600);
                    }
                };

                window.resetSOS = function() {
    stopSiren();
                    const idle = document.getElementById('sos-idle-state');
                    const active = document.getElementById('sos-active-state');
                    const container = document.getElementById('emergency-container');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(idle) idle.style.display = 'flex';
                    if(active) active.style.display = 'none';
                    if(container) container.classList.remove('sos-active-bg');
                    if(progContainer) progContainer.style.display = 'none';
                    if(progBar) progBar.style.width = '0%';
                    if(window.sosHoldTimer) clearInterval(window.sosHoldTimer);
                    if(window.sosInterval) clearInterval(window.sosInterval);
                    let highestTimeoutId = setTimeout(";");
                    for (let i = 0 ; i < highestTimeoutId ; i++) {
                        clearTimeout(i); 
                    }
                };
window.runAISimulation = function() {
                    const promptVal = document.getElementById('ai-prompt').value;
                    if(!promptVal || promptVal.trim() === '') return;

                    document.getElementById('ai-empty').style.display = 'none';
                    document.getElementById('ai-result').style.display = 'none';
                    document.getElementById('ai-thinking').style.display = 'flex';
                    document.getElementById('ai-status').innerText = 'PROCESSING MODEL...';
                    document.getElementById('ai-status').style.color = '#00E5FF';

                    setTimeout(() => {
                        document.getElementById('ai-thinking').style.display = 'none';
                        document.getElementById('ai-result').style.display = 'flex';
                        document.getElementById('ai-status').innerText = 'SIMULATION COMPLETE';
                        document.getElementById('ai-status').style.color = '#00FF66';

                        // NO TEMPLATE LITERALS HERE. USING STRING CONCATENATION.
                        const resultHTML = "" +
                            "<div style='background: rgba(255, 0, 60, 0.1); border-left: 3px solid #FF003C; padding: 15px;'>" +
                                "<div style='color: #FF003C; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;'>CRITICAL IMPACT DETECTED</div>" +
                                "<div style='color: #fff; font-size: 13px; line-height: 1.5;'>If MV Vasiliy is delayed by 14 days, Maitri Station will deplete its <span style='color:#FF003C; font-weight:bold;'>Aviation Turbine Fuel (ATF)</span> reserve on Day 11, halting all inland helicopter operations.</div>" +
                            "</div>" +
                            "<div>" +
                                "<div style='color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;'>CASCADING TIMELINE</div>" +
                                "<div style='border-left: 1px dashed #333; margin-left: 5px; padding-left: 15px; display: flex; flex-direction: column; gap: 15px;'>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #F39C12; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#F39C12; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 5</span> Ration rationing initiated at Maitri (2 meals/day).</div>" +
                                    "</div>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 11</span> Helicopter grounded. Inland resupply impossible.</div>" +
                                    "</div>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 14</span> Generator 3 shuts down to conserve remaining polar diesel.</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div style='background: rgba(0, 255, 102, 0.05); border: 1px solid #00FF66; padding: 15px; border-radius: 4px; margin-top: 10px;'>" +
                                "<div style='color: #00FF66; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;'><i class='fa-solid fa-check'></i> AI RECOMMENDATION</div>" +
                                "<div style='color: #fff; font-size: 13px; line-height: 1.5;'>Immediate Action: Airdrop 20 barrels of ATF to Maitri via Kamov sling-load before Day 4 to bridge the 14-day gap. Dispatch PistenBully convoy to Ice-Shelf depot to pre-position rations.</div>" +
                                "<button style='margin-top: 15px; background: #00FF66; color: #000; border: none; padding: 8px 15px; font-family: var(--font-mono); font-size: 10px; font-weight: bold; cursor: pointer;'>" +
                                    "EXECUTE MITIGATION PLAN" +
                                "</button>" +
                            "</div>";
                        
                        document.getElementById('ai-result').innerHTML = resultHTML;
                    }, 2500);
                };


window.syncOfflineInterval = null;
window.syncPendingCount = 0;

window.severUplink = function() {
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    
    if(!radar) return; // not on view

    radar.style.borderColor = '#FF003C';
    radar.style.animation = 'none';
    icon.style.color = '#FF003C';
    icon.style.textShadow = '0 0 20px rgba(255,0,60,0.8)';
    icon.className = 'fa-solid fa-triangle-exclamation';
    
    statusText.innerText = 'AIRGAPPED (LOCAL)';
    statusText.style.color = '#FF003C';
    bandwidth.innerText = 'Bandwidth: 0 kbps (Connection Lost)';
    
    terminal.innerHTML += '<div style="color:#FF003C; margin-top:10px;">[NETWORK] VSAT Link Severed. Switching to local IndexedDB.</div>';
    
    // Also trigger the top widget for consistency
    window.isOffline = true;
    const mainBadge = document.getElementById('sat-badge-main');
    if(mainBadge) {
        mainBadge.style.background = 'rgba(255, 0, 60, 0.05)';
        mainBadge.style.borderColor = 'rgba(255, 0, 60, 0.3)';
        mainBadge.style.color = '#FF003C';
        document.getElementById('sat-status-text').innerText = 'AIRGAPPED';
        document.getElementById('sat-icon').className = 'fa-solid fa-triangle-exclamation';
        document.getElementById('sat-icon').style.animation = 'none';
    }

    // Start generating fake offline data mutations
    if(window.syncOfflineInterval) clearInterval(window.syncOfflineInterval);
    
    const fakeEvents = [
        "Updated Inventory: Maitri Station Rations (-15kg)",
        "Cargo Scanned: Medical Kit MK-4 (Chain of Custody logged)",
        "Personnel Movement: Dr. Sharma boarded TRV-04",
        "Maintenance Logged: Generator 3 Oil Pressure Check",
        "Asset Assignment: PistenBully PB-02 to Ice Shelf Depot"
    ];
    
    window.syncOfflineInterval = setInterval(() => {
        window.syncPendingCount++;
        document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
        document.getElementById('sync-queue-count').style.borderColor = '#FF003C';
        document.getElementById('sync-queue-count').style.color = '#FF003C';
        
        const ev = fakeEvents[Math.floor(Math.random() * fakeEvents.length)];
        terminal.innerHTML += '<div style="color:#ccc; margin-top:5px;">> [CACHE] ' + ev + '</div>';
        terminal.scrollTop = terminal.scrollHeight;
    }, 1500);
};

window.restoreUplink = function() {
    if(!window.syncOfflineInterval && window.syncPendingCount === 0) {
        if(window.GlobalUI) window.GlobalUI.showToast('Already synced.', 'info');
        return;
    }
    
    clearInterval(window.syncOfflineInterval);
    window.syncOfflineInterval = null;
    
    const radar = document.getElementById('sync-radar-ring');
    const icon = document.getElementById('sync-sat-icon');
    const statusText = document.getElementById('sync-status-main');
    const bandwidth = document.getElementById('sync-bandwidth');
    const terminal = document.getElementById('sync-terminal');
    const progBar = document.getElementById('sync-progress-bar');
    
    if(!radar) return;
    
    radar.style.borderColor = '#00FF66';
    radar.style.animation = 'slowSpin 10s linear infinite';
    icon.style.color = '#00FF66';
    icon.style.textShadow = '0 0 20px rgba(0,255,102,0.8)';
    icon.className = 'fa-solid fa-satellite-dish';
    
    statusText.innerText = 'SYNC IN PROGRESS...';
    statusText.style.color = '#00E5FF';
    bandwidth.innerText = 'Bandwidth: 256 kbps (Restored)';
    
    terminal.innerHTML += '<div style="color:#00E5FF; margin-top:10px;">[NETWORK] VSAT Restored. Initiating Bulk Sync (' + window.syncPendingCount + ' records)...</div>';
    terminal.scrollTop = terminal.scrollHeight;
    
    let p = 0;
    let upInterval = setInterval(() => {
        p += 10;
        progBar.style.width = p + '%';
        
        if(window.syncPendingCount > 0) {
            window.syncPendingCount--;
            document.getElementById('sync-queue-count').innerText = window.syncPendingCount + ' PENDING';
            terminal.innerHTML += '<div style="color:#00FF66;">> Uploading record... OK</div>';
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        if(p >= 100) {
            clearInterval(upInterval);
            statusText.innerText = 'CONNECTION ACTIVE';
            statusText.style.color = '#00FF66';
            document.getElementById('sync-queue-count').innerText = '0 PENDING';
            document.getElementById('sync-queue-count').style.borderColor = '#333';
            document.getElementById('sync-queue-count').style.color = '#fff';
            terminal.innerHTML += '<div style="color:#00FF66; margin-top:10px;">[SYSTEM] Sync Complete. Ledger aligned with NCPOR DB.</div>';
            terminal.scrollTop = terminal.scrollHeight;
            
            setTimeout(() => {
                progBar.style.width = '0%';
            }, 1000);
            
            // Fix top widget
            window.isOffline = false;
            const mainBadge = document.getElementById('sat-badge-main');
            if(mainBadge) {
                mainBadge.style.background = 'rgba(0, 255, 102, 0.05)';
                mainBadge.style.borderColor = 'rgba(0, 255, 102, 0.3)';
                mainBadge.style.color = '#00FF66';
                document.getElementById('sat-status-text').innerText = 'SAT-LINK: ACTIVE';
                document.getElementById('sat-icon').className = 'fa-solid fa-satellite-dish';
                document.getElementById('sat-icon').style.animation = 'pulse 2s infinite';
            }
        }
    }, 200);
};
