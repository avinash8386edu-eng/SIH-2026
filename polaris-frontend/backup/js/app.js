import db, { initDB } from './db.js';
import { GlobalUI } from './global-ui.js';

// Single Page Application (SPA) Router logic
document.addEventListener('DOMContentLoaded', async () => {
    
    // Initialize Core Foundation
    GlobalUI.init();
    await initDB(); // Will seed if empty

    // Fetch dynamic numbers from Dexie for the single source of truth
    const personnelCount = await db.personnel.count();
    const cargoCount = await db.cargo.count();
    const inventoryItems = await db.inventory.toArray();
    let fuelLevel = 0;
    inventoryItems.forEach(i => { if(i.category === "Fuel") fuelLevel += i.quantity; });
    const missionsCount = await db.missions.count();

    // Highlight sidebar links based on active hash
    const navItems = document.querySelectorAll('.nav-item');
    
    function updateSidebar(hash) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });
    }

    // Views
    const views = {
        '#overview': `
            <div class="glass-panel" style="padding: 30px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 10px; letter-spacing: 2px;">EXPEDITION COMMAND CENTER</h1>
                <p class="neon-text" style="font-family: var(--font-mono); margin-bottom: 30px;">46TH ISEA • ANTARCTICA OPERATIONS</p>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                    <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--accent-cyan);">
                        <p style="color: var(--text-muted); font-size: 0.8rem; letter-spacing: 2px;">ACTIVE PERSONNEL</p>
                        <h2 style="font-size: 2.5rem; margin-top: 5px;">${personnelCount}</h2>
                        <p style="color: #00FF66; font-size: 0.8rem; margin-top: 5px;"><i class="fa-solid fa-check-circle"></i> Tracking Active</p>
                    </div>
                    <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--accent-cyan);">
                        <p style="color: var(--text-muted); font-size: 0.8rem; letter-spacing: 2px;">CARGO TRACKED</p>
                        <h2 style="font-size: 2.5rem; margin-top: 5px;">${cargoCount}</h2>
                        <p style="color: #00FF66; font-size: 0.8rem; margin-top: 5px;"><i class="fa-solid fa-check-circle"></i> Sync Nominal</p>
                    </div>
                    <div class="glass-panel" style="padding: 20px; border-left: 4px solid #FFCC00;">
                        <p style="color: var(--text-muted); font-size: 0.8rem; letter-spacing: 2px;">FUEL RESERVES (L)</p>
                        <h2 style="font-size: 2.5rem; margin-top: 5px;">${fuelLevel.toLocaleString()}</h2>
                        <p style="color: #FFCC00; font-size: 0.8rem; margin-top: 5px;"><i class="fa-solid fa-triangle-exclamation"></i> Winter Depot Active</p>
                    </div>
                    <div class="glass-panel" style="padding: 20px; border-left: 4px solid var(--alert-red);">
                        <p style="color: var(--text-muted); font-size: 0.8rem; letter-spacing: 2px;">ACTIVE MISSIONS</p>
                        <h2 style="font-size: 2.5rem; margin-top: 5px;">${missionsCount}</h2>
                        <p style="color: var(--alert-red); font-size: 0.8rem; margin-top: 5px;"><i class="fa-solid fa-tower-broadcast"></i> Live Monitoring</p>
                    </div>
                </div>
            </div>
        `,
        '#intelligence': `
        <div>
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">WHAT-IF AI SIMULATOR</h2>
            <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Multi-constraint predictive engine for expedition logistics.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <!-- Control Panel -->
                <div class="glass-panel" style="padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION PARAMETERS</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">SCENARIO TYPE</label>
                        <select id="ai-scenario-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="BLIZZARD">Cat-4 Blizzard Strike</option>
                            <option value="VESSEL_DELAY">Icebreaker Delay (Logistics)</option>
                            <option value="FUEL_SPIKE">Sudden Fuel Burn Spike</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">TARGET STATION</label>
                        <select id="ai-station-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="MAITRI">Maitri</option>
                            <option value="BHARATI">Bharati</option>
                            <option value="ALL">All Stations</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">DURATION (DAYS)</label>
                        <input type="number" id="ai-duration" value="7" min="1" max="60" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                    </div>
                    
                    <button class="btn-cyber" id="btn-run-simulation" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                        <i class="fa-solid fa-microchip"></i> RUN PREDICTION
                    </button>
                </div>

                <!-- Results Output -->
                <div class="glass-panel" style="padding: 30px; position: relative;" id="ai-results-panel">
                    <div id="ai-overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); z-index: 10; display: none; justify-content: center; align-items: center; border-radius: 8px;">
                        <div style="text-align: center;">
                            <i class="fa-solid fa-radar fa-spin" style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 15px;"></i>
                            <p style="font-family: var(--font-mono); color: var(--accent-cyan); letter-spacing: 2px;" id="ai-loading-text">CALCULATING QUANTUM PROBABILITIES...</p>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION OUTCOME</h3>
                    <div style="font-family: var(--font-mono); margin-bottom: 20px;">
                        <span style="color: var(--text-muted);">CONFIDENCE INTERVAL:</span> <span id="res-confidence" style="color: #00FF66;">--</span><br>
                        <span style="color: var(--text-muted);">AFFECTED SUBSYSTEMS:</span> <span id="res-affected" style="color: #FFCC00;">--</span>
                    </div>
                    
                    <h4 style="color: var(--alert-red); margin-bottom: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FAILURES PREDICTED</h4>
                    <ul id="res-failures" style="font-family: var(--font-mono); color: white; background: rgba(255,0,60,0.1); padding: 15px; border-left: 3px solid var(--alert-red); list-style: none; margin-bottom: 20px; min-height: 80px;">
                    </ul>

                    <h4 style="color: #00FF66; margin-bottom: 10px;"><i class="fa-solid fa-shield-halved"></i> RECOMMENDED MITIGATION</h4>
                    <ul id="res-mitigation" style="font-family: var(--font-mono); color: white; background: rgba(0,255,102,0.1); padding: 15px; border-left: 3px solid #00FF66; list-style: none; min-height: 80px;">
                    </ul>
                </div>
            </div>
        </div>
    `,
        '#emergency': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--alert-red);">EMERGENCY DISPATCH PROTOCOL</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Global distress relay and automated search-and-rescue routing.</p>
                
                <div id="sos-default-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--alert-red); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 20px; font-size: 1.5rem;">CRITICAL SOS ACTIVATION</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Initiating this protocol broadcasts a high-priority distress signal to all available channels, bypasses bandwidth limits, and alerts the nearest Traverse units. Use only in life-threatening scenarios.
                    </p>
                    <button class="btn-cyber" id="btn-trigger-sos" style="background: rgba(255, 0, 60, 0.2); border-color: var(--alert-red); color: var(--alert-red); font-size: 1.5rem; padding: 20px 50px; font-weight: bold; border-radius: 8px;">
                        INITIATE SOS
                    </button>
                    <p style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.8rem; color: #FFCC00;">[ DEMO MODE: WILL SAVE TO LOCAL DB FOR HACKATHON ]</p>
                </div>

                <div id="sos-active-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red); display: none;">
                    <div class="meter-circle" style="--percent: 100; --meter-color: var(--alert-red); width: 150px; height: 150px; margin-bottom: 20px;">
                        <div class="meter-inner">
                            <h2 id="sos-countdown" style="font-size: 3rem; color: var(--alert-red);">3</h2>
                        </div>
                    </div>
                    <h3 class="neon-text-red" style="font-size: 2rem; margin-bottom: 10px;">DISTRESS BEACON ACTIVATED</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-main); margin-bottom: 30px; letter-spacing: 2px;">GATHERING TELEMETRY AND LOCATING NEARBY ASSETS...</p>
                    <button class="btn-cyber" id="btn-cancel-sos" style="border-color: var(--text-muted); color: var(--text-main);">CANCEL SIGNAL (ABORT)</button>
                </div>
                
                <div id="sos-map-container" class="glass-panel" style="margin-top: 30px; height: 400px; display: none; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_6400px_from_Blue_Marble.jpg') center/cover; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div class="pulse-dot" style="background: var(--alert-red); box-shadow: 0 0 20px var(--alert-red); width: 20px; height: 20px;"></div>
                        <p class="neon-text-red" style="font-family: var(--font-mono); margin-top: 10px; font-weight: bold; font-size: 1.2rem;">INCIDENT LOCATION ACQUIRED</p>
                        <p style="color: white; font-family: var(--font-mono); font-size: 0.9rem;">Lat: -69.412 | Lng: 76.195</p>
                    </div>
                </div>
            </div>
        `,
                '#cargo-scan': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">QR ENGINE & CHAIN OF CUSTODY</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Optical inspection and tamper-evident cryptographic tracking.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <!-- Scanner Module -->
                    <div class="glass-panel" style="padding: 30px; text-align: center;">
                        <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">OPTICAL SCANNER</h3>
                        <div class="scanner-container" style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 20px; border: 1px solid rgba(0,229,255,0.2);">
                            <div class="scanner-reticle" style="margin: 0 auto 20px;">
                                <div class="laser"></div>
                                <video id="qr-video" style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                            </div>
                            
                            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                                <button class="btn-cyber" id="btn-start-camera" style="flex: 1; padding: 12px; font-size: 0.9rem;"><i class="fa-solid fa-camera"></i> START CAMERA</button>
                                <button class="btn-cyber" id="btn-upload-qr" style="flex: 1; padding: 12px; font-size: 0.9rem;"><i class="fa-solid fa-upload"></i> UPLOAD IMAGE</button>
                            </div>
                            
                            <div style="display: flex; gap: 10px; align-items: center; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px;">
                                <input type="text" id="manual-qr-input" placeholder="Enter Unique Cargo ID..." style="flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                                <button class="btn-cyber" id="btn-manual-lookup" style="flex: 1; padding: 12px;"><i class="fa-solid fa-magnifying-glass"></i> LOOKUP</button>
                            </div>
                        </div>
                    </div>

                    <!-- Chain of Custody Timeline -->
                    <div class="glass-panel" id="custody-panel" style="padding: 30px; display: none;">
                        <h3 style="margin-bottom: 10px; color: var(--accent-cyan);">CUSTODY AUDIT LOG</h3>
                        <p id="cargo-title" style="font-family: var(--font-mono); color: white; font-size: 1.2rem; margin-bottom: 20px;">CRG-WAITING</p>
                        
                        <div class="timeline" id="cargo-timeline" style="flex-direction: column; max-width: 100%; margin: 0;">
                            <!-- Timeline nodes injected dynamically -->
                        </div>
                        
                        <button class="btn-cyber" id="btn-verify-hash" style="margin-top: 20px; width: 100%; border-color: #FFCC00; color: #FFCC00;">VERIFY CRYPTOGRAPHIC INTEGRITY (SHA-256)</button>
                        <div id="hash-result" style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.9rem; word-break: break-all;"></div>
                    </div>
                </div>
                
                <!-- Generator Module -->
                <div class="glass-panel" style="margin-top: 30px; padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">GENERATE NEW CARGO TAG</h3>
                    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 15px;">
                        <input type="text" id="new-cargo-name" placeholder="Cargo Description (e.g. Ice Core Samples)" style="flex: 2; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                        <select id="new-cargo-base" style="flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="Goa">Origin: Goa Depot</option>
                            <option value="Cape Town">Origin: Cape Town</option>
                        </select>
                        <select id="new-cargo-dest" style="flex: 1; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="Bharati">Dest: Bharati</option>
                            <option value="Maitri">Dest: Maitri</option>
                        </select>
                        <button class="btn-cyber" id="btn-generate-qr" style="padding: 12px;"><i class="fa-solid fa-qrcode"></i> GENERATE SECURE TAG</button>
                    </div>
                    
                    <div id="generated-qr-result" style="display: none; padding: 20px; background: rgba(0, 255, 102, 0.1); border-left: 4px solid #00FF66; margin-top: 20px;">
                        <h4 style="color: #00FF66; margin-bottom: 10px;">SUCCESS: CARGO SECURED</h4>
                        <p style="font-family: var(--font-mono); color: white;">Unique Tracking ID: <strong id="generated-cargo-id" style="font-size: 1.5rem; letter-spacing: 2px; user-select: all; background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 4px; margin-left: 10px;"></strong></p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 10px;">* Use this Unique ID in the Optical Scanner manual lookup above to test the Chain of Custody.</p>
                    </div>
                </div>
            </div>
        `,
        '#intelligence': `
        <div>
            <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--accent-cyan);">WHAT-IF AI SIMULATOR</h2>
            <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Multi-constraint predictive engine for expedition logistics.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
                <!-- Control Panel -->
                <div class="glass-panel" style="padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION PARAMETERS</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">SCENARIO TYPE</label>
                        <select id="ai-scenario-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="BLIZZARD">Cat-4 Blizzard Strike</option>
                            <option value="VESSEL_DELAY">Icebreaker Delay (Logistics)</option>
                            <option value="FUEL_SPIKE">Sudden Fuel Burn Spike</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">TARGET STATION</label>
                        <select id="ai-station-select" style="width: 100%; padding: 12px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white; font-family: var(--font-mono);">
                            <option value="MAITRI">Maitri</option>
                            <option value="BHARATI">Bharati</option>
                            <option value="ALL">All Stations</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 5px;">DURATION (DAYS)</label>
                        <input type="number" id="ai-duration" value="7" min="1" max="60" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                    </div>
                    
                    <button class="btn-cyber" id="btn-run-simulation" style="width: 100%; font-size: 1.1rem; padding: 15px;">
                        <i class="fa-solid fa-microchip"></i> RUN PREDICTION
                    </button>
                </div>

                <!-- Results Output -->
                <div class="glass-panel" style="padding: 30px; position: relative;" id="ai-results-panel">
                    <div id="ai-overlay" style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); z-index: 10; display: none; justify-content: center; align-items: center; border-radius: 8px;">
                        <div style="text-align: center;">
                            <i class="fa-solid fa-radar fa-spin" style="font-size: 3rem; color: var(--accent-cyan); margin-bottom: 15px;"></i>
                            <p style="font-family: var(--font-mono); color: var(--accent-cyan); letter-spacing: 2px;" id="ai-loading-text">CALCULATING QUANTUM PROBABILITIES...</p>
                        </div>
                    </div>
                    
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">SIMULATION OUTCOME</h3>
                    <div style="font-family: var(--font-mono); margin-bottom: 20px;">
                        <span style="color: var(--text-muted);">CONFIDENCE INTERVAL:</span> <span id="res-confidence" style="color: #00FF66;">--</span><br>
                        <span style="color: var(--text-muted);">AFFECTED SUBSYSTEMS:</span> <span id="res-affected" style="color: #FFCC00;">--</span>
                    </div>
                    
                    <h4 style="color: var(--alert-red); margin-bottom: 10px;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL FAILURES PREDICTED</h4>
                    <ul id="res-failures" style="font-family: var(--font-mono); color: white; background: rgba(255,0,60,0.1); padding: 15px; border-left: 3px solid var(--alert-red); list-style: none; margin-bottom: 20px; min-height: 80px;">
                    </ul>

                    <h4 style="color: #00FF66; margin-bottom: 10px;"><i class="fa-solid fa-shield-halved"></i> RECOMMENDED MITIGATION</h4>
                    <ul id="res-mitigation" style="font-family: var(--font-mono); color: white; background: rgba(0,255,102,0.1); padding: 15px; border-left: 3px solid #00FF66; list-style: none; min-height: 80px;">
                    </ul>
                </div>
            </div>
        </div>
    `,
        '#emergency': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px; color: var(--alert-red);">EMERGENCY DISPATCH PROTOCOL</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Global distress relay and automated search-and-rescue routing.</p>
                
                <div id="sos-default-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--alert-red); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 20px; font-size: 1.5rem;">CRITICAL SOS ACTIVATION</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Initiating this protocol broadcasts a high-priority distress signal to all available channels, bypasses bandwidth limits, and alerts the nearest Traverse units. Use only in life-threatening scenarios.
                    </p>
                    <button class="btn-cyber" id="btn-trigger-sos" style="background: rgba(255, 0, 60, 0.2); border-color: var(--alert-red); color: var(--alert-red); font-size: 1.5rem; padding: 20px 50px; font-weight: bold; border-radius: 8px;">
                        INITIATE SOS
                    </button>
                    <p style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.8rem; color: #FFCC00;">[ DEMO MODE: WILL SAVE TO LOCAL DB FOR HACKATHON ]</p>
                </div>

                <div id="sos-active-view" class="glass-panel" style="padding: 60px; text-align: center; border-color: var(--alert-red); display: none;">
                    <div class="meter-circle" style="--percent: 100; --meter-color: var(--alert-red); width: 150px; height: 150px; margin-bottom: 20px;">
                        <div class="meter-inner">
                            <h2 id="sos-countdown" style="font-size: 3rem; color: var(--alert-red);">3</h2>
                        </div>
                    </div>
                    <h3 class="neon-text-red" style="font-size: 2rem; margin-bottom: 10px;">DISTRESS BEACON ACTIVATED</h3>
                    <p style="font-family: var(--font-mono); color: var(--text-main); margin-bottom: 30px; letter-spacing: 2px;">GATHERING TELEMETRY AND LOCATING NEARBY ASSETS...</p>
                    <button class="btn-cyber" id="btn-cancel-sos" style="border-color: var(--text-muted); color: var(--text-main);">CANCEL SIGNAL (ABORT)</button>
                </div>
                
                <div id="sos-map-container" class="glass-panel" style="margin-top: 30px; height: 400px; display: none; background: url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Antarctica_6400px_from_Blue_Marble.jpg') center/cover; position: relative;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div class="pulse-dot" style="background: var(--alert-red); box-shadow: 0 0 20px var(--alert-red); width: 20px; height: 20px;"></div>
                        <p class="neon-text-red" style="font-family: var(--font-mono); margin-top: 10px; font-weight: bold; font-size: 1.2rem;">INCIDENT LOCATION ACQUIRED</p>
                        <p style="color: white; font-family: var(--font-mono); font-size: 0.9rem;">Lat: -69.412 | Lng: 76.195</p>
                    </div>
                </div>
            </div>
        `,
        '#cargo-scan': `
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 5px;">QR ENGINE & CHAIN OF CUSTODY</h2>
                <p style="color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 30px;">Optical inspection and tamper-evident cryptographic tracking.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <!-- Scanner Module -->
                    <div class="glass-panel" style="padding: 30px; text-align: center;">
                        <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">OPTICAL SCANNER</h3>
                        <div class="scanner-container" style="background: rgba(0,0,0,0.5); border-radius: 8px; padding: 20px;">
                            <div class="scanner-reticle" style="margin: 0 auto 20px;">
                                <div class="laser"></div>
                                <video id="qr-video" style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
                            </div>
                            <button class="btn-cyber" id="btn-start-camera" style="margin-right: 10px;">START CAMERA</button>
                            <button class="btn-cyber" id="btn-upload-qr">UPLOAD IMAGE</button>
                            
                            <div style="margin-top: 20px;">
                                <input type="text" id="manual-qr-input" placeholder="Enter Cargo ID Manually..." style="width: 70%; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid var(--accent-cyan); color: white; font-family: var(--font-mono);">
                                <button class="btn-cyber" id="btn-manual-lookup">LOOKUP</button>
                            </div>
                        </div>
                    </div>

                    <!-- Chain of Custody Timeline -->
                    <div class="glass-panel" id="custody-panel" style="padding: 30px; display: none;">
                        <h3 style="margin-bottom: 10px; color: var(--accent-cyan);">CUSTODY AUDIT LOG</h3>
                        <p id="cargo-title" style="font-family: var(--font-mono); color: white; font-size: 1.2rem; margin-bottom: 20px;">CRG-WAITING</p>
                        
                        <div class="timeline" id="cargo-timeline" style="flex-direction: column; max-width: 100%; margin: 0;">
                            <!-- Timeline nodes injected dynamically -->
                        </div>
                        
                        <button class="btn-cyber" id="btn-verify-hash" style="margin-top: 20px; width: 100%; border-color: #FFCC00; color: #FFCC00;">VERIFY CRYPTOGRAPHIC INTEGRITY (SHA-256)</button>
                        <div id="hash-result" style="margin-top: 15px; font-family: var(--font-mono); font-size: 0.9rem;"></div>
                    </div>
                </div>
                
                <!-- Generator Module -->
                <div class="glass-panel" style="margin-top: 30px; padding: 30px;">
                    <h3 style="margin-bottom: 20px; color: var(--accent-cyan);">GENERATE QR TAG</h3>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <input type="text" id="new-cargo-name" placeholder="Cargo Description" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,229,255,0.3); color: white;">
                        <select id="new-cargo-base" style="flex: 1; padding: 10px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white;">
                            <option value="Goa">Origin: Goa Depot</option>
                            <option value="Cape Town">Origin: Cape Town</option>
                        </select>
                        <select id="new-cargo-dest" style="flex: 1; padding: 10px; background: rgba(10,17,40,0.9); border: 1px solid rgba(0,229,255,0.3); color: white;">
                            <option value="Bharati">Dest: Bharati</option>
                            <option value="Maitri">Dest: Maitri</option>
                        </select>
                        <button class="btn-cyber" id="btn-generate-qr">GENERATE SECURE TAG</button>
                    </div>
                </div>
            </div>
        `
    };

    const contentArea = document.getElementById('dynamic-content');

    function renderPage() {
        const hash = window.location.hash || '#overview';
        updateSidebar(hash);
        
        if (views[hash]) {
            contentArea.innerHTML = views[hash];
        } else {
            contentArea.innerHTML = `
                <div class="glass-panel" style="padding: 50px; text-align: center;">
                    <i class="fa-solid fa-person-digging" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h2 class="neon-text">MODULE OFFLINE / UNDER CONSTRUCTION</h2>
                    <p style="color: var(--text-muted); margin-top: 10px; font-family: var(--font-mono);">The requested command module (${hash}) is currently isolated.</p>
                </div>
            `;
        }
    }

    // Initialize SPA Router
    window.addEventListener('hashchange', renderPage);
    
    // Initial Render on load
    if(!window.location.hash) {
        window.location.hash = '#overview';
    } else {
        renderPage();
    }
});

    // QR Scanner & Chain of Custody Logic
    document.addEventListener("click", async (e) => {
        if(e.target.id === "btn-manual-lookup") {
            const qrCode = document.getElementById("manual-qr-input").value.trim();
            if(!qrCode) return GlobalUI.showToast("Enter a valid Cargo ID", "error");
            
            try {
                // 1. Fetch Cargo
                const cargoRes = await fetch(`http://localhost:8080/api/cargo/qr/${qrCode}`);
                if(!cargoRes.ok) throw new Error("Cargo not found");
                const cargo = await cargoRes.json();
                
                // 2. Register Scan Event (adds a new hop in the timeline with SHA-256)
                await fetch(`http://localhost:8080/api/cargo/${cargo.id}/scan`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ location: "Scanner Terminal X", notes: "Manual Audit" })
                });

                // 3. Get updated Timeline
                const timeRes = await fetch(`http://localhost:8080/api/cargo/${cargo.id}/timeline`);
                const timeline = await timeRes.json();
                
                // 4. Render
                document.getElementById("custody-panel").style.display = "block";
                document.getElementById("cargo-title").innerText = `${cargo.name} (${cargo.cargoCode})`;
                
                const tlDiv = document.getElementById("cargo-timeline");
                tlDiv.innerHTML = timeline.map(ev => `
                    <div class="timeline-node completed" style="margin-bottom:20px; display:flex; align-items:center; gap:20px; text-align:left;">
                        <div class="timeline-dot" style="margin:0;"><i class="fa-solid fa-check"></i></div>
                        <div>
                            <p style="color:var(--text-main)">${ev.location}</p>
                            <p style="font-size: 0.7rem; color: #00FF66;">${new Date(ev.timestamp).toLocaleString()}</p>
                            <p style="font-size: 0.6rem; color: var(--text-muted);">HASH: ${ev.eventHash ? ev.eventHash.substring(0,16)+"..." : "GENESIS"}</p>
                        </div>
                    </div>
                `).join("");
                
                // Save full timeline for verification
                window.currentTimeline = timeline;
                GlobalUI.showToast("Chain of Custody Retrieved", "success");
            } catch(err) {
                GlobalUI.showToast(err.message, "error");
            }
        }
        
        if(e.target.id === "btn-verify-hash") {
            const tl = window.currentTimeline;
            if(!tl) return;
            const res = document.getElementById("hash-result");
            res.innerHTML = "<span style=\"color:#FFCC00\">Verifying cryptographic hashes...</span>";
            setTimeout(() => {
                let valid = true;
                for(let i=1; i<tl.length; i++) {
                    if(tl[i].previousEventHash !== tl[i-1].eventHash) {
                        valid = false;
                        break;
                    }
                }
                if(valid) {
                    res.innerHTML = "<span style=\"color:#00FF66\"><i class=\"fa-solid fa-shield-check\"></i> INTEGRITY PASS: Cryptographic chain is intact.</span>";
                } else {
                    res.innerHTML = "<span style=\"color:var(--alert-red)\"><i class=\"fa-solid fa-triangle-exclamation\"></i> INTEGRITY FAIL: Chain broken or tampered!</span>";
                }
            }, 800);
        }
    });



    document.addEventListener("click", async (e) => {
        if(e.target.id === "btn-generate-qr") {
            const name = document.getElementById("new-cargo-name").value.trim();
            if(!name) return GlobalUI.showToast("Enter cargo name", "error");
            
            const cargo = {
                cargoCode: "CRG-" + Math.floor(Math.random()*10000),
                name: name,
                category: "EQUIPMENT",
                weight: 50.0,
                priority: "HIGH",
                status: "GOA_DEPOT",
                qrCode: "QR-" + Date.now(),
                description: "Auto-generated from Terminal"
            };

            try {
                const res = await fetch("http://localhost:8080/api/cargo", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(cargo)
                });
                const saved = await res.json();
                GlobalUI.showToast(`Cargo ${saved.cargoCode} Generated!`, "success");
                
                // Add initial event
                await fetch(`http://localhost:8080/api/cargo/${saved.id}/scan`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ location: "Goa Depot (Origin)", notes: "Initial Tagging" })
                });

                document.getElementById("manual-qr-input").value = saved.qrCode;
            } catch(err) {
                GlobalUI.showToast("Backend connection failed", "error");
            }
        }
    });



    // Emergency SOS Logic
    let sosAudioCtx;
    let sosOscillator;
    let sosCountdown;
    
    document.addEventListener('click', async (e) => {
        if(e.target.id === 'btn-trigger-sos') {
            if(!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                GlobalUI.showToast('WARNING: Geolocation requires HTTPS. Using Fallback.', 'error');
            }
            
            // Audio Siren
            try {
                if(!sosAudioCtx) sosAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if(sosAudioCtx.state === 'suspended') await sosAudioCtx.resume();
                
                sosOscillator = sosAudioCtx.createOscillator();
                const gain = sosAudioCtx.createGain();
                
                sosOscillator.type = 'square';
                sosOscillator.frequency.setValueAtTime(400, sosAudioCtx.currentTime);
                sosOscillator.frequency.linearRampToValueAtTime(800, sosAudioCtx.currentTime + 1);
                sosOscillator.frequency.linearRampToValueAtTime(400, sosAudioCtx.currentTime + 2);
                
                sosOscillator.connect(gain);
                gain.connect(sosAudioCtx.destination);
                sosOscillator.start();
                
                // loop sweep
                setInterval(() => {
                    if(sosOscillator) {
                        sosOscillator.frequency.setValueAtTime(400, sosAudioCtx.currentTime);
                        sosOscillator.frequency.linearRampToValueAtTime(800, sosAudioCtx.currentTime + 1);
                        sosOscillator.frequency.linearRampToValueAtTime(400, sosAudioCtx.currentTime + 2);
                    }
                }, 2000);
            } catch(err) {
                console.warn('Audio blocked:', err);
            }
            
            // UI Update
            document.getElementById('sos-default-view').style.display = 'none';
            document.getElementById('sos-active-view').style.display = 'block';
            document.getElementById('sos-map-container').style.display = 'block';
            document.getElementById('app-body').style.animation = 'sos-flash 1s infinite alternate';
            
            // Countdown
            let timeLeft = 3;
            document.getElementById('sos-countdown').innerText = timeLeft;
            sosCountdown = setInterval(async () => {
                timeLeft--;
                if(timeLeft > 0) {
                    document.getElementById('sos-countdown').innerText = timeLeft;
                } else {
                    clearInterval(sosCountdown);
                    document.getElementById('sos-countdown').innerText = 'TRANSMITTING...';
                    await transmitSOS();
                }
            }, 1000);
        }
        
        if(e.target.id === 'btn-cancel-sos') {
            if(sosCountdown) clearInterval(sosCountdown);
            if(sosOscillator) { sosOscillator.stop(); sosOscillator = null; }
            document.getElementById('sos-default-view').style.display = 'block';
            document.getElementById('sos-active-view').style.display = 'none';
            document.getElementById('sos-map-container').style.display = 'none';
            document.getElementById('app-body').style.animation = 'none';
            GlobalUI.showToast('SOS Cancelled', 'info');
        }
    });

    async function transmitSOS() {
        let lat = 'UNKNOWN', lng = 'UNKNOWN';
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true, timeout: 5000});
            });
            lat = pos.coords.latitude.toFixed(4);
            lng = pos.coords.longitude.toFixed(4);
        } catch(err) {
            console.warn('Geo failed:', err);
        }
        
        document.getElementById('sos-countdown').innerText = 'INCIDENT ACTIVE';
        document.getElementById('btn-cancel-sos').innerText = 'MUTE SIREN';
        
        // Post to Backend
        try {
            await fetch('http://localhost:8080/api/alerts/sos', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: 'MAN-DOWN / DISTRESS',
                    message: 'Emergency activated from terminal.',
                    alertType: 'SOS',
                    sourceLocation: lat + ', ' + lng
                })
            });
            GlobalUI.showToast('SOS Broadcasted via VSAT', 'success');
        } catch(err) {
            GlobalUI.showToast('Failed to reach Command. Saving to Offline Queue.', 'error');
        }
    }




