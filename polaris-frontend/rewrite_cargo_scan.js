const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

const startIndex = appJS.indexOf("'#cargo-scan': `");
let endIndex = appJS.indexOf("'#intelligence': `", startIndex);

if (endIndex === -1) {
    endIndex = appJS.indexOf("'#emergency': `", startIndex);
}

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find bounds for #cargo-scan replacement.", {startIndex, endIndex});
    process.exit(1);
}

const newCargoScanHTML = `
        '#cargo-scan': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-camera"></i> OPTICAL & RFID INSPECTION</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">ASSET <span style="font-weight: 700; color: #00FF66;">SCANNER</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-outline" style="border-color: #333; color: #888;"><i class="fa-solid fa-list-check"></i> VIEW LOGS</button>
                    </div>
                </div>

                <!-- MAIN INTERFACE -->
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: THE SCANNER -->
                    <div style="display: flex; flex-direction: column; background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <div style="color: #00FF66; font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px;"><i class="fa-solid fa-wifi"></i> UPLINK ACTIVE</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">AES-256 ENCRYPTED</div>
                        </div>

                        <!-- Scanner Viewfinder -->
                        <div style="position: relative; flex: 1; background: #000; border: 1px solid #111; border-radius: 4px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,255,102,0.05);">
                            
                            <!-- Targeting Corners -->
                            <div style="position: absolute; top: 10%; left: 10%; width: 30px; height: 30px; border-top: 3px solid #00FF66; border-left: 3px solid #00FF66;"></div>
                            <div style="position: absolute; top: 10%; right: 10%; width: 30px; height: 30px; border-top: 3px solid #00FF66; border-right: 3px solid #00FF66;"></div>
                            <div style="position: absolute; bottom: 10%; left: 10%; width: 30px; height: 30px; border-bottom: 3px solid #00FF66; border-left: 3px solid #00FF66;"></div>
                            <div style="position: absolute; bottom: 10%; right: 10%; width: 30px; height: 30px; border-bottom: 3px solid #00FF66; border-right: 3px solid #00FF66;"></div>

                            <!-- Mock QR Code (Faded in background) -->
                            <i class="fa-solid fa-qrcode" style="font-size: 150px; color: rgba(0, 255, 102, 0.1);"></i>

                            <!-- Animated Laser -->
                            <div id="scanner-laser" style="position: absolute; top: 15%; left: 5%; width: 90%; height: 2px; background: #FF003C; box-shadow: 0 0 10px #FF003C; animation: scan 2s linear infinite;"></div>
                        </div>

                        <div style="margin-top: 25px; display: flex; gap: 15px;">
                            <button id="btn-mock-scan" style="flex: 1; background: rgba(0, 255, 102, 0.1); border: 1px solid #00FF66; color: #00FF66; padding: 15px; font-family: var(--font-mono); font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.3s; border-radius: 4px;" onmouseover="this.style.background='rgba(0, 255, 102, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 102, 0.1)'">
                                <i class="fa-solid fa-barcode"></i> MOCK SCAN ASSET
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: DECODED DATA -->
                    <div style="display: flex; flex-direction: column;">
                        
                        <!-- Initial State (Waiting) -->
                        <div id="scan-waiting" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 1px dashed #333; border-radius: 4px; background: rgba(10,10,10,0.5);">
                            <i class="fa-solid fa-radar" style="font-size: 40px; color: #333; margin-bottom: 20px;"></i>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 14px; letter-spacing: 1px;">WAITING FOR SIGNAL...</div>
                        </div>

                        <!-- Scanned Data State (Hidden initially) -->
                        <div id="scan-result" style="display: none; flex-direction: column; gap: 15px;">
                            
                            <!-- Success Header -->
                            <div style="background: rgba(0, 255, 102, 0.1); border-left: 4px solid #00FF66; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
                                <div>
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 16px; font-weight: bold;">ASSET VERIFIED <i class="fa-solid fa-circle-check"></i></div>
                                    <div style="color: #aaa; font-family: var(--font-mono); font-size: 10px; margin-top: 5px;">Cryptographic Signature Valid</div>
                                </div>
                                <div style="color: #00FF66; font-size: 30px;"><i class="fa-solid fa-shield-halved"></i></div>
                            </div>

                            <!-- Detailed Specs -->
                            <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 25px;">
                                
                                <div style="display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px;">
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">ASSET ID</div>
                                        <div style="color: #fff; font-family: var(--font-mono); font-size: 20px;">RFID-M041-992</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TIMESTAMP</div>
                                        <div id="scan-timestamp" style="color: #00E5FF; font-family: var(--font-mono); font-size: 14px;">14:32:05 IST</div>
                                    </div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">DESCRIPTION</div>
                                        <div style="color: #fff; font-size: 14px; font-weight: 500;">O-Negative Blood Plasma</div>
                                        <div style="color: #888; font-size: 11px; margin-top: 3px;">Cold-Chain Box (Type 4)</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">DESTINATION</div>
                                        <div style="color: #00E5FF; font-size: 14px; font-weight: 500;">Bharati Sickbay (Sec 4)</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">WEIGHT</div>
                                        <div style="color: #ddd; font-family: var(--font-mono); font-size: 14px;">45.2 KG</div>
                                    </div>
                                    <div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">TEMPERATURE STATE</div>
                                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 14px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-snowflake"></i> -20.5°C</div>
                                    </div>
                                </div>

                                <!-- Tamper Hash -->
                                <div style="background: #000; border: 1px solid #111; padding: 15px; border-radius: 4px;">
                                    <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">CHAIN OF CUSTODY HASH (SHA-256)</div>
                                    <div style="color: #00FF66; font-family: var(--font-mono); font-size: 11px; word-break: break-all;">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            <div style="display: flex; gap: 15px;">
                                <button style="flex: 1; background: rgba(0,229,255,0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 15px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(0,229,255,0.2)'" onmouseout="this.style.background='rgba(0,229,255,0.1)'">
                                    <i class="fa-solid fa-arrow-right-arrow-left"></i> LOG TRANSFER
                                </button>
                                <button style="background: transparent; border: 1px solid #FF003C; color: #FF003C; padding: 15px; font-family: var(--font-mono); font-size: 12px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                                    <i class="fa-solid fa-triangle-exclamation"></i> FLAG ANOMALY
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <style>
                @keyframes scan {
                    0% { top: 15%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 85%; opacity: 0; }
                }
            </style>
            
            <script>
                // We will attach an event listener globally for this button in global-ui.js or planner.js
                // But for a quick hackathon prototype, if it's rendered, this works:
            </script>
        \`,
`;

