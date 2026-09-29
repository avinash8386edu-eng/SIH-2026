const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

if (appJS.includes("'#station-inventory': `")) {
    console.log("Station Inventory already exists.");
    process.exit(0);
}

const inventoryHTML = `
        '#station-inventory': \`
            <div class="him-setu-theme" style="height: 100vh; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; padding: 20px 30px; box-sizing: border-box; font-family: 'Inter', sans-serif; background: #050505;">
                
                <!-- HEADER & STATION SWITCHER -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); padding-bottom: 15px;">
                    <div>
                        <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; margin-bottom: 5px;"><i class="fa-solid fa-warehouse"></i> RESOURCE MANAGEMENT (WINTER-OVER)</div>
                        <h1 style="color: #fff; font-size: 2rem; letter-spacing: 2px; font-weight: 400; margin: 0; text-transform: uppercase;">STATION <span style="font-weight: 700; color: #00E5FF;">INVENTORY</span></h1>
                    </div>
                    
                    <!-- Station Toggle -->
                    <div style="display: flex; gap: 0; border: 1px solid #333; border-radius: 4px; overflow: hidden;">
                        <button style="background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: none; padding: 10px 20px; font-family: var(--font-mono); font-weight: bold; font-size: 12px; cursor: pointer;">BHARATI STATION</button>
                        <button style="background: #000; color: #888; border: none; border-left: 1px solid #333; padding: 10px 20px; font-family: var(--font-mono); font-weight: bold; font-size: 12px; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#111'" onmouseout="this.style.background='#000'">MAITRI STATION</button>
                    </div>
                </div>

                <!-- AI PREDICTIVE ALERT BANNER -->
                <div style="background: rgba(255, 0, 60, 0.05); border: 1px solid rgba(255,0,60,0.4); border-left: 4px solid #FF003C; padding: 15px; border-radius: 4px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #FF003C; font-size: 24px; animation: pulse 2s infinite;"></i>
                        <div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 13px; font-weight: bold; letter-spacing: 1px;">AI PREDICTION: WINTER-OVER SHORTAGE DETECTED</div>
                            <div style="color: #aaa; font-size: 11px; margin-top: 3px;">3 Critical items will deplete before the next scheduled vessel arrival (120 Days). Re-order required immediately.</div>
                        </div>
                    </div>
                    <button style="background: #FF003C; border: none; color: #fff; padding: 10px 15px; font-family: var(--font-mono); font-size: 11px; font-weight: bold; border-radius: 2px; cursor: pointer;">GENERATE RE-ORDER INDENT</button>
                </div>

                <!-- KPI DASHBOARD -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;">
                    
                    <!-- KPI 1: Fuel -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">ANTARCTIC DIESEL (JET A-1)</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">450,000</span>
                            <span style="color: #00E5FF; font-family: var(--font-mono); font-size: 12px;">LITERS</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Tank Capacity (70%)</span>
                            <span style="color: #00E5FF;">EST: 14 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 70%; background: #00E5FF; box-shadow: 0 0 10px #00E5FF;"></div>
                        </div>
                    </div>

                    <!-- KPI 2: Food -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">DRY RATIONS & PROVISIONS</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">14,500</span>
                            <span style="color: #00FF66; font-family: var(--font-mono); font-size: 12px;">KG</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Winter-Over Safe Line</span>
                            <span style="color: #00FF66;">EST: 18 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 85%; background: #00FF66; box-shadow: 0 0 10px #00FF66;"></div>
                        </div>
                    </div>

                    <!-- KPI 3: Medical -->
                    <div style="background: rgba(10,10,10,0.8); border: 1px solid #222; border-radius: 4px; padding: 20px; position: relative; overflow: hidden;">
                        <div style="color: #888; font-family: var(--font-mono); font-size: 10px; margin-bottom: 15px;">MEDICAL & LIFE SAVING</div>
                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 15px;">
                            <span style="color: #fff; font-size: 28px; font-weight: 700;">85</span>
                            <span style="color: #FF003C; font-family: var(--font-mono); font-size: 12px;">CRITICAL KITS</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9px; color: #666; margin-bottom: 5px;">
                            <span>Stock Level (Warning)</span>
                            <span style="color: #FF003C;">EST: 2 MONTHS LEFT</span>
                        </div>
                        <div style="height: 4px; background: #222; border-radius: 2px;">
                            <div style="height: 100%; width: 25%; background: #FF003C; box-shadow: 0 0 10px #FF003C;"></div>
                        </div>
                    </div>

                </div>

                <!-- DETAILED INVENTORY GRID -->
                <div style="flex: 1; background: #0a0a0a; border: 1px solid #222; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column;">
                    
                    <!-- Table Toolbar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #222; background: #0f0f0f;">
                        <div style="display: flex; gap: 10px;">
                            <select style="background: #000; border: 1px solid #333; color: #888; padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none;">
                                <option>CATEGORY: ALL</option>
                                <option>Fuel & Lubes</option>
                                <option>Food & Rations</option>
                                <option>Medical</option>
                                <option>Vehicle Spares</option>
                            </select>
                            <select style="background: #000; border: 1px solid #333; color: #888; padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none;">
                                <option>STATUS: ALL</option>
                                <option>Optimal</option>
                                <option>Low Stock</option>
                                <option>Critical</option>
                                <option>Expired/Spoiled</option>
                            </select>
                        </div>
                        <div style="position: relative;">
                            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 10px; top: 9px; color: #555; font-size: 12px;"></i>
                            <input type="text" placeholder="Search item or SKU..." style="background: #000; border: 1px solid #333; color: #00E5FF; padding: 8px 8px 8px 30px; border-radius: 4px; font-family: var(--font-mono); font-size: 11px; outline: none; width: 250px;">
                        </div>
                    </div>

                    <!-- Table Header -->
                    <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; background: #111; border-bottom: 1px solid #333; padding: 12px 15px; font-family: var(--font-mono); font-size: 9px; color: #888; letter-spacing: 1px;">
                        <div>ITEM CODE</div>
                        <div>DESCRIPTION</div>
                        <div>CATEGORY</div>
                        <div>QTY (QoH)</div>
                        <div>MIN REQ.</div>
                        <div>DEPLETION EST.</div>
                        <div>HEALTH / EXPIRY</div>
                    </div>

                    <!-- Table Body (Scrollable) -->
                    <div style="flex: 1; overflow-y: auto;">
                        
                        <!-- Row: Critical Alert -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center; background: rgba(255, 0, 60, 0.03);">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px;">MED-8042</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Broad-Spectrum Antibiotics (Amoxicillin)</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">120 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">500 Units</div>
                            <div style="color: #FF003C; font-size: 11px;"><i class="fa-solid fa-clock"></i> 45 Days</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">CRITICAL SHORTAGE</span></div>
                        </div>

                        <!-- Row: Critical Alert 2 -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center; background: rgba(255, 0, 60, 0.03);">
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px;">VSP-T220</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">PistenBully Snow Tracks (Replacement)</div>
                            <div style="color: #aaa; font-size: 11px;">Vehicle Spares</div>
                            <div style="color: #FF003C; font-family: var(--font-mono); font-size: 11px; font-weight: bold;">1 Set</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">4 Sets</div>
                            <div style="color: #FF003C; font-size: 11px;"><i class="fa-solid fa-clock"></i> Next Breakdown</div>
                            <div><span style="background: rgba(255, 0, 60, 0.1); border: 1px solid #FF003C; color: #FF003C; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">CRITICAL SHORTAGE</span></div>
                        </div>

                        <!-- Row: Optimal -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">FUE-0010</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Antarctic Diesel (Jet A-1) Bulk</div>
                            <div style="color: #aaa; font-size: 11px;">Fuel & Lubes</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">450,000 L</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">200,000 L</div>
                            <div style="color: #888; font-size: 11px;">> 14 Months</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">OPTIMAL</span></div>
                        </div>

                        <!-- Row: Optimal -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">PRO-2930</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Dehydrated Vegetables & Pulses</div>
                            <div style="color: #aaa; font-size: 11px;">Food & Rations</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">8,200 KG</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">4,000 KG</div>
                            <div style="color: #888; font-size: 11px;">> 18 Months</div>
                            <div><span style="background: rgba(0, 229, 255, 0.1); border: 1px solid #00E5FF; color: #00E5FF; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">OPTIMAL</span></div>
                        </div>

                        <!-- Row: Warning -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">SCI-1042</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Weather Balloon Helium Canisters</div>
                            <div style="color: #aaa; font-size: 11px;">Scientific</div>
                            <div style="color: #F39C12; font-family: var(--font-mono); font-size: 11px;">40 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">50 Units</div>
                            <div style="color: #F39C12; font-size: 11px;">90 Days</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); border: 1px solid #F39C12; color: #F39C12; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">LOW STOCK</span></div>
                        </div>

                        <!-- Row: Expiring -->
                        <div style="display: grid; grid-template-columns: 1fr 3fr 1.5fr 1fr 1fr 1.5fr 1.5fr; border-bottom: 1px solid #1a1a1a; padding: 12px 15px; align-items: center;">
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">MED-9930</div>
                            <div style="color: #fff; font-size: 12px; font-weight: 500;">Epinephrine Auto-Injectors</div>
                            <div style="color: #aaa; font-size: 11px;">Medical</div>
                            <div style="color: #00E5FF; font-family: var(--font-mono); font-size: 11px;">45 Units</div>
                            <div style="color: #555; font-family: var(--font-mono); font-size: 11px;">20 Units</div>
                            <div style="color: #888; font-size: 11px;">Ample Supply</div>
                            <div><span style="background: rgba(243, 156, 18, 0.1); border: 1px solid #F39C12; color: #F39C12; padding: 2px 6px; font-family: var(--font-mono); font-size: 9px; border-radius: 2px;">EXPIRING SOON</span></div>
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
    appJS = pre + inventoryHTML + post;
    fs.writeFileSync('js/app.js', appJS);
    console.log("Station Inventory injected successfully!");
} else {
    console.log("Could not find anchor to inject station inventory.");
}
