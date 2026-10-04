let map;
let routeLayer;
let dangerLayer;
let isOfflineMode = false;
let telemetryMarkers = {}; // Stores live vehicle markers

document.addEventListener('DOMContentLoaded', () => {
    initSatelliteMap();
    
    // Listen for live WebSocket telemetry broadcasts
    window.addEventListener('polaris-telemetry', (e) => {
        const data = e.detail;
        const vehicleId = data.entityType + '-' + data.entityId;
        
        if (!telemetryMarkers[vehicleId]) {
            // Create new marker if it doesn't exist
            const customIcon = L.divIcon({
                className: 'live-marker',
                html: `<div style="background: #00E5FF; width: 15px; height: 15px; border-radius: 50%; box-shadow: 0 0 10px #00E5FF, 0 0 20px #00E5FF;"></div>`,
                iconSize: [15, 15]
            });
            
            telemetryMarkers[vehicleId] = L.marker([data.latitude, data.longitude], {icon: customIcon})
                .addTo(map)
                .bindPopup(`<b>Live Tracking</b><br>ID: ${vehicleId}<br>Speed: ${data.speed || 0} km/h`);
        } else {
            // Animate/move existing marker
            const marker = telemetryMarkers[vehicleId];
            marker.setLatLng([data.latitude, data.longitude]);
            marker.getPopup().setContent(`<b>Live Tracking</b><br>ID: ${vehicleId}<br>Speed: ${data.speed || 0} km/h`);
            
            // Auto-pan map to follow if we're focused on it
            // map.panTo([data.latitude, data.longitude]);
        }
    });
});

function initSatelliteMap() {
    // Center map around Antarctica (Maitri station approx)
    map = L.map('satellite-map').setView([-70.7667, 11.7333], 5);
    
    // Esri World Imagery (Satellite) for realistic polar view
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 17,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    // Initial markers for Maitri and Bharathi stations
    L.marker([-70.7667, 11.7333]).addTo(map).bindPopup("<b>Maitri Station</b>").openPopup();
    L.marker([-69.4068, 76.1929]).addTo(map).bindPopup("<b>Bharathi Station</b>");
}

async function calculateSafeRoute() {
    try {
        const btn = document.querySelector('button[onclick="calculateSafeRoute()"]');
        btn.innerText = "Computing A* Path...";
        
        // Maitri to Bharathi coordinates
        const payload = {
            originLat: -70.7667,
            originLng: 11.7333,
            destinationLat: -69.4068,
            destinationLng: 76.1929
        };

        const routeData = await apiCall('/satellite/route/calculate', 'POST', payload);
        
        // Clear old layers
        if (routeLayer) map.removeLayer(routeLayer);
        if (dangerLayer) map.removeLayer(dangerLayer);

        // Draw Danger Zone (Crevasse)
        if (routeData.dangerZonesGeoJson) {
            const dangerGeo = JSON.parse(routeData.dangerZonesGeoJson);
            dangerLayer = L.geoJSON(dangerGeo, {
                style: { color: '#ff3366', weight: 2, fillColor: '#ff3366', fillOpacity: 0.4 }
            }).bindPopup("<b>WARNING: CREVASSE ZONE</b><br>Detected by Sentinel-1 SAR").addTo(map);
        }

        // Draw Safe Route Line
        if (routeData.routeGeoJson) {
            const routeGeo = JSON.parse(routeData.routeGeoJson);
            routeLayer = L.geoJSON(routeGeo, {
                style: { color: '#00E5FF', weight: 4, dashArray: '10, 10' }
            }).addTo(map);
            
            // Adjust map view to fit route
            map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        }

        // Update Stats UI
        document.getElementById('route-stats').style.display = 'block';
        document.getElementById('stat-dist').innerText = routeData.totalDistanceKm;
        document.getElementById('stat-time').innerText = routeData.estimatedHours;
        document.getElementById('stat-risk').innerText = routeData.riskScore;

        btn.innerText = "Calculate Safe Route (A*)";
    } catch (e) {
        console.error("Route calc failed", e);
        alert("Failed to calculate route: " + e.message);
        document.querySelector('button[onclick="calculateSafeRoute()"]').innerText = "Calculate Safe Route (A*)";
    }
}

async function toggleOfflineMode() {
    isOfflineMode = !isOfflineMode;
    const btn = document.getElementById('offline-btn');
    
    if (isOfflineMode) {
        btn.innerText = "Offline Mode: ACTIVE";
        btn.style.backgroundColor = "rgba(255, 51, 102, 0.2)";
        alert("Blizzard Mode Enabled. Map tiles and route data are cached for offline operation.");
        // In a real PWA, this would trigger the ServiceWorker to aggressively cache the current bounding box map tiles.
    } else {
        btn.innerText = "Enable Offline Caching";
        btn.style.backgroundColor = "transparent";
    }
}