const pre = appJS.substring(0, startIndex);
const post = appJS.substring(endIndex);

appJS = pre + newCargoScanHTML + post;
fs.writeFileSync('js/app.js', appJS);

// Add the event listener to app.js globally (since views are injected via innerHTML, inline scripts don't run automatically)
const scriptToInject = `
// Inject Scanner Logic
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'btn-mock-scan' || e.target.closest('#btn-mock-scan')) {
        const btn = document.getElementById('btn-mock-scan');
        const waiting = document.getElementById('scan-waiting');
        const result = document.getElementById('scan-result');
        const timestamp = document.getElementById('scan-timestamp');
        const laser = document.getElementById('scanner-laser');
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SCANNING...';
        btn.style.borderColor = '#FF003C';
        btn.style.color = '#FF003C';
        laser.style.background = '#00FF66';
        laser.style.boxShadow = '0 0 10px #00FF66';
        
        setTimeout(() => {
            waiting.style.display = 'none';
            result.style.display = 'flex';
            timestamp.innerText = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';
            
            btn.innerHTML = '<i class="fa-solid fa-barcode"></i> MOCK SCAN ASSET';
            btn.style.borderColor = '#00FF66';
            btn.style.color = '#00FF66';
            laser.style.background = '#FF003C';
            laser.style.boxShadow = '0 0 10px #FF003C';
        }, 1500);
    }
});
`;
fs.appendFileSync('js/app.js', scriptToInject);

console.log("Cargo Scanner replaced and logic injected successfully!");
