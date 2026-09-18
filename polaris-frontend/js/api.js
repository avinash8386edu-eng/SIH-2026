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
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Unauthorized, clear token and redirect to login
                localStorage.removeItem('jwt');
                window.location.href = 'index.html';
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        // Return empty object for no-content responses
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('API Call Failed:', error);
        throw error;
    }
}