// Commander Panel Logic
setTimeout(() => {
    const origTransmit = window.transmitSOS;
    if(origTransmit && !window.transmitPatched) {
        window.transmitPatched = true;
        window.transmitSOS = async function() {
            await origTransmit();
            setTimeout(() => {
                const mapContainer = document.getElementById('sos-map-container');
                const commandHtml = `
                    <div id="sos-command-panel" class="glass-panel" style="margin-top: 20px; padding: 20px; border: 1px solid #FFCC00; text-align: left;">
                        <h4 style="color: #FFCC00; margin-bottom: 15px;"><i class="fa-solid fa-satellite-dish"></i> COMMAND CENTER OVERRIDE</h4>
                        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: white; margin-bottom: 10px;">
                            RECOMMENDED ACTION: Dispatch nearest Traverse Unit (TRV-04). ETA: 45 mins.
                        </p>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-cyber" id="btn-sos-approve" style="border-color: #00FF66; color: #00FF66;">APPROVE SAR</button>
                            <button class="btn-cyber" id="btn-sos-reject" style="border-color: var(--alert-red); color: var(--alert-red);">REJECT (FALSE ALARM)</button>
                        </div>
                    </div>
                `;
                if(mapContainer && !document.getElementById('sos-command-panel')) {
                    mapContainer.insertAdjacentHTML('afterend', commandHtml);
                }
            }, 2000);
        }
    }
}, 1000);

