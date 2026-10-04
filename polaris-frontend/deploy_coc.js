const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#chain-of-custody': `")) {
    console.log("Chain of Custody already exists.");
    process.exit(0);
}

const cocHTML = `
        '#chain-of-custody': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-link"></i> IMMUTABLE TRACKING LEDGER</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">CHAIN OF <span style="font-weight: 700; color: #00E5FF;">CUSTODY</span></h1>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid #00E5FF; padding: 10px 15px; border-radius: 4px; display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-shield-halved" style="color: #00E5FF; font-size: 20px;"></i>
                            <div>
                                <div style="color: #888; font-size: 9px; font-family: var(--font-mono);">NETWORK STATUS</div>
                                <div style="color: #00E5FF; font-size: 12px; font-family: var(--font-mono); font-weight: bold;">LEDGER SYNCED</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MAIN INTERFACE -->
                <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px; flex: 1;">
                    
                    <!-- LEFT: ASSET SUMMARY (THE TARGET) -->
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        
                        <!-- Search Box -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 15px; display: flex; gap: 10px;">
                            <input type="text" value="RFID-M041-992" style="flex:1; background: #000; border: 1px solid #333; color: #00E5FF; padding: 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                            <button style="background: #00E5FF; border: none; color: #000; padding: 10px 15px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>

                        <!-- Asset Details Card -->
                        <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-left: 3px solid #00E5FF; border-radius: 4px; padding: 25px;">
                            <div style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 5px;">O-Negative Blood Plasma</div>
                            <div style="color: #888; font-size: 11px; font-family: var(--font-mono); margin-bottom: 20px;">Cold-Chain Box (Type 4)</div>
                            
                            <div style="display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">CURRENT CUSTODIAN</span>
                                    <span style="color: #fff; font-family: var(--font-mono); font-size: 11px;">Capt. R. Sharma</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">AUTHORIZATION</span>
                                    <span style="color: #00FF66; font-family: var(--font-mono); font-size: 11px;">LEVEL 4 (MEDICAL)</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #666; font-family: var(--font-mono); font-size: 10px;">TEMP THRESHOLD</span>
                                    <span style="color: #F39C12; font-family: var(--font-mono); font-size: 11px;">-20°C to -25°C</span>
                                </div>
                            </div>

                            <div style="background: #000; border: 1px dashed #333; padding: 15px; border-radius: 4px;">
                                <div style="color: #555; font-family: var(--font-mono); font-size: 10px; margin-bottom: 5px;">ACTIVE SMART CONTRACT</div>
                                <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 10px; word-break: break-all;">0x8f2a99d3...c8996fb92427ae41e4649b934ca495991b7852b855</div>
                            </div>
                            
                            <button style="width: 100%; margin-top: 15px; background: rgba(0,255,102,0.1); border: 1px solid #00FF66; color: #00FF66; padding: 12px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer;">
                                <i class="fa-solid fa-file-contract"></i> VERIFY INTEGRITY
                            </button>
                        </div>
                    </div>

                    <!-- RIGHT: THE LEDGER TIMELINE -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 30px; position: relative;">
                        
                        <h3 style="color: #fff; font-size: 14px; margin: 0 0 30px 0; font-family: 'Inter'; font-weight: 500; letter-spacing: 1px; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px;">CUSTODY HANDOVER LOG</h3>

                        <!-- Timeline Container -->
                        <div style="position: relative; padding-left: 30px;">
                            
                            <!-- Vertical Connecting Line -->
                            <div style="position: absolute; top: 10px; bottom: 50px; left: 11px; width: 2px; background: linear-gradient(to bottom, #00FF66 0%, #00E5FF 60%, #333 100%);"></div>

                            <!-- BLOCK 1 (Origin) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <!-- Node Dot -->
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00FF66; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 10px #00FF66;"></div>
                                
                                <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0,255,102,0.2); padding: 15px; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00FF66; font-size: 12px; font-weight: bold;">ORIGIN - GOA DEPOT (INDIA)</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">12-JAN-2026 | 08:30 IST</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">AUTHORIZED BY</div>
                                            <div style="color: #ddd; font-size: 11px;">Dr. Anil Kapoor (Logistics Head)</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Packaged & Sealed in Cold-Chain</div>
                                        </div>
                                    </div>
                                    <div style="color: #444; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock" style="color: #00FF66;"></i> HASH: 7b8c...92f1 (Verified)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 2 (Loading) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00FF66; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 10px #00FF66;"></div>
                                
                                <div style="background: rgba(0, 255, 102, 0.05); border: 1px solid rgba(0,255,102,0.2); padding: 15px; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00FF66; font-size: 12px; font-weight: bold;">MV VASILIY GOLOVNIN - HOLD STOWAGE</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">15-JAN-2026 | 14:45 IST</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">RECEIVED BY</div>
                                            <div style="color: #ddd; font-size: 11px;">Chief Mate V. Orlov</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Loaded to Deck A (Med Sector)</div>
                                        </div>
                                    </div>
                                    <div style="color: #444; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock" style="color: #00FF66;"></i> HASH: a1d3...88be (Verified)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 3 (Current / Pulse) -->
                            <div style="position: relative; margin-bottom: 30px;">
                                <div style="position: absolute; left: -26px; top: 10px; width: 14px; height: 14px; background: #00E5FF; border-radius: 50%; border: 3px solid #111; animation: pulse 2s infinite;"></div>
                                
                                <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid #00E5FF; padding: 15px; border-radius: 4px; box-shadow: 0 0 15px rgba(0,229,255,0.1);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #00E5FF; font-size: 12px; font-weight: bold;">CAPE TOWN PORT - REFUELING / CUSTOMS</div>
                                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px;">22-JAN-2026 | 09:12 UTC</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">CUSTODIAN</div>
                                            <div style="color: #ddd; font-size: 11px;">Capt. R. Sharma (Acting)</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">ACTION</div>
                                            <div style="color: #ddd; font-size: 11px;">Customs Inspection & Seal Check</div>
                                        </div>
                                    </div>
                                    <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 9px; display: flex; align-items: center; gap: 5px;">
                                        <i class="fa-solid fa-lock"></i> HASH: e3b0...b855 (Active Smart Contract)
                                    </div>
                                </div>
                            </div>

                            <!-- BLOCK 4 (Future Pending) -->
                            <div style="position: relative;">
                                <div style="position: absolute; left: -24px; top: 10px; width: 10px; height: 10px; background: #333; border-radius: 50%; border: 3px solid #111;"></div>
                                
                                <div style="background: transparent; border: 1px dashed #333; padding: 15px; border-radius: 4px; opacity: 0.5;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <div style="color: #888; font-size: 12px; font-weight: bold;">BHARATI BASE (SICKBAY)</div>
                                        <div style="color: #555; font-family: var(--font-mono); font-size: 10px;">PENDING ARRIVAL</div>
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">EXPECTED RECEIVER</div>
                                            <div style="color: #888; font-size: 11px;">CMO Dr. Raj Varma</div>
                                        </div>
                                        <div>
                                            <div style="color: #555; font-family: var(--font-mono); font-size: 9px;">EXPECTED ACTION</div>
                                            <div style="color: #888; font-size: 11px;">Final Unpacking & Storage</div>
                                        </div>
                                    </div>
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
    appJS = pre + cocHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Chain of Custody injected successfully!");
} else {
    console.log("Could not find anchor to inject chain of custody.");
}
