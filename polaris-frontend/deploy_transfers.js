const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#transfers': `")) {
    console.log("Transfers already exists.");
    process.exit(0);
}

const transfersHTML = `
        '#transfers': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#intelligence': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + transfersHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Transfers module injected successfully!");
} else {
    console.log("Could not find anchor to inject transfers.");
}
