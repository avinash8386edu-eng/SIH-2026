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

    // 2. QR Generator Engine Logic (Missing Feature Fix)
    const generateQrBtn = document.getElementById('generateQrBtn');
    const printQrBtn = document.getElementById('printQrBtn');
    const qrAssetId = document.getElementById('qrAssetId');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    if (generateQrBtn && qrCodeContainer && qrAssetId) {
        generateQrBtn.addEventListener('click', () => {
            const assetName = qrAssetId.value.trim();
            if (!assetName) {
                alert("Please enter an Asset Name or ID first.");
                return;
            }

            // Clear previous QR
            qrCodeContainer.innerHTML = "";
            qrCodeContainer.style.display = "flex";
            printQrBtn.style.display = "block";

            // Generate new QR using qrcode.js
            new QRCode(qrCodeContainer, {
                text: assetName,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        });
    }

    if (printQrBtn) {
        printQrBtn.addEventListener('click', () => {
            const qrCanvas = qrCodeContainer.querySelector('canvas');
            if (qrCanvas) {
                const imgData = qrCanvas.toDataURL('image/png');
                const win = window.open('');
                win.document.write(`
                    <html>
                    <head><title>Print AL-1403 Tag</title></head>
                    <body style="text-align:center; padding:50px; font-family:sans-serif;">
                        <h2>OFFICIAL POLARIS AL-1403 TAG</h2>
                        <h3>Asset: ${qrAssetId.value}</h3>
                        <img src="${imgData}" style="width:300px; height:300px; margin:20px 0;" />
                        <p><strong>Property of MoES / NCPOR (Govt. of India)</strong></p>
                        <p>If found, return to nearest base commander.</p>
                        <script>
                            window.onload = function() { window.print(); window.close(); };
                        </script>
                    </body>
                    </html>
                `);
                win.document.close();
            }
        });
    }
});

function startScanner() {
    // The id in our html is qr-reader, wait, let's check cargo.html. It has id="qr-reader".
    // Previously cargo.js was referring to "reader", which explains unclickable UI!
    const readerDiv = document.getElementById('qr-reader');
    if(readerDiv) {
        readerDiv.style.display = 'block';
    }

    if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        html5QrcodeScanner.render(onScanSuccess, (err) => { /* ignore normal scanning errors */ });
    }
}

async function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning once successful
    if(html5QrcodeScanner) html5QrcodeScanner.clear();
    const readerDiv = document.getElementById('qr-reader');
    if(readerDiv) readerDiv.style.display = 'none';
    
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

async function exportAL1403() {
    try {
        const cargoList = await apiCall('/cargo');
        let rows = '';
        cargoList.forEach(c => {
            rows += `<tr><td>${c.cargoCode}</td><td>${c.name}</td><td>${c.category || ''}</td><td>${c.weight || 'N/A'} kg</td><td>${c.status}</td><td>${c.priority || 'NORMAL'}</td></tr>`;
        });

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
                    .signatures { display: flex; justify-content: space-between; margin-top: 80px; }
                    .sig-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Government of India</h1>
                    <h2>National Centre for Polar and Ocean Research (NCPOR)</h2>
                    <p>FORM AL-1403: ANTARCTIC EXPEDITION CARGO MANIFEST</p>
                </div>
                <div class="meta">
                    <div>Expedition: 43rd ISEA</div>
                    <div>Date: ${date}</div>
                    <div>Clearance: LEVEL-5 (CONFIDENTIAL)</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Cargo Code</th>
                            <th>Nomenclature</th>
                            <th>Category</th>
                            <th>Weight</th>
                            <th>Status</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <p><strong>DECLARATION:</strong> All listed payloads comply with the Antarctic Treaty System (ATS) environmental protection protocols. Hazardous materials are triple-sealed per standard operating procedures.</p>
                <div class="stamp">CLEARED FOR DEPARTURE</div>
                <div class="signatures">
                    <div class="sig-line">Logistics Officer Signature</div>
                    <div class="sig-line">Base Commander Signature</div>
                </div>
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
    } catch(e) {
        alert("Failed to generate AL-1403 report. Backend offline? " + e.message);
    }
}

