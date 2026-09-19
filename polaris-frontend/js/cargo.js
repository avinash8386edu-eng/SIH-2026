let html5QrcodeScanner;

document.addEventListener('DOMContentLoaded', () => {
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
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
}

async function onScanSuccess(decodedText, decodedResult) {
    // Stop scanning once successful
    html5QrcodeScanner.clear();
    document.getElementById('reader').style.display = 'none';
    
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
        detailsDiv.style.display = 'block';
        detailsDiv.innerHTML = `
            <div style="border-left: 4px solid #E74C3C; padding-left: 15px; margin-top: 15px;">
                <h3 style="color: #E74C3C; margin-top: 0;">❌ Asset Not Found</h3>
                <p>The scanned QR code <strong>${decodedText}</strong> does not match any official POLARIS cargo records.</p>
            </div>
        `;
    }
}

function onScanFailure(error) {
    // We intentionally ignore scanning noise as the camera looks for a QR code
}
