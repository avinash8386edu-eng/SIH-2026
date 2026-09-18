// Auth specific functions
async function login(email, password) {
    try {
        const data = await apiCall('/auth/login', 'POST', { email, password });
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Login failed. Please check credentials.');
    }
}

function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('jwt');
    if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

// Run checkAuth immediately on script load
checkAuth();

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker Registered!', reg))
            .catch(err => console.error('Service Worker Registration Failed!', err));
    });
}
