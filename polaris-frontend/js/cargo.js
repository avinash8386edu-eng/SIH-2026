let html5QrcodeScanner;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargo Scanner Logic
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
        html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
}

async function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning once successful
    if(html5QrcodeScanner) html5QrcodeScanner.clear();
    const readerDiv = document.getElementById('qr-reader');
    if(readerDiv) readerDiv.style.display = 'none';
    
    try {
        const asset = await apiCall(`/assets/qr/${decodedText}`);
        const detailsDiv = document.getElementById('assetDetails');
        
        if (detailsDiv) {
            detailsDiv.style.display = 'block';
            detailsDiv.innerHTML = `
                <div style="border-left: 4px solid #2ECC71; padding-left: 15px; margin-top: 15px;">
                    <h3 style="color: #2ECC71; margin-top: 0;">Asset Authorized & Verified</h3>
                    <p><strong>QR Code:</strong> ${asset.qrCode}</p>
                    <p><strong>Name:</strong> ${asset.name}</p>
                    <p><strong>Category:</strong> ${asset.category}</p>
                    <p><strong>Current Status:</strong> <span style="color:#F39C12; font-weight:bold;">${asset.status}</span></p>
                    <p><strong>Location:</strong> ${asset.currentLocation}</p>
                </div>
            `;
        }
    } catch (error) {
        const detailsDiv = document.getElementById('assetDetails');
        if(detailsDiv) {
            detailsDiv.style.display = 'block';
            detailsDiv.innerHTML = `
                <div style="border-left: 4px solid #E74C3C; padding-left: 15px; margin-top: 15px;">
                    <h3 style="color: #E74C3C; margin-top: 0;">⚠️ Asset Not Found</h3>
                    <p>The scanned QR code <strong>${decodedText}</strong> does not match any official POLARIS cargo records.</p>
                </div>
            `;
        }
    }
}

function onScanFailure(error) {
    // We intentionally ignore scanning noise
}
