const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#cargo-dashboard': `")) {
    console.log("Cargo Dashboard already exists.");
    process.exit(0);
}

const cargoHTML = `
        '#cargo-dashboard': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + cargoHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Cargo dashboard injected successfully!");
} else {
    console.log("Could not find anchor to inject cargo dashboard.");
}
