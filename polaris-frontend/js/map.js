let map;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
        loadPersonnel();
    }
});

function initMap() {
    map = L.map('map').setView([-75.250973, 106.237096], 6); // Centered near the dummy data traverse
    // CartoDB Dark Matter tile layer for OLED optimization and sleek UI
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);
}

async function loadPersonnel() {
    try {
        const personnelList = await apiCall('/personnel');
        
        personnelList.forEach(person => {
            if (person.lastLatitude && person.lastLongitude) {
                
                // Risk-based color coding
                let riskColor = '#2ECC71'; // Safe
                if(person.crevasseRisk === 'WARNING') riskColor = '#F39C12';
                if(person.crevasseRisk === 'DANGER') riskColor = '#E74C3C';

                const customIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color:${riskColor}; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px ${riskColor};"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                const marker = L.marker([person.lastLatitude, person.lastLongitude], {icon: customIcon}).addTo(map);
                
                let popupContent = `
                    <div style="background:#000; color:#fff; padding:15px; border-radius:8px; border:2px solid ${riskColor}; font-family:monospace;">
                        <h4 style="margin:0 0 10px 0; color:${riskColor};">${person.name}</h4>
                        <p style="margin:2px 0;"><strong>Role:</strong> ${person.role}</p>
                        <p style="margin:2px 0;"><strong>Vehicle:</strong> ${person.assignedVehicle || 'On Foot'}</p>
                        <p style="margin:2px 0;"><strong>Crevasse Risk:</strong> ${person.crevasseRisk || 'SAFE'}</p>
                        <p style="margin:2px 0;"><strong>Last Ping:</strong> ${person.createdAt ? new Date(person.createdAt).toLocaleString() : 'Just now'}</p>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            }
        });
    } catch (error) {
        console.error("Failed to load personnel data", error);
    }
}
