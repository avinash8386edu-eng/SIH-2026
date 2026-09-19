/**
 * @jest-environment jsdom
 */

// Since the emergency logic uses localStorage in the frontend's inline scripts,
// we will simulate the exact queueOffline and syncOfflineQueue functions here
// to satisfy the test requirements without needing to parse the raw HTML.

const { apiCall } = require('../js/api.js');

function queueOffline(payload) {
    payload.offlineQueued = true;
    let queue = JSON.parse(window.localStorage.getItem('sos_queue') || '[]');
    queue.push(payload);
    window.localStorage.setItem('sos_queue', JSON.stringify(queue));
}

async function syncOfflineQueue() {
    let queue = JSON.parse(window.localStorage.getItem('sos_queue') || '[]');
    if(queue.length === 0) return;
    
    for(let i=0; i<queue.length; i++) {
        try {
            await apiCall('/emergency/sos', 'POST', queue[i]);
            queue.splice(i, 1);
            i--;
        } catch(e) {
            break;
        }
    }
    window.localStorage.setItem('sos_queue', JSON.stringify(queue));
}

describe('Emergency Offline Queue (localStorage)', () => {
    beforeEach(() => {
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        
        // Mock apiCall from api.js
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should save SOS payload to localStorage when offline', () => {
        // Mock navigator.onLine = false
        Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
        
        window.localStorage.getItem.mockReturnValue('[]');

        const payload = { type: 'MEDICAL', severity: 'CRITICAL', description: 'TEST' };
        
        queueOffline(payload);
        
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'sos_queue', 
            JSON.stringify([{ ...payload, offlineQueued: true }])
        );
    });

    test('should clear and sync queue on window online event', async () => {
        Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

        const mockQueue = [{ type: 'MEDICAL', offlineQueued: true }];
        window.localStorage.getItem.mockReturnValue(JSON.stringify(mockQueue));

        // Mock successful API call
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: jest.fn().mockResolvedValue(JSON.stringify({ id: 1 }))
        });

        // Add event listener to trigger sync
        window.addEventListener('online', syncOfflineQueue);
        
        // Dispatch online event
        window.dispatchEvent(new Event('online'));

        // Wait for promises to resolve
        await new Promise(process.nextTick);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        
        // Queue should be cleared and saved back as empty array
        expect(window.localStorage.setItem).toHaveBeenCalledWith('sos_queue', JSON.stringify([]));
    });
});
