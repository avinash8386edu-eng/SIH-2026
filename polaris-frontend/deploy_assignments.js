const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#assignments': `")) {
    console.log("Assignments already exists.");
    process.exit(0);
}

const assignmentsHTML = `
        '#assignments': \`
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
        \`,
`;

const insertIndex = appJS.indexOf("'#intelligence': `");

if (insertIndex !== -1) {
    const pre = appJS.substring(0, insertIndex);
    const post = appJS.substring(insertIndex);
    appJS = pre + assignmentsHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Assignments module injected successfully!");
} else {
    console.log("Could not find anchor to inject assignments.");
}
