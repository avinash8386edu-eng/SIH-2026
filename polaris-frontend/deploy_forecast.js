const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#forecast': `")) {
    console.log("Forecast already exists.");
    process.exit(0);
}

const forecastHTML = `
        '#forecast': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#intelligence': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + forecastHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Forecast module injected successfully!");
} else {
    console.log("Could not find anchor to inject forecast.");
}
