const fs = require('fs');

let content = fs.readFileSync('js/app.js', 'utf-8');

// Define the updated exact new DHRUV overview view matching the 2nd screenshot
const newOverviewView = `        '#overview': \`
            <div class="dhruv-dashboard">
                <div class="dash-header">
                    <div class="dash-meta"><span class="green-dot"></span> NCPOR OPERATIONAL COMMAND • 46TH ISEA</div>
                    <div class="dash-title-row">
                        <div>
                            <h1 class="serif-title">EXPEDITION COMMAND CENTER</h1>
                            <p class="dash-subtitle">A live operational picture across people, cargo, assets and missions.</p>
                        </div>
                        <div class="dash-actions">
                            <button class="btn-outline"><i class="fa-solid fa-map"></i> Operations Map</button>
                            <button class="btn-outline">Scan QR</button>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-col">
                        <div class="stat-header"><span>ACTIVE PERSONNEL</span> <span>DEPLOYED</span></div>
                        <div class="stat-bar"></div>
                        <div class="stat-value" id="stat-personnel" style="font-size:2rem; color:white;">\${personnelCount}</div>
                        <a href="#personnel" class="stat-link">View Details &rarr;</a>
                    </div>
                    <div class="stat-col">
                        <div class="stat-header"><span>TRACKED CARGO</span> <span>TRACKED</span></div>
                        <div class="stat-bar"></div>
                        <div class="stat-value" id="stat-cargo" style="font-size:2rem; color:white;">\${cargoCount}</div>
                        <a href="#cargo-dashboard" class="stat-link">View Details &rarr;</a>
                    </div>
                    <div class="stat-col">
                        <div class="stat-header"><span>OPERATIONAL ASSETS</span> <span>OPERATIONAL</span></div>
                        <div class="stat-bar"></div>
                        <div class="stat-value" id="stat-assets" style="font-size:2rem; color:white;">Unavailable</div>
                        <a href="#all-assets" class="stat-link">View Details &rarr;</a>
                    </div>
                    <div class="stat-col">
                        <div class="stat-header"><span>EXPEDITION READINESS</span> <span>READY</span></div>
                        <div class="stat-bar"></div>
                        <div class="stat-value" id="stat-readiness" style="font-size:2.2rem; color:white; margin-bottom: 2px;">0%</div>
                        <div style="font-size:10px; color:#666; margin-bottom:10px; flex: 1;">Life Support & Reserves</div>
                        <a href="#planner" class="stat-link">View Details &rarr;</a>
                    </div>
                    <div class="stat-col">
                        <div class="stat-header"><span>ACTIVE MISSIONS</span> <span>ACTIVE</span></div>
                        <div class="stat-bar"></div>
                        <div class="stat-value" id="stat-missions" style="font-size:2rem; color:white;">\${missionsCount}</div>
                        <a href="#planner" class="stat-link">View Details &rarr;</a>
                    </div>
                </div>

                <div class="attention-row">
                    <div style="color:var(--alert-red); font-weight:600; font-size:12px; letter-spacing:1px;"><span style="color:var(--alert-red);">●</span> ATTENTION REQUIRED</div>
                    <div style="color:#666; font-size:12px;">0 Items Requiring Action</div>
                </div>

                <div class="dashboard-bottom" style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
                    <div class="telemetry-col">
                        
                        <div class="station-card">
                            <div class="st-header">
                                <h5>NCPOR Goa</h5>
                                <span class="st-status"><span class="green-dot"></span> OPERATIONAL</span>
                            </div>
                            <p class="st-sub">Headquarters, Vasco da Gama, Goa, India</p>
                            <div class="st-metrics">
                                <div><i class="fa-solid fa-temperature-half"></i> TEMP<br><span>24°C</span></div>
                                <div><i class="fa-solid fa-wind"></i> WIND<br><span>8 kts</span></div>
                                <div><i class="fa-solid fa-eye"></i> VIS<br><span>10 km</span></div>
                            </div>
                            <div class="st-footer">
                                <span>Occupancy: 12/150</span>
                                <span style="color:#555;">Blizzard Risk: NONE</span>
                            </div>
                        </div>
                        
                        <div class="station-card">
                            <div class="st-header">
                                <h5>Cape Town Transit Hub</h5>
                                <span class="st-status"><span class="green-dot"></span> OPERATIONAL</span>
                            </div>
                            <p class="st-sub">Port of Cape Town Logistics Base, South Africa</p>
                            <div class="st-metrics">
                                <div><i class="fa-solid fa-temperature-half"></i> TEMP<br><span>24°C</span></div>
                                <div><i class="fa-solid fa-wind"></i> WIND<br><span>8 kts</span></div>
                                <div><i class="fa-solid fa-eye"></i> VIS<br><span>10 km</span></div>
                            </div>
                            <div class="st-footer">
                                <span>Occupancy: 12/25</span>
                                <span style="color:#555;">Blizzard Risk: NONE</span>
                            </div>
                        </div>
                        
                        <div class="station-card">
                            <div class="st-header">
                                <h5>Maitri Station</h5>
                                <span class="st-status"><span class="green-dot"></span> OPERATIONAL</span>
                            </div>
                            <p class="st-sub">Schirmacher Oasis, Queen Maud Land, Antarctica</p>
                            <div class="st-metrics">
                                <div><i class="fa-solid fa-temperature-half"></i> TEMP<br><span>-22°C</span></div>
                                <div><i class="fa-solid fa-wind"></i> WIND<br><span>28 kts</span></div>
                                <div><i class="fa-solid fa-eye"></i> VIS<br><span>10 km</span></div>
                            </div>
                            <div class="st-footer">
                                <span>Occupancy: 38/65</span>
                                <span style="color:#555;">Blizzard Risk: NONE</span>
                            </div>
                        </div>

                        <div class="station-card">
                            <div class="st-header">
                                <h5>Bharati Station</h5>
                                <span class="st-status"><span class="green-dot"></span> OPERATIONAL</span>
                            </div>
                            <p class="st-sub">Larsemann Hills, East Antarctica</p>
                            <div class="st-metrics">
                                <div><i class="fa-solid fa-temperature-half"></i> TEMP<br><span>-19°C</span></div>
                                <div><i class="fa-solid fa-wind"></i> WIND<br><span>22 kts</span></div>
                                <div><i class="fa-solid fa-eye"></i> VIS<br><span>10 km</span></div>
                            </div>
                            <div class="st-footer">
                                <span>Occupancy: 47/72</span>
                                <span style="color:#555;">Blizzard Risk: NONE</span>
                            </div>
                        </div>

                        <div class="station-card">
                            <div class="st-header">
                                <h5>Field Camp Alpha</h5>
                                <span class="st-status"><span class="green-dot"></span> OPERATIONAL</span>
                            </div>
                            <p class="st-sub">Queen Maud Land Deep Core Site, Antarctica</p>
                            <div class="st-metrics">
                                <div><i class="fa-solid fa-temperature-half"></i> TEMP<br><span>-35°C</span></div>
                                <div><i class="fa-solid fa-wind"></i> WIND<br><span>45 kts</span></div>
                                <div><i class="fa-solid fa-eye"></i> VIS<br><span>2 km</span></div>
                            </div>
                            <div class="st-footer">
                                <span>Occupancy: 12/12</span>
                                <span style="color:#555;">Blizzard Risk: ELEVATED</span>
                            </div>
                        </div>

                    </div>
                    
                    <div class="cargo-col">
                        <!-- Left blank on purpose to match screenshot's black void on the right half -->
                    </div>
                </div>
            </div>
        \`,`;

// Extract and replace the overview view
const overviewStart = content.indexOf("'#overview':");
const intelligenceStart = content.indexOf("'#intelligence':");

if (overviewStart !== -1 && intelligenceStart !== -1) {
    content = content.substring(0, overviewStart) + newOverviewView + '\n        ' + content.substring(intelligenceStart);
    fs.writeFileSync('js/app.js', content, 'utf-8');
    console.log("Successfully replaced overview!");
} else {
    console.log("Could not find overview or intelligence anchors.");
}
