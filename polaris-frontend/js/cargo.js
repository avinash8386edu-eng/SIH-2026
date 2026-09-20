let html5QrcodeScanner;

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the cargo page
    if (document.getElementById('assetsTableBody')) {
        loadCargo();
    }
    const startScannerBtn = document.getElementById('startScannerBtn');
    if (startScannerBtn) {
        startScannerBtn.addEventListener('click', startScanner);
    }
});

function startScanner() {
    const readerDiv = document.getElementById('reader');
    readerDiv.style.display = 'block';

    if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        html5QrcodeScanner.render(onScanSuccess, (err) => { /* ignore normal scanning errors */ });
    }
}

async function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning once successful
    html5QrcodeScanner.clear();
    document.getElementById('reader').style.display = 'none';
    
    try {
        const payload = {
            location: "Maitri Checkpoint Alpha",
            notes: "Optical Scan via UI"
        };
        // Direct POST to backend. If offline, it gets queued by api.js!
        const response = await apiCall(`/cargo/qr/${decodedText}/scan`, 'POST', payload);
        
        if (response && response._offlineQueued) {
            alert(`[Blizzard Mode]\nScan event for '${decodedText}' queued locally. Will sync when VSAT connects.`);
        } else {
            alert(`Scan logged successfully for: ${decodedText}`);
            loadCargo(); // refresh table
        }
    } catch (error) {
        alert("❌ Cargo not found in database for QR: " + decodedText);
    }
}

async function loadCargo() {
    try {
        const cargoList = await apiCall('/cargo');
        const tbody = document.getElementById('assetsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (cargoList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#888;">No active cargo manifested. Use DataSeeder to mock data.</td></tr>`;
            return;
        }

        cargoList.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td style="font-family:monospace; color:#00E5FF;">${c.cargoCode || c.qrCode || c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.description || 'N/A'}</td>
                    <td><span style="background:rgba(255,255,255,0.1); padding:3px 8px; border-radius:12px;">${c.category}</span></td>
                    <td style="color:#2ecc71;">${c.status}</td>
                    <td style="color:${c.priority === 'CRITICAL' ? '#ff3366' : '#fff'};">${c.priority}</td>
                    <td>
                        <button class="btn btn-sm" onclick="scanCargo(${c.id}, '${c.name}')" style="padding:4px 8px; background:rgba(0,229,255,0.2); border:1px solid #00E5FF; color:#00E5FF; cursor:pointer;">Update Location</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Failed to load cargo list", e);
    }
}

async function scanCargo(id, name) {
    try {
        const payload = {
            location: "Maitri Checkpoint Alpha",
            notes: "Scanned via UI"
        };
        // This will queue offline if navigator.onLine is false! (Blizzard Mode)
        const response = await apiCall(`/cargo/${id}/scan`, 'POST', payload);
        
        if (response && response._offlineQueued) {
            alert(`[Blizzard Mode]\nScan event for '${name}' queued locally. Will sync when VSAT connects.`);
        } else {
            alert(`Scan logged successfully for: ${name}`);
            loadCargo(); // refresh table
        }
    } catch (e) {
        alert("Failed to scan cargo: " + e.message);
    }
}

function exportAL1403() {
    // Generate a professional printable Ministry Manifest (AL-1403)
    const printWindow = window.open('', '_blank');
    const date = new Date().toLocaleString('en-IN');
    
    const html = `
        <html>
        <head>
            <title>AL-1403 Ministry Manifest</title>
            <style>
                body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                .header p { margin: 5px 0; font-size: 14px; }
                .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #000; padding: 10px; text-align: left; }
                th { background-color: #f0f0f0; }
                .footer { margin-top: 50px; text-align: center; font-style: italic; font-size: 12px; }
                .stamp { position: absolute; right: 50px; bottom: 50px; color: red; border: 3px solid red; border-radius: 5px; padding: 10px; font-weight: bold; font-size: 20px; transform: rotate(-15deg); opacity: 0.7; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Government of India</h1>
                <h2>National Centre for Polar and Ocean Research (NCPOR)</h2>
                <p>FORM AL-1403: ANTARCTIC EXPEDITION CARGO MANIFEST</p>
            </div>
            
            <div class="meta">
                <div>Route: Maitri -> Bharathi</div>
                <div>Date: ${date}</div>
                <div>Clearance: LEVEL 4 (CRITICAL)</div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Cargo Code</th>
                        <th>Payload Classification</th>
                        <th>Status</th>
                        <th>ISO-86 Temp Requirement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>CG-8832</td><td>Ice Core Strata Targets</td><td>CLEARED</td><td>-55°C STRICT</td></tr>
                    <tr><td>FL-9901</td><td>Aviation Turbine Fuel (ATF)</td><td>CLEARED</td><td>NOMINAL</td></tr>
                    <tr><td>MD-1044</td><td>Trauma MedKits (x50)</td><td>CLEARED</td><td>+5°C to +15°C</td></tr>
                    <tr><td>SC-2201</td><td>Seismograph Sensors</td><td>INSPECTION</td><td>NOMINAL</td></tr>
                </tbody>
            </table>

            <p><strong>DECLARATION:</strong> All listed payloads comply with the Antarctic Treaty System (ATS) environmental protection protocols. Hazardous materials are triple-sealed per standard operating procedures.</p>

            <div class="stamp">CLEARED FOR DEPARTURE</div>

            <div class="footer">
                Generated autonomously by POLARIS AI Edge System.
            </div>
            <script>
                setTimeout(() => { window.print(); }, 500);
            </script>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
}
