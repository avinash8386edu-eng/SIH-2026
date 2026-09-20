const API_BASE_URL = 'http://localhost:8080/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('jwt');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        if (!navigator.onLine && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            console.warn('[Blizzard Mode] Offline. Queuing request locally.');
            await queueOfflineRequest(endpoint, method, data);
            return { _offlineQueued: true, message: "Saved offline. Will sync when VSAT connects." };
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Unauthorized, clear token and redirect to login
                localStorage.removeItem('jwt');
                if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                    if (typeof window.location.assign === 'function') {
                        window.location.assign('index.html');
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        // Return empty object for no-content responses
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        // If it's a mutation and failed strictly due to a network error, queue it
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && 
            !(error.message && error.message.includes('API Error'))) {
            console.warn('[Blizzard Mode] Network dropped during fetch. Queuing request locally.');
            await queueOfflineRequest(endpoint, method, data);
            return { _offlineQueued: true, message: "Saved offline. Will sync when VSAT connects." };
        }
        console.error('API Call failed:', error);
        throw error;
    }
}

// Background Sync Logic
window.addEventListener('online', async () => {
    console.log('[Blizzard Mode] Connection Restored. Syncing data...');
    const banner = document.getElementById('vsat-status');
    if (banner) { banner.innerText = 'VSAT ONLINE - SYNCING'; banner.style.background = '#f39c12'; }

    try {
        if (typeof getOfflineRequests === 'function') {
            const queued = await getOfflineRequests();
            if (queued && queued.length > 0) {
                for (let req of queued) {
                    try {
                        await apiCall(req.endpoint, req.method, req.data);
                        await deleteOfflineRequest(req.id);
                        console.log(`Synced: ${req.endpoint}`);
                    } catch (e) {
                        console.error("Failed to sync queued request", e);
                        // Drop request if the server actively rejected it (400, 500)
                        if (e.message && e.message.includes('API Error')) {
                            console.warn(`Dropping permanently failed offline request: ${req.endpoint}`);
                            await deleteOfflineRequest(req.id);
                        }
                    }
                }
                // Trigger a UI refresh if a global func exists
                if (typeof loadCargo === 'function') loadCargo();
            }
        }
    } catch (e) {
        console.error("Error during sync", e);
    }
    
    if (banner) { banner.innerText = 'VSAT ONLINE'; banner.style.background = '#27ae60'; }
});

// For Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiCall, API_BASE_URL };
}
