const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#medical': `")) {
    console.log("Medical already exists.");
    process.exit(0);
}

const medicalHTML = `
        '#medical': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + medicalHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Medical module injected successfully!");
} else {
    console.log("Could not find anchor to inject medical.");
}
