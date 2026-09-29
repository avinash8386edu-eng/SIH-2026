const fs = require('fs');
let readme = fs.readFileSync('README.md', 'utf8');

// Replace the placeholder screenshots with real ones
readme = readme.replace(
    /## 5\. Screenshots[\s\S]*?---/,
    `## 5. Screenshots

![All Expeditions](screenshots/all_expeditions.png)  
*Figure 1: High-Level Archive & Classified ISEA Dossiers.*

![Expedition Planner](screenshots/planner.png)  
*Figure 2: Him-Setu Payload & Survival Configurator featuring live drag & drop logistics and hazard simulation.*

![Fault Logs](screenshots/maintenance.png)  
*Figure 3: Preventative Maintenance Diagnostics with real-time hardware telemetry and offline ticketing.*

![Mission Assignments](screenshots/assignments.png)  
*Figure 4: Active Personnel Duty Roster showing critical and routine deep-field assignments.*

---`
);

fs.writeFileSync('README.md', readme);
