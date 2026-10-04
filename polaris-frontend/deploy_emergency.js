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
                // We ensure global handlers so they persist and are callable
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
                    }, 40); // slightly faster (40ms * 50 = 2 seconds) for demo
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

                    // Terminal Sequence
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
                    
                    // Kill repeating ping intervals by doing a brute force clear
                    let highestTimeoutId = setTimeout(";");
                    for (let i = 0 ; i < highestTimeoutId ; i++) {
                        clearTimeout(i); 
                    }
                };
            </script>
        \`,
`;

// Replace the old emergency block (if it's the stub) with our new interactive one
const startIndex = appJS.indexOf("'#emergency':");
if (startIndex !== -1) {
    // Find the end of this block by searching for the next route key or end of dict
    let endIndex = appJS.indexOf("    };", startIndex);
    if (endIndex === -1) { // Maybe there's a comma and another key
        endIndex = appJS.lastIndexOf("}");
    }
    
    // Replace the block
    const pre = appJS.substring(0, startIndex);
    const post = appJS.substring(endIndex);
    
    // Ensure formatting
    const newFile = pre + emergencyHTML + "\\n" + post;
    fs.writeFileSync('js/app.js', newFile);
    console.log("Interactive Emergency module updated successfully!");
} else {
    console.log("Could not find emergency anchor.");
}
