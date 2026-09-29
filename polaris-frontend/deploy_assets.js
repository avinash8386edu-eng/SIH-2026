const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#all-assets': `")) {
    console.log("All Assets already exists.");
    process.exit(0);
}

const assetsHTML = `
        '#all-assets': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#intelligence': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + assetsHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("All Assets module injected successfully!");
} else {
    console.log("Could not find anchor to inject assets.");
}
