const fs = require('fs');
let appJS = fs.readFileSync('js/app.js', 'utf8');

const cryoWidget = `
                    <!-- Cryo-Chain Analytics Widget -->
                    <div style="background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid #374151; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; margin-top: 20px;">
                        
                        <!-- Header Section -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #374151; padding-bottom: 12px;">
                            <h3 style="color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; margin: 0; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-solid fa-snowflake" style="color: #00D2FF;"></i> CRYO-CHAIN ANALYTICS
                            </h3>
                            <div style="display: flex; align-items: center; gap: 6px; font-family: 'Roboto Mono', monospace; font-size: 10px; color: #aaa;">
                                <div style="width: 8px; height: 8px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 8px #EF4444; animation: blink 1.5s infinite;"></div>
                                LIVE TELEMETRY
                            </div>
                        </div>

                        <!-- Environment Status Card -->
                        <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                            <div style="flex: 1; background: rgba(0,0,0,0.3); border-radius: 6px; padding: 12px; border: 1px solid #1F2937;">
                                <div style="color: #6B7280; font-size: 10px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Ambient Temp</div>
                                <div style="color: #00D2FF; font-size: 18px; font-weight: 700; font-family: 'Roboto Mono', monospace;">-60°C</div>
                            </div>
                            <div style="flex: 1; background: rgba(0,0,0,0.3); border-radius: 6px; padding: 12px; border: 1px solid #1F2937;">
                                <div style="color: #6B7280; font-size: 10px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Wind Chill</div>
                                <div style="color: #F59E0B; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif;">Severe Blizzard</div>
                            </div>
                        </div>

                        <!-- Thermal Risk Gauge -->
                        <div style="margin-bottom: 25px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-family: 'Inter', sans-serif;">
                                <span style="color: #D1D5DB; font-size: 12px; font-weight: 500;">Average Degradation Risk</span>
                                <span style="color: #EF4444; font-size: 12px; font-weight: 700; font-family: 'Roboto Mono', monospace;">78%</span>
                            </div>
                            <div style="height: 8px; background: #1F2937; border-radius: 4px; overflow: hidden; display: flex;">
                                <div style="width: 40%; background: #10B981; height: 100%;"></div>
                                <div style="width: 35%; background: #F59E0B; height: 100%;"></div>
                                <div style="width: 3%; background: #EF4444; height: 100%; box-shadow: 0 0 10px #EF4444; animation: pulseRed 2s infinite;"></div>
                            </div>
                        </div>

                        <!-- Live Asset Offloading List -->
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <!-- Asset 1 -->
                            <div style="background: rgba(0,0,0,0.2); border: 1px solid #374151; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="color: #fff; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 4px;">[QR-882] Insulin Batch A</div>
                                    <div style="color: #9CA3AF; font-size: 10px; font-family: 'Roboto Mono', monospace;"><i class="fa-regular fa-clock"></i> Exp: 01h 12m</div>
                                </div>
                                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #EF4444; color: #EF4444; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: 'Inter', sans-serif; text-align: center;">
                                    CRITICAL<br/><span style="font-size: 8px; font-weight: 400;">10 mins to freeze</span>
                                </div>
                            </div>
                            <!-- Asset 2 -->
                            <div style="background: rgba(0,0,0,0.2); border: 1px solid #374151; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="color: #fff; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 4px;">[QR-890] Blood Plasma</div>
                                    <div style="color: #9CA3AF; font-size: 10px; font-family: 'Roboto Mono', monospace;"><i class="fa-regular fa-clock"></i> Exp: 00h 45m</div>
                                </div>
                                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #F59E0B; color: #F59E0B; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: 'Inter', sans-serif; text-align: center;">
                                    WARNING
                                </div>
                            </div>
                            <!-- Asset 3 -->
                            <div style="background: rgba(0,0,0,0.2); border: 1px solid #374151; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="color: #fff; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600; margin-bottom: 4px;">[QR-901] Viral Vectors</div>
                                    <div style="color: #9CA3AF; font-size: 10px; font-family: 'Roboto Mono', monospace;"><i class="fa-regular fa-clock"></i> Exp: 00h 10m</div>
                                </div>
                                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10B981; color: #10B981; padding: 4px 14px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: 'Inter', sans-serif; text-align: center;">
                                    SAFE
                                </div>
                            </div>
                        </div>
                    </div>
                    <style>
                        @keyframes pulseRed {
                            0% { opacity: 0.6; box-shadow: 0 0 5px #EF4444; }
                            50% { opacity: 1; box-shadow: 0 0 15px #EF4444; }
                            100% { opacity: 0.6; box-shadow: 0 0 5px #EF4444; }
                        }
                    </style>`;

appJS = appJS.replace(
    /<!-- Alerts \/ Activity -->[\s\S]*?<div style="display: flex; flex-direction: column; gap: 15px;">[\s\S]*?<\/div>\s*<\/div>/,
    match => match + '\n' + cryoWidget
);

fs.writeFileSync('js/app.js', appJS);
console.log("Cryo-Chain Analytics widget injected!");
