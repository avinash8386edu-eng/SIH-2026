export const CONSTANTS = {
    COMMANDER: "Dr. Rajesh Sharan",
    MISSION: "46th ISEA",
    STATIONS: {
        BHARATI: { lat: -69.4081, lng: 76.1872, capacity: 47, name: "Bharati Station" },
        MAITRI: { lat: -70.7658, lng: 11.7358, capacity: 65, name: "Maitri Station" }
    },
    TOTAL_PERSONNEL: 124,
    TOTAL_CARGO: 1842
};

function generatePersonnel() {
    const roles = ["SCIENTIST", "ENGINEER", "MEDICAL_OFFICER", "LOGISTICS", "MECHANIC"];
    const teams = ["Team Alpha", "Team Bravo", "Command", "Medical", "Glaciology"];
    const certs = [["Survival"], ["Survival", "Ice Nav"], ["Trauma SAR"], ["Crevasse Rescue"]];
    const personnel = [];
    
    // Explicit Core Team
    personnel.push({
        id: "PER-001", name: CONSTANTS.COMMANDER, role: "COMMANDER", team: "Command", 
        station: "Bharati", medicalStatus: "CLEARED", trainingCerts: ["Command", "Survival"], 
        lastCheckIn: Date.now() - 1000 * 60 * 5, gpsBattery: 95
    });

    for(let i = 2; i <= CONSTANTS.TOTAL_PERSONNEL; i++) {
        personnel.push({
            id: `PER-${String(i).padStart(3, '0')}`,
            name: `Expedition Member ${i}`,
            role: roles[i % roles.length],
            team: teams[i % teams.length],
            station: i % 3 === 0 ? "Maitri" : "Bharati",
            medicalStatus: i % 20 === 0 ? "REVIEW" : "CLEARED",
            trainingCerts: certs[i % certs.length],
            lastCheckIn: Date.now() - Math.floor(Math.random() * 86400000),
            gpsBattery: Math.floor(Math.random() * 80) + 20
        });
    }
    return personnel;
}

function generateCargo() {
    const cargo = [];
    const hazards = ["NONE", "FLAMMABLE", "CORROSIVE", "BIOLOGICAL"];
    const statuses = ["GOA_DEPOT", "CAPE_TOWN", "IN_TRANSIT", "DELIVERED", "ARRIVED"];
    
    for(let i = 1; i <= CONSTANTS.TOTAL_CARGO; i++) {
        cargo.push({
            id: `CRG-2026-${String(i).padStart(3, '0')}`,
            description: i % 10 === 0 ? "Atmospheric Aerosol Filters" : "General Supply Batch",
            origin: "Goa",
            destination: i % 2 === 0 ? "Bharati" : "Maitri",
            status: statuses[i % statuses.length],
            eta: "2026-12-04",
            risk: i % 50 === 0 ? "HIGH" : "NOMINAL",
            batchNo: `B-${Math.floor(i/10)}`,
            hazardClass: hazards[i % hazards.length]
        });
    }
    return cargo;
}

function generateInventory() {
    return [
        { id: "INV-001", category: "Fuel", name: "Polar Diesel (Grade A-1)", station: "Bharati", quantity: 4200, unit: "L", minThreshold: 10000, batch: "F-22", expiry: "2028-01-01", temp: "-19C" },
        { id: "INV-002", category: "Water", name: "Potable Water", station: "Bharati", quantity: 8500, unit: "L", minThreshold: 3000, batch: "W-01", expiry: "2027-01-01", temp: "15C" },
        { id: "INV-003", category: "Medical", name: "Medical O2 Cylinders", station: "Maitri", quantity: 45, unit: "Units", minThreshold: 10, batch: "O2-99", expiry: "2027-06-01", temp: "20C" },
        { id: "INV-004", category: "Medical", name: "Trauma Med-Kit Level 3", station: "Bharati", quantity: 12, unit: "Units", minThreshold: 5, batch: "MK-11", expiry: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], temp: "20C" }, // Expires soon
        { id: "INV-005", category: "Food", name: "Frozen Rations (MRE)", station: "Bharati", quantity: 1800, unit: "kg", minThreshold: 500, batch: "R-05", expiry: "2027-12-31", temp: "-20C" }
    ];
}

function generateAssets() {
    const assets = [];
    for(let i=1; i<=45; i++) {
        assets.push({
            id: `AST-${String(i).padStart(3, '0')}`,
            type: i % 5 === 0 ? "Helicopter Ka-32" : "PistenBully Snowcat",
            station: i % 2 === 0 ? "Bharati" : "Maitri",
            status: i % 15 === 0 ? "MAINTENANCE" : "OPERATIONAL",
            lastService: "2026-10-01"
        });
    }
    return assets;
}

function generateTraverses() {
    const traverses = [];
    for(let i=1; i<=8; i++) {
        traverses.push({
            id: `TRV-00${i}`,
            name: `Ice Shelf Drill Team ${i}`,
            status: i % 3 === 0 ? "DELAYED" : "ACTIVE",
            personnelCount: 4,
            location: { lat: -70.1, lng: 12.5 }
        });
    }
    return traverses;
}

function generateIncidents() {
    const incidents = [];
    for(let i=1; i<=12; i++) {
        incidents.push({
            id: `INC-00${i}`,
            type: i === 1 ? "SOS" : "EQUIPMENT_FAILURE",
            severity: i === 1 ? "CRITICAL" : "MODERATE",
            status: i === 1 ? "ACTIVE" : "RESOLVED",
            location: "Larsemann Hills",
            timestamp: Date.now() - 1000000 * i
        });
    }
    return incidents;
}

function generatePhases() {
    return [
        { id: "PH-1", name: "Expedition Mobilization & Departure", status: "COMPLETED" },
        { id: "PH-2", name: "Cargo Staging & Customs Cutoff", status: "COMPLETED" },
        { id: "PH-3", name: "Southern Ocean Transport & Ice Window", status: "ACTIVE" },
        { id: "PH-4", name: "Personnel Movement & Station Handover", status: "PENDING" },
        { id: "PH-5", name: "Station Commissioning & Winter Lock-In", status: "PENDING" },
        { id: "PH-6", name: "Return Voyage & Debrief", status: "PENDING" }
    ];
}

export function generateFullSeed() {
    return {
        constants: CONSTANTS,
        personnel: generatePersonnel(),
        cargo: generateCargo(),
        inventory: generateInventory(),
        assets: generateAssets(),
        traverses: generateTraverses(),
        incidents: generateIncidents(),
        phases: generatePhases()
    };
}
