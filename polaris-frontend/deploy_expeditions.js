const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#all-expeditions': `")) {
    console.log("All Expeditions already exists.");
    process.exit(0);
}

const expeditionsHTML = `
        '#all-expeditions': \`
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

                        <button style="width: 100%; background: transparent; border: 1px dashed #00E5FF; color: #00E5FF; padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; letter-spacing: 1px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.1)'" onmouseout="this.style.background='transparent'">ACCESS COMMAND HUB <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i></button>
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
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + expeditionsHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Expeditions module injected successfully!");
} else {
    console.log("Could not find anchor to inject expeditions.");
}
