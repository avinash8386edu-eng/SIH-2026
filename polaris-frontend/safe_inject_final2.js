const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

const emergencyHTML = `
        '#emergency': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505; transition: background 0.5s;" id="emergency-container">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(255, 0, 60, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px; font-weight: bold;"><i class="fa-solid fa-tower-broadcast"></i> COSPAS-SARSAT BEACON LINK</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">SEARCH & <span style="font-weight: 700; color: #FF003C;">RESCUE</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #555; color: #888;" onclick="window.resetSOS()"><i class="fa-solid fa-rotate-right"></i> RESET BEACON DEMO</button>
                    </div>
                </div>

                <!-- IDLE STATE: THE BIG BUTTON -->
                <div id="sos-idle-state" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                    <div style="width: 250px; height: 250px; border-radius: 50%; border: 4px dashed #FF003C; display: flex; justify-content: center; align-items: center; position: relative; animation: slowSpin 10s linear infinite;">
                        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 0 50px rgba(255,0,60,0.2);"></div>
                    </div>
                    <button id="sos-btn" style="position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, #FF003C 0%, #8a0020 100%); border: 5px solid #111; color: #fff; font-size: 32px; font-weight: 900; letter-spacing: 4px; box-shadow: 0 10px 30px rgba(255,0,60,0.5), inset 0 0 20px rgba(0,0,0,0.5); cursor: pointer; transition: 0.2s;" onmousedown="window.startSOSHold()" onmouseup="window.cancelSOSHold()" onmouseleave="window.cancelSOSHold()">
                        SOS
                    </button>
                    <div style="margin-top: 50px; color: #FF003C; font-family: var(--font-mono); font-size: 14px; letter-spacing: 2px;">
                        CLICK AND HOLD FOR 3 SECONDS TO TRANSMIT DISTRESS
                    </div>
                    <div id="sos-progress-container" style="margin-top: 20px; width: 300px; height: 10px; background: #222; border-radius: 5px; overflow: hidden; display: none;">
                        <div id="sos-progress-bar" style="height: 100%; width: 0%; background: #FF003C;"></div>
                    </div>
                </div>

                <!-- ACTIVE STATE: EMERGENCY DASHBOARD (Hidden by default) -->
                <div id="sos-active-state" style="display: none; grid-template-columns: 1fr 1fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: TRANSMISSION & COORDS -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div style="background: rgba(255,0,60,0.1); border: 2px solid #FF003C; border-radius: 4px; padding: 25px; box-shadow: inset 0 0 50px rgba(255,0,60,0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="color: #fff; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0;"><i class="fa-solid fa-tower-broadcast" style="animation: ping 1s infinite;"></i> DISTRESS BEACON ACTIVE</h2>
                                <div style="background: #FF003C; color: #fff; font-family: var(--font-mono); font-size: 12px; padding: 4px 10px; font-weight: bold; border-radius: 20px; animation: blink 1s infinite;">TX LIVE</div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                                <div style="background: #000; border: 1px solid #333; padding: 15px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">LATITUDE</div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px; font-weight: bold;">69° 24' 28" S</div>
                                </div>
                                <div style="background: #000; border: 1px solid #333; padding: 15px;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">LONGITUDE</div>
                                    <div style="color: #FF003C; font-family: var(--font-mono); font-size: 18px; font-weight: bold;">76° 11' 14" E</div>
                                </div>
                            </div>

                            <div style="background: #000; border: 1px dashed #FF003C; padding: 15px; font-family: var(--font-mono); font-size: 12px; color: #00E5FF; height: 180px; overflow-y: auto;" id="sos-terminal">
                                <!-- Logs will appear here dynamically -->
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: RESPONDING ASSETS -->
                    <div style="background: #0a0a0a; border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column;">
                        <h3 style="color: #888; font-family: var(--font-mono); font-size: 12px; letter-spacing: 1px; margin: 0 0 20px 0;">NEAREST ASSETS MOBILIZED</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px; flex: 1;">
                            <!-- Asset 1 -->
                            <div style="border: 1px solid #F39C12; background: rgba(243,156,18,0.05); padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;" id="rescue-asset-1">
                                <div>
                                    <div style="color: #F39C12; font-family: var(--font-mono); font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-helicopter"></i> HELO-KA-01 (KAMOV)</div>
                                    <div style="color: #ccc; font-size: 11px;">Status: DIVERTED TO YOUR COORDS</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 3px;">ETA</div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">14 MIN</div>
                                </div>
                            </div>

                            <!-- Asset 2 -->
                            <div style="border: 1px solid #00E5FF; background: rgba(0,229,255,0.05); padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; opacity: 0.5;" id="rescue-asset-2">
                                <div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-snowplow"></i> BHARATI QRT SQUAD</div>
                                    <div style="color: #ccc; font-size: 11px;">Status: DEPLOYING</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 3px;">ETA</div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">45 MIN</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(255,0,60,0.1); border-left: 4px solid #FF003C; padding: 15px; margin-top: 20px;">
                            <div style="color: #FF003C; font-size: 12px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-info-circle"></i> INSTRUCTION</div>
                            <div style="color: #ddd; font-size: 11px; line-height: 1.5;">Remain at current coordinates. Activate personal strobe lights. Conserve thermal energy. Rescue assets are inbound.</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes slowSpin { 100% { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
                @keyframes strobeAlert {
                    0% { background-color: #050505; }
                    5% { background-color: rgba(255,0,60,0.15); }
                    10% { background-color: #050505; }
                }
                .sos-active-bg {
                    animation: strobeAlert 2s infinite !important;
                }
            </style>

            <script>
                window.sosHoldTimer = null;
                window.sosHoldProgress = 0;
                window.sosInterval = null;

                window.startSOSHold = function() {
                    const btn = document.getElementById('sos-btn');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(!btn || !progContainer || !progBar) return;
                    btn.style.transform = 'scale(0.95)';
                    btn.style.boxShadow = '0 0 50px rgba(255,0,60,0.8), inset 0 0 30px rgba(0,0,0,0.8)';
                    progContainer.style.display = 'block';
                    window.sosHoldProgress = 0;
                    window.sosHoldTimer = setInterval(() => {
                        window.sosHoldProgress += 2;
                        progBar.style.width = window.sosHoldProgress + '%';
                        if (window.sosHoldProgress >= 100) {
                            clearInterval(window.sosHoldTimer);
                            window.triggerSOSSequence();
                        }
                    }, 40);
                };

                window.cancelSOSHold = function() {
                    if(window.sosHoldTimer) clearInterval(window.sosHoldTimer);
                    const btn = document.getElementById('sos-btn');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(btn) {
                        btn.style.transform = 'scale(1)';
                        btn.style.boxShadow = '0 10px 30px rgba(255,0,60,0.5), inset 0 0 20px rgba(0,0,0,0.5)';
                    }
                    if(progContainer) progContainer.style.display = 'none';
                    if(progBar) progBar.style.width = '0%';
                };

                window.triggerSOSSequence = function() {
                    const idle = document.getElementById('sos-idle-state');
                    const active = document.getElementById('sos-active-state');
                    const container = document.getElementById('emergency-container');
                    const term = document.getElementById('sos-terminal');

                    if(idle) idle.style.display = 'none';
                    if(active) active.style.display = 'grid';
                    if(container) container.classList.add('sos-active-bg');

                    if(term) {
                        term.innerHTML = '';
                        const lines = [
                            "> INITIALIZING COSPAS-SARSAT PROTOCOL...",
                            "> ACQUIRING GPS LOCK...",
                            "> LOCK ACQUIRED: 69° 24' 28'' S / 76° 11' 14'' E",
                            "> ENCRYPTING DISTRESS PACKET...",
                            "> TRANSMITTING BEACON BURST 1...",
                            "<span style='color:#00FF66;'>> NCPOR HQ (GOA) ACKNOWLEDGED RECEIPT.</span>",
                            "> BROADCASTING TO LOCAL ASSETS...",
                            "<span style='color:#F39C12;'>> KAMOV HELICOPTER DIVERTED. ETA: 14m.</span>",
                            "> ESTABLISHING CONTINUOUS TELEMETRY LOOP..."
                        ];

                        let i = 0;
                        window.sosInterval = setInterval(() => {
                            if (i < lines.length) {
                                term.innerHTML += '<div>' + lines[i] + '</div>';
                                term.scrollTop = term.scrollHeight;
                                i++;
                            } else {
                                clearInterval(window.sosInterval);
                                setInterval(() => {
                                    if(document.getElementById('sos-terminal')){
                                        document.getElementById('sos-terminal').innerHTML += '<div>> TX PING ' + Date.now() + ' (OK)</div>';
                                        document.getElementById('sos-terminal').scrollTop = document.getElementById('sos-terminal').scrollHeight;
                                    }
                                }, 2000);
                            }
                        }, 600);
                    }
                };

                window.resetSOS = function() {
                    const idle = document.getElementById('sos-idle-state');
                    const active = document.getElementById('sos-active-state');
                    const container = document.getElementById('emergency-container');
                    const progContainer = document.getElementById('sos-progress-container');
                    const progBar = document.getElementById('sos-progress-bar');
                    if(idle) idle.style.display = 'flex';
                    if(active) active.style.display = 'none';
                    if(container) container.classList.remove('sos-active-bg');
                    if(progContainer) progContainer.style.display = 'none';
                    if(progBar) progBar.style.width = '0%';
                    if(window.sosHoldTimer) clearInterval(window.sosHoldTimer);
                    if(window.sosInterval) clearInterval(window.sosInterval);
                    let highestTimeoutId = setTimeout(";");
                    for (let i = 0 ; i < highestTimeoutId ; i++) {
                        clearTimeout(i); 
                    }
                };
            </script>
        \`,
`;

