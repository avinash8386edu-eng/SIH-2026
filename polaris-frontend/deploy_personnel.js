const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#personnel': `")) {
    console.log("Personnel already exists.");
    process.exit(0);
}

const personnelHTML = `
        '#personnel': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#planner': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + personnelHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Personnel module injected successfully!");
} else {
    console.log("Could not find anchor to inject personnel.");
}
