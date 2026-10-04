const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#cargo-details': `")) {
    console.log("Cargo Details already exists.");
    process.exit(0);
}

const cargoDetailsHTML = `
        '#cargo-details': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #888; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-list-check"></i> GLOBAL LOGISTICS DATABASE</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">MASTER CARGO <span style="font-weight: 700; color: #00E5FF;">MANIFEST</span></h1>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-outline" style="border-color: #333; color: #aaa;"><i class="fa-solid fa-print"></i> PRINT MANIFEST</button>
                        <button class="btn-outline" style="border-color: #00FF66; color: #00FF66; background: rgba(0,255,102,0.05);"><i class="fa-solid fa-download"></i> EXPORT TO CSV</button>
                    </div>
                </div>

                <!-- SEARCH & FILTERS -->
                <div style="display: flex; gap: 15px; margin-bottom: 20px; background: rgba(10,10,10,0.8); border: 1px solid #222; padding: 15px; border-radius: 4px;">
                    <div style="flex: 1; position: relative;">
                        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 15px; top: 12px; color: #00E5FF;"></i>
                        <input type="text" placeholder="Search by RFID, Asset Name, or Container ID..." style="width: 100%; background: #000; border: 1px solid #333; color: #00E5FF; padding: 10px 10px 10px 40px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none; box-sizing: border-box;">
                    </div>
                    <select style="background: #000; border: 1px solid #333; color: #888; padding: 10px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                        <option>ALL CATEGORIES</option>
                        <option>Heavy Machinery</option>
                        <option>Medical/Cold-Chain</option>
                        <option>Hazmat/Fuel</option>
                        <option>Scientific Equipment</option>
                        <option>Provisions</option>
                    </select>
                    <select style="background: #000; border: 1px solid #333; color: #888; padding: 10px 15px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; outline: none;">
                        <option>ALL LOCATIONS</option>
                        <option>MV Vasiliy (Ship)</option>
                        <option>Bharati Station</option>
                        <option>Maitri Station</option>
                        <option>Goa Depot</option>
                    </select>
                </div>

                <!-- MANIFEST TABLE -->
                <div style="flex: 1; background: #0a0a0a; border: 1px solid #222; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Table Header -->
                    <div style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; background: #111; border-bottom: 1px solid #333; padding: 15px; font-family: var(--font-mono); font-size: 10px; color: #888; letter-spacing: 1px;">
                        <div>RFID / BARCODE</div>
                        <div>ASSET DESCRIPTION</div>
                        <div>CATEGORY</div>
                        <div>WEIGHT</div>
                        <div>CURRENT LOCATION</div>
                        <div>STATUS</div>
                        <div style="text-align: right;">ACTION</div>
                    </div>

                    <!-- Table Body (Scrollable) -->
                    <div style="flex: 1; overflow-y: auto;">
                        
                        <!-- Row 1 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-X992</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">PistenBully 400 W Polar (Tracked Vehicle)</div>
                            <div style="color: #aaa; font-size: 11px;">Heavy Machinery</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">10,500 kg</div>
                            <div style="color: #00E5FF; font-size: 12px;"><i class="fa-solid fa-ship" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Deck B</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: 1px solid rgba(0,229,255,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">STOWED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 2 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-M041</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">O-Negative Blood Plasma (Cold-Chain Box)</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">45 kg</div>
                            <div style="color: #00FF66; font-size: 12px;"><i class="fa-solid fa-igloo" style="margin-right:5px; font-size:10px;"></i> Bharati Base - Sickbay</div>
                            <div><span style="background: rgba(0, 255, 102, 0.1); color: #00FF66; border: 1px solid rgba(0,255,102,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">DEPLOYED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 3 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-F881</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Antarctic Aviation Fuel (Jet A-1 Drum)</div>
                            <div style="color: #aaa; font-size: 11px;">Hazmat/Fuel</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">210 kg</div>
                            <div style="color: #F39C12; font-size: 12px;"><i class="fa-solid fa-helicopter" style="margin-right:5px; font-size:10px;"></i> Sling Ops (Transit)</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); color: #F39C12; border: 1px solid rgba(243,156,18,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">IN-TRANSIT</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 4 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-S440</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Ice-Core Drilling Rig Mk4 (Module A)</div>
                            <div style="color: #aaa; font-size: 11px;">Scientific Equipment</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">3,200 kg</div>
                            <div style="color: #888; font-size: 12px;"><i class="fa-solid fa-anchor" style="margin-right:5px; font-size:10px;"></i> Goa Port (Dock 4)</div>
                            <div><span style="background: rgba(255, 255, 255, 0.05); color: #888; border: 1px solid #555; font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">PENDING LOAD</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 5 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#FF003C;"></i>RFID-H019</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Lithium-Ion Battery Bank (Unstable Temp)</div>
                            <div style="color: #aaa; font-size: 11px;">Power/Hazmat</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">850 kg</div>
                            <div style="color: #FF003C; font-size: 12px;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Quarantine Zone</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); color: #FF003C; border: 1px solid rgba(255,0,60,0.4); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px; animation: pulse 2s infinite;">QUARANTINED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                        <!-- Row 6 -->
                        <div class="manifest-row" style="display: grid; grid-template-columns: 1.5fr 3fr 1.5fr 1fr 2fr 1fr 0.5fr; border-bottom: 1px solid #1a1a1a; padding: 15px; align-items: center; transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='transparent'">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;"><i class="fa-solid fa-barcode" style="margin-right:8px; color:#555;"></i>RFID-R102</div>
                            <div style="color: #fff; font-size: 13px; font-weight: 500;">Winter Rations Pallet (Dry Food - 6 Months)</div>
                            <div style="color: #aaa; font-size: 11px;">Provisions</div>
                            <div style="color: #ddd; font-family: var(--font-mono); font-size: 12px;">500 kg</div>
                            <div style="color: #00E5FF; font-size: 12px;"><i class="fa-solid fa-ship" style="margin-right:5px; font-size:10px;"></i> MV Vasiliy - Deck C</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: 1px solid rgba(0,229,255,0.3); font-family: var(--font-mono); font-size: 9px; padding: 3px 6px; border-radius: 2px;">STOWED</span></div>
                            <div style="text-align: right; color: #555;"><i class="fa-solid fa-chevron-right"></i></div>
                        </div>

                    </div>
                    
                    <!-- Table Footer / Pagination -->
                    <div style="background: #050505; border-top: 1px solid #333; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #666; font-family: var(--font-mono); font-size: 10px;">SHOWING 1 - 6 OF 4,290 SCANNED ASSETS</div>
                        <div style="display: flex; gap: 5px;">
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">PREV</button>
                            <button style="background: rgba(0,229,255,0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 5px 10px; border-radius: 4px; cursor: pointer;">1</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">2</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">3</button>
                            <button style="background: #111; border: 1px solid #333; color: #888; padding: 5px 10px; border-radius: 4px; cursor: pointer;">NEXT</button>
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
    appJS = pre + cargoDetailsHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Cargo Details injected successfully!");
} else {
    console.log("Could not find anchor to inject cargo details.");
}
