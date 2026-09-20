async function login(email, password) {
    try {
        const data = await apiCall('/auth/login', 'POST', { email, password });
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userRole', data.role || '');
            localStorage.setItem('userName', data.name || '');
            localStorage.setItem('userEmail', data.email || '');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Login failed. Please check credentials.');
    }
}

async function launchModule(email, password, targetPage) {
    try {
        // Health check first - is the backend even reachable?
        const health = await fetch(API_BASE_URL + '/auth/health', { method: 'GET' });
        if (!health.ok) throw new Error('Backend unreachable');

        const data = await apiCall('/auth/login', 'POST', { email, password });
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userRole', data.role || '');
            localStorage.setItem('userName', data.name || '');
            localStorage.setItem('userEmail', data.email || '');
            window.location.href = targetPage;
        }
    } catch (error) {
        // Show helpful message instead of scary "offline" alert
        const msg = navigator.onLine 
            ? '⚠️ Backend server is starting up. Run: mvn spring-boot:run in polaris-backend folder, wait 15 seconds, then try again.'
            : '📡 You are offline. POLARIS will work in offline mode.';
        alert(msg);
    }
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}
