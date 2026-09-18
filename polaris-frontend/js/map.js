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
                const marker = L.marker([person.lastLatitude, person.lastLongitude]).addTo(map);
                
                // Construct a sleek popup
                let popupContent = `
                    <div style="background:#0D1B2A; color:#fff; padding:10px; border-radius:4px; border:1px solid #85C1E9;">
                        <h4 style="margin:0 0 5px 0; color:#85C1E9;">${person.name}</h4>
                        <p style="margin:0; font-size:12px;"><strong>Status:</strong> ${person.currentStatus || 'UNKNOWN'}</p>
                        <p style="margin:0; font-size:12px;"><strong>Role:</strong> ${person.role}</p>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            }
        });
    } catch (error) {
        console.error("Failed to load personnel data", error);
    }
}
