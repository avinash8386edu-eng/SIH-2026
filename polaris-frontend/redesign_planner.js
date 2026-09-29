const fs = require('fs');

let appContent = fs.readFileSync('js/app.js', 'utf-8');

const newPlannerHTML = `        '#planner': \`
            <div class="dhruv-dashboard" style="display: flex; flex-direction: column; height: 100%;">
                <div class="dash-header" style="flex-shrink: 0;">
                    <div class="dash-meta" style="display:flex; justify-content:space-between; margin-bottom: 15px;">
                        <div style="color: #666; font-family: var(--font-mono); letter-spacing: 1px;"><i class="fa-solid fa-network-wired"></i> POLARIS TACTICAL SEQUENCER</div>
                        <div style="color: var(--accent-cyan); border: 1px solid rgba(0, 229, 255, 0.3); padding: 4px 12px; border-radius: 4px; font-size: 11px; letter-spacing: 1px; background: rgba(0,229,255,0.05);">
                            <i class="fa-solid fa-satellite"></i> LIVE TELEMETRY SYNC
                        </div>
                    </div>
                    <div class="dash-title-row" style="margin-bottom: 20px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px;">
                        <div>
                            <h1 class="serif-title" style="font-family: var(--font-sans); font-weight: 600; font-size: 2rem; letter-spacing: 1px;">MISSION SEQUENCER & RISK MATRIX</h1>
                            <p class="dash-subtitle" style="font-family: var(--font-mono); font-size: 12px; margin-top: 5px;">Kanban-based timeline enforcement with AI-driven constraint guards.</p>
                        </div>
                        <div class="dash-actions">
                            <button class="btn-cyber" onclick="window.location.hash='#intelligence'" style="background: rgba(0,229,255,0.1); border-color: var(--accent-cyan); color: var(--accent-cyan); box-shadow: 0 0 10px rgba(0,229,255,0.2);"><i class="fa-solid fa-brain"></i> LAUNCH AI SOLVER</button>
                        </div>
                    </div>
                </div>

                <!-- Custom Layout to avoid plagiarism: Kanban + Right Sidebar -->
                <div class="planner-container" style="display: flex; gap: 30px; flex: 1; overflow: hidden; padding-bottom: 10px;">
                    
                    <!-- Left: Kanban Swimlanes (Schedule) -->
                    <div class="schedule-board" style="flex: 7; display: flex; gap: 20px; overflow-x: auto; padding-right: 10px;">
                        
                        <!-- Stage 1 -->
                        <div class="swimlane" style="min-width: 320px; background: #030303; border: 1px solid #1a1a1a; border-radius: 8px; display: flex; flex-direction: column;">
                            <div class="lane-header" style="padding: 15px; border-bottom: 1px solid #222; background: rgba(0,255,102,0.05);">
                                <h5 style="color: var(--success-green); font-family: var(--font-mono); letter-spacing: 1px; font-size: 13px;"><i class="fa-solid fa-check-double"></i> STAGE 01: MOBILIZATION</h5>
                                <p style="font-size: 11px; color: #666; margin-top: 5px;">15 Oct - 15 Nov</p>
                            </div>
                            <div class="lane-body" style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                                
                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--success-green);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Medical Clearance Sign-off</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">AIIMS Medical Board</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px dashed #222; padding-top: 10px;">
                                        <span style="color: var(--success-green);"><i class="fa-solid fa-user-shield"></i> Cleared</span>
                                        <span style="background: #111; color: var(--text-muted); padding: 3px 6px; border-radius: 3px; font-family: var(--font-mono);">100%</span>
                                    </div>
                                </div>

                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--success-green);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Cold-Region Survival Training</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">Auli, Uttarakhand</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px dashed #222; padding-top: 10px;">
                                        <span style="color: var(--success-green);"><i class="fa-solid fa-person-snowboarding"></i> Certified</span>
                                        <span style="background: #111; color: var(--text-muted); padding: 3px 6px; border-radius: 3px; font-family: var(--font-mono);">100%</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        <!-- Stage 2 -->
                        <div class="swimlane" style="min-width: 320px; background: #030303; border: 1px solid #1a1a1a; border-radius: 8px; display: flex; flex-direction: column;">
                            <div class="lane-header" style="padding: 15px; border-bottom: 1px solid #222; background: rgba(0,255,102,0.05);">
                                <h5 style="color: var(--success-green); font-family: var(--font-mono); letter-spacing: 1px; font-size: 13px;"><i class="fa-solid fa-check-double"></i> STAGE 02: CARGO STAGING</h5>
                                <p style="font-size: 11px; color: #666; margin-top: 5px;">16 Nov - 04 Dec</p>
                            </div>
                            <div class="lane-body" style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                                
                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--success-green);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Hazardous Material Booking</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">DG Shipping India</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px dashed #222; padding-top: 10px;">
                                        <span style="color: var(--success-green);"><i class="fa-solid fa-file-signature"></i> Approved</span>
                                        <span style="background: #111; color: var(--text-muted); padding: 3px 6px; border-radius: 3px; font-family: var(--font-mono);">100%</span>
                                    </div>
                                </div>

                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--success-green);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Cape Town Harbor Intake</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">Port Agent Sync</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px dashed #222; padding-top: 10px;">
                                        <span style="color: var(--success-green);"><i class="fa-solid fa-anchor"></i> Secured</span>
                                        <span style="background: #111; color: var(--text-muted); padding: 3px 6px; border-radius: 3px; font-family: var(--font-mono);">100%</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- Stage 3 -->
                        <div class="swimlane" style="min-width: 320px; background: #030303; border: 1px solid #1a1a1a; border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(255,204,0,0.05);">
                            <div class="lane-header" style="padding: 15px; border-bottom: 1px solid #222; background: rgba(255,204,0,0.05);">
                                <h5 style="color: #FFCC00; font-family: var(--font-mono); letter-spacing: 1px; font-size: 13px;"><i class="fa-solid fa-spinner fa-spin"></i> STAGE 03: ICE MOORING</h5>
                                <p style="font-size: 11px; color: #666; margin-top: 5px;">05 Dec - 28 Dec</p>
                            </div>
                            <div class="lane-body" style="padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                                
                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid #FFCC00;">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Ice-breaking approach</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">Current Distance: 14nm</p>
                                    
                                    <div style="height: 4px; background: #222; border-radius: 2px; margin-bottom: 8px; overflow: hidden;">
                                        <div style="height: 100%; width: 85%; background: #FFCC00; box-shadow: 0 0 5px #FFCC00;"></div>
                                    </div>

                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
                                        <span style="color: #FFCC00;"><i class="fa-solid fa-ship"></i> En Route</span>
                                        <span style="color: #FFCC00; font-family: var(--font-mono);">85%</span>
                                    </div>
                                </div>

                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--accent-cyan);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Aerial crack reconnaissance</h6>
                                    <p style="font-size: 11px; color: #666; margin-bottom: 12px; font-family: var(--font-mono);">Ka-32 Helicopters</p>
                                    
                                    <div style="height: 4px; background: #222; border-radius: 2px; margin-bottom: 8px; overflow: hidden;">
                                        <div style="height: 100%; width: 30%; background: var(--accent-cyan); box-shadow: 0 0 5px var(--accent-cyan);"></div>
                                    </div>

                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px;">
                                        <span style="color: var(--accent-cyan);"><i class="fa-solid fa-helicopter"></i> In Progress</span>
                                        <span style="color: var(--accent-cyan); font-family: var(--font-mono);">30%</span>
                                    </div>
                                </div>

                                <div class="task-card" style="background: #0a0a0a; border: 1px solid #222; padding: 15px; border-radius: 6px; border-left: 3px solid var(--alert-red);">
                                    <h6 style="color: #ddd; font-size: 13px; margin-bottom: 8px; font-weight: 500;">Establish fuel pumping hose</h6>
                                    <p style="font-size: 11px; color: var(--alert-red); margin-bottom: 12px; font-family: var(--font-mono);">Waiting for wind window</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; border-top: 1px dashed #222; padding-top: 10px;">
                                        <span style="color: var(--alert-red);"><i class="fa-solid fa-triangle-exclamation"></i> Blocked</span>
                                        <span style="background: #111; color: var(--text-muted); padding: 3px 6px; border-radius: 3px; font-family: var(--font-mono);">0%</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    
                    <!-- Right: Constraints Matrix -->
                    <div class="constraints-sidebar" style="flex: 3; background: #040404; border: 1px solid #1a1a1a; border-radius: 8px; display: flex; flex-direction: column;">
                        <div style="padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h5 style="color: #fff; font-family: var(--font-mono); letter-spacing: 1px; font-size: 13px;">AI CONSTRAINT MATRIX</h5>
                                <p style="font-size: 11px; color: #666; margin-top: 5px;">Real-time risk enforcement</p>
                            </div>
                            <i class="fa-solid fa-shield-halved" style="color: #333; font-size: 24px;"></i>
                        </div>
                        <div style="padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                            
                            <!-- Constraint Item -->
                            <div class="constraint-item" style="padding: 15px; background: #080808; border: 1px solid #222; border-radius: 6px; position: relative; overflow: hidden;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #FFCC00;"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: #FFCC00; font-size: 13px; font-weight: 500;"><i class="fa-solid fa-wind" style="width: 20px;"></i> Katabatic Winds</span>
                                    <span style="font-size: 10px; color: #FFCC00; background: rgba(255,204,0,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">VIOLATION</span>
                                </div>
                                <p style="font-size: 12px; color: #888; line-height: 1.5;">Sustained >35 kts. Ka-32 helicopters grounded. Flight envelopes restricted.</p>
                            </div>

                            <div class="constraint-item" style="padding: 15px; background: #080808; border: 1px solid #222; border-radius: 6px; position: relative; overflow: hidden;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--alert-red);"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--alert-red); font-size: 13px; font-weight: 500;"><i class="fa-solid fa-gas-pump" style="width: 20px;"></i> Fuel Reserve</span>
                                    <span style="font-size: 10px; color: var(--alert-red); background: rgba(255,51,51,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">CRITICAL</span>
                                </div>
                                <p style="font-size: 12px; color: #888; line-height: 1.5;">6.9 days left at Bharati. Resupply pumping from ship is the top operational priority.</p>
                            </div>

                            <div class="constraint-item" style="padding: 15px; background: #080808; border: 1px solid #222; border-radius: 6px; position: relative; overflow: hidden;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #0088ff;"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: #0088ff; font-size: 13px; font-weight: 500;"><i class="fa-solid fa-weight-hanging" style="width: 20px;"></i> Vessel Capacity</span>
                                    <span style="font-size: 10px; color: #0088ff; background: rgba(0,136,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">MONITORED</span>
                                </div>
                                <p style="font-size: 12px; color: #888; line-height: 1.5;">1,842 tonnes stowed. Deck capacity at 94% limit. Offload sequence must maintain ship stability.</p>
                            </div>

                            <div class="constraint-item" style="padding: 15px; background: #080808; border: 1px solid #222; border-radius: 6px; position: relative; overflow: hidden;">
                                <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--success-green);"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--success-green); font-size: 13px; font-weight: 500;"><i class="fa-solid fa-users" style="width: 20px;"></i> Personnel Status</span>
                                    <span style="font-size: 10px; color: var(--success-green); background: rgba(0,255,102,0.1); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">100% CLEAR</span>
                                </div>
                                <p style="font-size: 12px; color: #888; line-height: 1.5;">124 personnel active. All hold certified polar survival and triage certs.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        \`,
`;

const plannerKey = "'#planner': `";
const intelligenceKey = "'#intelligence': `";
const indexPlanner = appContent.indexOf(plannerKey);
const indexIntelligence = appContent.indexOf(intelligenceKey);

if (indexPlanner !== -1 && indexIntelligence !== -1) {
    appContent = appContent.substring(0, indexPlanner) + newPlannerHTML + appContent.substring(indexIntelligence);
    fs.writeFileSync('js/app.js', appContent);
    console.log("Successfully redesigned #planner view to a unique Kanban layout!");
} else {
    console.log("Could not find planner/intelligence anchors in app.js.");
}
