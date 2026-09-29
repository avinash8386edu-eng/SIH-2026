const fs = require('fs');

let appJS = fs.readFileSync('js/app.js', 'utf8');

const globalButtonLogic = `
// --- HACKATHON: GLOBAL BUTTON INTERACTIVITY ---
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Ignore buttons that already have specific IDs handled elsewhere or inline onclick
    const handledIds = [
        'btn-trigger-sos', 'sos-btn', 'btn-cancel-sos', 'btn-sos-approve', 'btn-sos-reject',
        'btn-run-simulation', 'btn-mock-scan', 'btn-toggle-offline', 'btn-manual-lookup', 'btn-generate-qr',
        'btn-create-manifest', 'btn-scan-qr', 'btn-filter-cargo'
    ];
    if (btn.hasAttribute('onclick')) return;
    if (btn.id && handledIds.includes(btn.id)) return;

    const btnText = btn.innerText.trim().toUpperCase();
    const originalHtml = btn.innerHTML;
    const originalBorder = btn.style.borderColor;
    const originalColor = btn.style.color;
    
    // Fake actions based on button text keywords
    if (btnText.includes('SAVE') || btnText.includes('SUBMIT') || btnText.includes('UPDATE')) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SAVING...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> SAVED';
            if(window.GlobalUI) window.GlobalUI.showToast('Data committed to local ledger.', 'success');
            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
        }, 800);
    } 
    else if (btnText.includes('EXPORT') || btnText.includes('DOWNLOAD') || btnText.includes('PRINT')) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GENERATING...';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> READY';
            if(window.GlobalUI) window.GlobalUI.showToast('Report generated successfully.', 'success');
            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
        }, 1200);
    }
    else if (btnText.includes('NEW') || btnText.includes('ADD') || btnText.includes('+')) {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> LOADING...';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            if(window.GlobalUI) window.GlobalUI.showToast('Opening secure creation module...', 'info');
        }, 400);
    }
    else if (btnText.includes('FILTER') || btnText.includes('SORT') || btnText.includes('SEARCH')) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            if(window.GlobalUI) window.GlobalUI.showToast('Applying dynamic data filters...', 'info');
        }, 600);
    }
    else if (btnText.includes('APPROVE') || btnText.includes('DEPLOY') || btnText.includes('INITIATE') || btnText.includes('EXECUTE')) {
         btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSING...';
         setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> AUTHORIZED';
            btn.style.borderColor = '#00FF66';
            btn.style.color = '#00FF66';
            if(window.GlobalUI) window.GlobalUI.showToast('Command authorized by Mission Control.', 'success');
            setTimeout(() => { 
                btn.innerHTML = originalHtml; 
                btn.style.borderColor = originalBorder; 
                btn.style.color = originalColor; 
            }, 3000);
         }, 1000);
    }
    else {
        // Generic action for all other buttons
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            if(window.GlobalUI) window.GlobalUI.showToast('Action processed successfully.', 'success');
        }, 500);
    }
});
`;

appJS += '\n' + globalButtonLogic + '\n';
fs.writeFileSync('js/app.js', appJS);
console.log("Global button interactivity injected!");
