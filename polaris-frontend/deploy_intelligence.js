const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

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

                    // Simulate API delay for demo realism
                    setTimeout(() => {
                        document.getElementById('ai-thinking').style.display = 'none';
                        document.getElementById('ai-result').style.display = 'flex';
                        document.getElementById('ai-status').innerText = 'SIMULATION COMPLETE';
                        document.getElementById('ai-status').style.color = '#00FF66';

                        // Render Fake Result Output
                        const resultHTML = \`
                            <div style="background: rgba(255, 0, 60, 0.1); border-left: 3px solid #FF003C; padding: 15px;">
                                <div style="color: #FF003C; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;">CRITICAL IMPACT DETECTED</div>
                                <div style="color: #fff; font-size: 13px; line-height: 1.5;">If MV Vasiliy is delayed by 14 days, Maitri Station will deplete its <span style="color:#FF003C; font-weight:bold;">Aviation Turbine Fuel (ATF)</span> reserve on Day 11, halting all inland helicopter operations.</div>
                            </div>
                            
                            <div>
                                <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 10px;">CASCADING TIMELINE</div>
                                <div style="border-left: 1px dashed #333; margin-left: 5px; padding-left: 15px; display: flex; flex-direction: column; gap: 15px;">
                                    <div style="position: relative;">
                                        <div style="position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #F39C12; border-radius: 50%;"></div>
                                        <div style="color: #ccc; font-size: 12px;"><span style="color:#F39C12; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;">DAY 5</span> Ration rationing initiated at Maitri (2 meals/day).</div>
                                    </div>
                                    <div style="position: relative;">
                                        <div style="position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;"></div>
                                        <div style="color: #ccc; font-size: 12px;"><span style="color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;">DAY 11</span> Helicopter grounded. Inland resupply impossible.</div>
                                    </div>
                                    <div style="position: relative;">
                                        <div style="position: absolute; left: -20px; top: 2px; width: 8px; height: 8px; background: #FF003C; border-radius: 50%;"></div>
                                        <div style="color: #ccc; font-size: 12px;"><span style="color:#FF003C; font-family: var(--font-mono); font-size: 10px; margin-right: 10px;">DAY 14</span> Generator 3 shuts down to conserve remaining polar diesel.</div>
                                    </div>
                                </div>
                            </div>

                            <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid #00FF66; padding: 15px; border-radius: 4px; margin-top: 10px;">
                                <div style="color: #00FF66; font-family: var(--font-mono); font-size: 10px; font-weight: bold; margin-bottom: 5px;"><i class="fa-solid fa-check"></i> AI RECOMMENDATION</div>
                                <div style="color: #fff; font-size: 13px; line-height: 1.5;">Immediate Action: Airdrop 20 barrels of ATF to Maitri via Kamov sling-load before Day 4 to bridge the 14-day gap. Dispatch PistenBully convoy to Ice-Shelf depot to pre-position rations.</div>
                                <button style="margin-top: 15px; background: #00FF66; color: #000; border: none; padding: 8px 15px; font-family: var(--font-mono); font-size: 10px; font-weight: bold; cursor: pointer;">
                                    EXECUTE MITIGATION PLAN
                                </button>
                            </div>
                        \`;
                        
                        document.getElementById('ai-result').innerHTML = resultHTML;

                    }, 2500); // 2.5 seconds fake thinking
                };
            </script>
        \`,
`;

// Replace the old intelligence block
const startIndex = appJS.indexOf("'#intelligence':");
if (startIndex !== -1) {
    let endIndex = appJS.indexOf("    };", startIndex);
    if (endIndex === -1) endIndex = appJS.lastIndexOf("}");
    
    const pre = appJS.substring(0, startIndex);
    const post = appJS.substring(endIndex);
    
    fs.writeFileSync('js/app.js', pre + intelHTML + "\\n" + post);
    console.log("Interactive AI Intelligence module updated successfully!");
} else {
    console.log("Could not find intelligence anchor.");
}
