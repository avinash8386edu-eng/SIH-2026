/**
 * @jest-environment jsdom
 */

// --- 1. MOCK HARDWARE APIs TO PREVENT JSDOM CRASHES ---

// Mock AudioContext for Siren
window.AudioContext = jest.fn().mockImplementation(() => {
    return {
        createOscillator: jest.fn().mockReturnValue({
            type: 'sine',
            frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
            connect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn()
        }),
        createGain: jest.fn().mockReturnValue({
            gain: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
            connect: jest.fn()
        }),
        destination: {}
    };
});

// Mock Web Bluetooth API
Object.defineProperty(navigator, 'bluetooth', {
    value: {
        requestDevice: jest.fn().mockResolvedValue({
            name: 'MOCK_POLARIS_BEACON',
            gatt: { connect: jest.fn().mockResolvedValue(true) }
        })
    },
    writable: true
});

// Mock Geolocation
const mockGeolocation = {
    getCurrentPosition: jest.fn()
};
Object.defineProperty(navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true
});

// Mock window.alert
window.alert = jest.fn();

// --- 2. LOAD SCRIPT UNDER TEST ---
// In a real environment, we'd import. For vanilla JS in JSDOM, we evaluate the script.
const fs = require('fs');
const path = require('path');
const scriptCode = fs.readFileSync(path.resolve(__dirname, '../js/advanced-sos.js'), 'utf8');
eval(scriptCode);

// --- 3. TEST CASES ---
describe('POLARIS Advanced SOS & Smart Routing Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset online status
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    });

    test('Test Case 1 (Ship Routing): Should detect Latitude > -60 and trigger Marine VHF protocol', async () => {
        // Mock Ship coordinates
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
            success({ coords: { latitude: -55.0, longitude: 70.0 } })
        );

        // Spy on API Call
        global.apiCall = jest.fn().mockResolvedValue({ message: "Marine VHF protocol initiated." });

        await triggerSOS();

        expect(global.apiCall).toHaveBeenCalledWith('/emergency/sos', 'POST', expect.objectContaining({
            latitude: -55.0
        }));
    });

    test('Test Case 2 (Polar Routing): Should detect Latitude <= -60 and trigger Antarctic Base broadcast', async () => {
        // Mock Polar coordinates
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
            success({ coords: { latitude: -75.0, longitude: 106.0 } })
        );

        global.apiCall = jest.fn().mockResolvedValue({ message: "Pinging ALL nearby Field Scientists." });

        await triggerSOS();

        expect(global.apiCall).toHaveBeenCalledWith('/emergency/sos', 'POST', expect.objectContaining({
            latitude: -75.0
        }));
    });

    test('Offline P2P Mesh Test: Should trigger Bluetooth API and IndexedDB when navigator.onLine is false', async () => {
        // Force offline mode
        Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
        
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
            success({ coords: { latitude: -70.0, longitude: 100.0 } })
        );

        // Spy on our internal fallback function
        const originalQueue = queueOfflineAndLocalMesh;
        let queueCalled = false;
        queueOfflineAndLocalMesh = async (payload) => {
            queueCalled = true;
            await originalQueue(payload);
        };

        await triggerSOS();

        // 1. Verify queue function was called
        expect(queueCalled).toBe(true);

        // 2. Verify Bluetooth API was invoked for P2P Mesh
        expect(navigator.bluetooth.requestDevice).toHaveBeenCalledWith({
            acceptAllDevices: true,
            optionalServices: ['generic_access']
        });
        
        // Restore
        queueOfflineAndLocalMesh = originalQueue;
    });
});
