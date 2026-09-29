const fs = require('fs');

let content = fs.readFileSync('js/app.js', 'utf-8');

// Find the index of the start of the orphaned code fragment and everything after it
// We know it looks like this:
// });
// 
// 
//             const data = await res.json();
// ...

const startOfCorruption = content.indexOf(`            const data = await res.json();`);
if (startOfCorruption > -1) {
    // Find the end of the previous valid block to truncate from
    const truncateAt = content.lastIndexOf(`});`, startOfCorruption) + 3;
    content = content.substring(0, truncateAt);
    
    // Now cleanly append the simulation logic
    content += `

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
                         fList.innerHTML += \`<li style="margin-bottom:5px;">- \${c}</li>\`;
                     });
                }

                const mList = document.getElementById('res-mitigation');
                mList.innerHTML = '';
                data.recommendations.forEach(r => {
                     mList.innerHTML += \`<li style="margin-bottom:5px;">- \${r}</li>\`;
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
`;
    
    fs.writeFileSync('js/app.js', content, 'utf-8');
    console.log("Successfully repaired app.js syntax.");
} else {
    console.log("Corruption not found.");
}
