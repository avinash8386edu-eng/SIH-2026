const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#maintenance': `")) {
    console.log("Maintenance already exists.");
    process.exit(0);
}

const maintenanceHTML = `
        '#maintenance': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#intelligence': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + maintenanceHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Maintenance module injected successfully!");
} else {
    console.log("Could not find anchor to inject maintenance.");
}
