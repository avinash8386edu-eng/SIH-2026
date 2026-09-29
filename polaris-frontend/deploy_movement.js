const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#movement': `")) {
    console.log("Movement already exists.");
    process.exit(0);
}

const movementHTML = `
        '#movement': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + movementHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Movement module injected successfully!");
} else {
    console.log("Could not find anchor to inject movement.");
}
