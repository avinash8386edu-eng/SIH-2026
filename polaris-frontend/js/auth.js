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

async function launchModule(email, password, targetPage) {
    try {
        const data = await apiCall('/auth/login', 'POST', { email, password });
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            window.location.href = targetPage;
        }
    } catch (error) {
        alert('Module launch failed. Backend server offline.');
    }
}

function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}
