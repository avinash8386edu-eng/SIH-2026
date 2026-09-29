// global-ui.js - Core UI managers for Modals, Toasts, Keyboard shortcuts, Error Boundaries

export const GlobalUI = {
    init() {
        this.setupErrorBoundary();
        this.createToastContainer();
        this.createModalOverlay();
        this.createCommandPalette();
        this.setupKeyboardShortcuts();
        this.setupNetworkMonitor();
    },

    setupErrorBoundary() {
        window.addEventListener('error', (e) => {
            console.error("Global Error Caught:", e.error);
            this.showToast(`System Error: ${e.message}`, 'error');
            // Prevent blank screen
            const content = document.getElementById('dynamic-content');
            if (content && content.innerHTML.trim() === '') {
                content.innerHTML = `<div class="glass-panel" style="padding:40px;text-align:center;color:var(--alert-red)">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:3rem;margin-bottom:20px;"></i>
                    <h2>CRITICAL UI FAULT</h2>
                    <p>Failed to render module. See console for details.</p>
                </div>`;
            }
        });
    },

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;`;
        document.body.appendChild(container);
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const color = type === 'error' ? 'var(--alert-red)' : type === 'success' ? '#00FF66' : 'var(--accent-cyan)';
        
        toast.style.cssText = `
            background: var(--bg-dark);
            border-left: 4px solid ${color};
            color: var(--text-main);
            padding: 15px 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 0.9rem;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}" style="color:${color}"></i> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    createModalOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
            z-index: 9000; display: none; align-items: center; justify-content: center;
        `;
        overlay.innerHTML = `<div id="modal-content" class="glass-panel" style="width: 500px; max-width: 90%; max-height: 90%; overflow-y: auto; padding: 30px; position: relative;"></div>`;
        
        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
        document.body.appendChild(overlay);
    },

    openModal(htmlContent) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        content.innerHTML = `<button onclick="document.getElementById('modal-overlay').style.display='none'" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.2rem;"><i class="fa-solid fa-xmark"></i></button>` + htmlContent;
        overlay.style.display = 'flex';
    },

    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    },

    createCommandPalette() {
        const palette = document.createElement('div');
        palette.id = 'command-palette';
        palette.style.cssText = `
            position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
            width: 600px; background: var(--bg-dark); border: 1px solid var(--accent-cyan);
            border-radius: 8px; box-shadow: 0 0 30px rgba(0,229,255,0.2);
            z-index: 9999; display: none; flex-direction: column;
        `;
        palette.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid rgba(0,229,255,0.2); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-magnifying-glass" style="color: var(--accent-cyan)"></i>
                <input type="text" id="cmd-input" placeholder="Search cargo, personnel, assets..." style="width:100%; background:transparent; border:none; color:var(--text-main); font-size:1.2rem; outline:none; font-family:var(--font-mono)">
            </div>
            <div id="cmd-results" style="max-height: 300px; overflow-y: auto; padding: 10px;"></div>
        `;
        document.body.appendChild(palette);

        document.getElementById('cmd-input').addEventListener('input', (e) => {
            const val = e.target.value.trim().toLowerCase();
            const res = document.getElementById('cmd-results');
            if(!val) { res.innerHTML = ''; return; }
            res.innerHTML = `<div style="padding:10px; color:var(--text-muted); font-family:var(--font-mono)">> Searching databases for '${val}'...</div>`;
            // Real search to be hooked up in Phase 4
        });
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const pal = document.getElementById('command-palette');
                if (pal.style.display === 'flex') {
                    pal.style.display = 'none';
                } else {
                    pal.style.display = 'flex';
                    document.getElementById('cmd-input').focus();
                }
            }
            if (e.key === 'Escape') {
                this.closeModal();
                document.getElementById('command-palette').style.display = 'none';
            }
        });
    },

    setupNetworkMonitor() {
        const updateBadge = () => {
            const badge = document.getElementById('network-badge');
            if (!badge) return;
            if (navigator.onLine) {
                badge.innerHTML = `<span class="pulse-dot"></span><strong class="neon-text" style="color: #00FF66;">VSAT SECURE</strong>`;
            } else {
                badge.innerHTML = `<span class="pulse-dot" style="background:#FF003C;box-shadow:0 0 8px #FF003C;"></span><strong class="neon-text-red">OFFLINE (INDEXEDDB)</strong>`;
                this.showToast('VSAT Link Lost. Operating in Offline Mode.', 'error');
            }
        };
        window.addEventListener('online', updateBadge);
        window.addEventListener('offline', updateBadge);
    }
};

// Expose globally for HTML onclick handlers
window.GlobalUI = GlobalUI;