document.addEventListener('click', (e) => {
    if(e.target.id === 'btn-sos-approve') {
        GlobalUI.showToast('Search and Rescue (SAR) Team Dispatched.', 'success');
        document.getElementById('sos-command-panel').innerHTML = '<h4 class="neon-text-red">SAR EN ROUTE - ETA 42 MINS</h4>';
    }
    if(e.target.id === 'btn-sos-reject') {
        GlobalUI.showToast('Incident marked as false alarm.', 'info');
        document.getElementById('sos-command-panel').style.display = 'none';
    }
});

// AI Simulator Event Logic
document.addEventListener('click', async (e) => {
    if(e.target.closest('#btn-run-simulation')) {
        const scenario = document.getElementById('ai-scenario-select').value;
        const station = document.getElementById('ai-station-select').value;
        const duration = parseInt(document.getElementById('ai-duration').value || '7');
        
        const overlay = document.getElementById('ai-overlay');
        const loadingText = document.getElementById('ai-loading-text');
        overlay.style.display = 'flex';
        loadingText.innerText = 'CALCULATING QUANTUM PROBABILITIES...';
        
        try {
            const res = await fetch('http://localhost:8080/api/intelligence/what-if', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: scenario,
                    params: { station: station, duration: duration, days: duration }
                })
            });
            const data = await res.json();
            
            // Artificial delay for visual effect
            setTimeout(() => {
                overlay.style.display = 'none';
                document.getElementById('res-confidence').innerText = data.confidenceInterval || '92.4%';
                document.getElementById('res-affected').innerText = data.affectedItems.length + ' SYSTEMS FLAGED';
                
                const fList = document.getElementById('res-failures');
                fList.innerHTML = '';
                if(data.criticalShortages.length === 0) {
                     fList.innerHTML = '<li><i class="fa-solid fa-check" style="color:#00FF66;"></i> No critical failures detected.</li>';
                } else {
                     data.criticalShortages.forEach(c => {
                         fList.innerHTML += `<li style="margin-bottom:5px;">- ${c}</li>`;
                     });
                }

                const mList = document.getElementById('res-mitigation');
                mList.innerHTML = '';
                data.recommendations.forEach(r => {
                     mList.innerHTML += `<li style="margin-bottom:5px;">- ${r}</li>`;
                });
                
            }, 1500);

        } catch(err) {
            loadingText.innerText = 'CONNECTION ERROR';
            loadingText.style.color = 'var(--alert-red)';
            GlobalUI.showToast('Backend connection failed', 'error');
            setTimeout(() => { overlay.style.display = 'none'; }, 2000);
        }
    }
});