const intelHTML = `
        '#intelligence': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-brain"></i> PREDICTIVE MODELING & SIMULATION</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">AI <span style="font-weight: 700; color: #00E5FF;">INTELLIGENCE</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #00E5FF; color: #00E5FF;" onclick="document.getElementById('ai-prompt').value='What if MV Vasiliy is delayed by 14 days due to heavy pack ice?';"><i class="fa-solid fa-bolt"></i> LOAD DEMO SCENARIO</button>
                    </div>
                </div>

                <!-- MAIN INTERACTIVE AREA -->
                <div style="display: flex; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: SIMULATOR INPUT -->
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
                        
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                            <div style="color: #fff; font-size: 16px; font-weight: bold; margin-bottom: 15px;"><i class="fa-solid fa-terminal" style="color:#00E5FF;"></i> WHAT-IF SCENARIO ENGINE</div>
                            <p style="color: #888; font-size: 12px; margin-bottom: 20px;">Enter a logistical disruption, weather event, or resource failure to simulate cascading impacts on Antarctic operations.</p>
                            
                            <textarea id="ai-prompt" style="width: 100%; height: 120px; background: #000; border: 1px solid #333; color: #00E5FF; padding: 15px; font-family: var(--font-mono); font-size: 13px; resize: none; margin-bottom: 15px; border-radius: 4px; box-sizing: border-box;" placeholder="Enter scenario here..."></textarea>
                            
                            <button style="width: 100%; background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 12px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0, 229, 255, 0.2)'" onmouseout="this.style.background='rgba(0, 229, 255, 0.1)'" onclick="window.runAISimulation()">
                                RUN SIMULATION
                            </button>
                        </div>

                        <!-- LIVE SYSTEM METRICS (Context for AI) -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; flex: 1;">
                            <div style="color: #666; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">CURRENT CONTEXT LOADED INTO MODEL</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">MAITRI RATIONS</div>
                                    <div style="color: #fff; font-size: 12px;">72 Days Left</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">BHARATI FUEL</div>
                                    <div style="color: #fff; font-size: 12px;">114 KL</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">SHIP DISTANCE</div>
                                    <div style="color: #fff; font-size: 12px;">4,200 NM</div>
                                </div>
                                <div style="background: #000; border: 1px dashed #333; padding: 10px;">
                                    <div style="color: #555; font-size: 9px; font-family: var(--font-mono);">HELICOPTER OPS</div>
                                    <div style="color: #00FF66; font-size: 12px;">Active (Clear)</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- RIGHT: AI OUTPUT RESULT -->
                    <div style="flex: 1.5; background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px; display: flex; flex-direction: column; position: relative; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 20px;">
                            <div style="color: #fff; font-size: 16px; font-weight: bold;"><i class="fa-solid fa-microchip"></i> SIMULATION REPORT</div>
                            <div id="ai-status" style="color: #555; font-family: var(--font-mono); font-size: 10px;">STANDBY</div>
                        </div>

                        <!-- Thinking Animation (Hidden initially) -->
                        <div id="ai-thinking" style="display: none; flex-direction: column; justify-content: center; align-items: center; flex: 1; gap: 20px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; border: 3px solid rgba(0, 229, 255, 0.2); border-top-color: #00E5FF; animation: spin 1s linear infinite;"></div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px; animation: blink 1.5s infinite;">CALCULATING CASCADING IMPACTS...</div>
                        </div>

                        <!-- Result Display (Hidden initially) -->
                        <div id="ai-result" style="display: none; flex-direction: column; gap: 20px; overflow-y: auto;">
                            <!-- Dynamically filled by JS -->
                        </div>

                        <!-- Empty State -->
                        <div id="ai-empty" style="display: flex; flex: 1; justify-content: center; align-items: center; color: #333; font-family: var(--font-mono); font-size: 12px; text-align: center;">
                            NO SCENARIO PROCESSED.<br>ENTER PARAMETERS AND RUN SIMULATION.
                        </div>

                    </div>
                </div>
            </div>

            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
            </style>

            <script>
                window.runAISimulation = function() {
                    const promptVal = document.getElementById('ai-prompt').value;
                    if(!promptVal || promptVal.trim() === '') return;

                    document.getElementById('ai-empty').style.display = 'none';
                    document.getElementById('ai-result').style.display = 'none';
                    document.getElementById('ai-thinking').style.display = 'flex';
                    document.getElementById('ai-status').innerText = 'PROCESSING MODEL...';
                    document.getElementById('ai-status').style.color = '#00E5FF';

                    setTimeout(() => {
                        document.getElementById('ai-thinking').style.display = 'none';
                        document.getElementById('ai-result').style.display = 'flex';
                        document.getElementById('ai-status').innerText = 'SIMULATION COMPLETE';
                        document.getElementById('ai-status').style.color = '#00FF66';

                        // NO TEMPLATE LITERALS HERE. USING STRING CONCATENATION.
                        const resultHTML = "" +
                            "<div style='background: rgba(255, 0, 60, 0.1); border-left: 3px solid #FF003C; padding: 15px;'>" +
                                "<div style='color: #FF003C; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;'>CRITICAL IMPACT DETECTED</div>" +
                                "<div style='color: #fff; font-size: 13px; line-height: 1.5;'>If MV Vasiliy is delayed by 14 days, Maitri Station will deplete its <span style='color:#FF003C; font-weight:bold;'>Aviation Turbine Fuel (ATF)</span> reserve on Day 11, halting all inland helicopter operations.</div>" +
                            "</div>" +
                            "<div>" +
                                "<div style='color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;'>CASCADING TIMELINE</div>" +
                                "<div style='border-left: 1px dashed #333; margin-left: 5px; padding-left: 15px; display: flex; flex-direction: column; gap: 15px;'>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #F39C12; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#F39C12; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 5</span> Ration rationing initiated at Maitri (2 meals/day).</div>" +
                                    "</div>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 11</span> Helicopter grounded. Inland resupply impossible.</div>" +
                                    "</div>" +
                                    "<div style='position: relative;'>" +
                                        "<div style='position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;'></div>" +
                                        "<div style='color: #ccc; font-size: 12px;'><span style='color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;'>DAY 14</span> Generator 3 shuts down to conserve remaining polar diesel.</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div style='background: rgba(0, 255, 102, 0.05); border: 1px solid #00FF66; padding: 15px; border-radius: 4px; margin-top: 10px;'>" +
                                "<div style='color: #00FF66; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;'><i class='fa-solid fa-check'></i> AI RECOMMENDATION</div>" +
                                "<div style='color: #fff; font-size: 13px; line-height: 1.5;'>Immediate Action: Airdrop 20 barrels of ATF to Maitri via Kamov sling-load before Day 4 to bridge the 14-day gap. Dispatch PistenBully convoy to Ice-Shelf depot to pre-position rations.</div>" +
                                "<button style='margin-top: 15px; background: #00FF66; color: #000; border: none; padding: 8px 15px; font-family: var(--font-mono); font-size: 10px; font-weight: bold; cursor: pointer;'>" +
                                    "EXECUTE MITIGATION PLAN" +
                                "</button>" +
                            "</div>";
                        
                        document.getElementById('ai-result').innerHTML = resultHTML;
                    }, 2500);
                };
            </script>
        \`
`;

// REPLACE EMERGENCY
let emStart = appJS.indexOf("'#emergency': `");
let emEnd = appJS.indexOf("'#cargo-scan': `");
if (emStart !== -1 && emEnd !== -1) {
    let pre = appJS.substring(0, emStart);
    let post = appJS.substring(emEnd);
    appJS = pre + emergencyHTML + "\\n        " + post;
}

// REPLACE INTELLIGENCE
let inStart = appJS.indexOf("'#intelligence': `");
let inEnd = appJS.lastIndexOf("    };");
if (inStart !== -1 && inEnd !== -1) {
    let pre = appJS.substring(0, inStart);
    let post = appJS.substring(inEnd);
    appJS = pre + intelHTML + "\\n" + post;
}

fs.writeFileSync('js/app.js', appJS);
console.log("Safely injected Emergency & Intelligence without nested backticks!");
