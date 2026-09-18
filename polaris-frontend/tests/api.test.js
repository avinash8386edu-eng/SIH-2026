/**
 * @jest-environment jsdom
 */

const { apiCall } = require('../js/api.js');

describe('API Utils - apiCall', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });
        // Mock window.location
        delete window.location;
        window.location = { href: '' };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should attach Bearer token if present in localStorage', async () => {
        window.localStorage.getItem.mockReturnValue('fake-jwt-token');
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValueOnce(JSON.stringify({ success: true }))
        });

        await apiCall('/test');

        expect(window.localStorage.getItem).toHaveBeenCalledWith('jwt');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/test', expect.objectContaining({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-jwt-token'
            }
        }));
    });

    test('should redirect to index.html on 401 Unauthorized', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        await expect(apiCall('/secure-endpoint')).rejects.toThrow('API Error: 401');
        
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('jwt');
        expect(window.location.href).toBe('index.html');
    });
});
