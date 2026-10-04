import { generateFullSeed, CONSTANTS } from './data/seed.js';

// Dexie is loaded via CDN in index.html (window.Dexie)
const db = new Dexie("HimSetuDB");

db.version(1).stores({
    personnel: 'id, role, station',
    cargo: 'id, status, destination',
    custodyEvents: '++id, cargoId, timestamp',
    inventory: 'id, category, station',
    transfers: '++id, itemId, status',
    assets: 'id, type, station',
    maintenance: '++id, assetId, dueDate',
    missions: 'id, status', // equivalent to traverses
    incidents: 'id, severity, status',
    syncQueue: '++id, action, timestamp',
    metadata: 'key'
});

export async function initDB() {
    try {
        const count = await db.personnel.count();
        if (count === 0) {
            console.log("Seeding Dexie Database (First Run)...");
            const seed = generateFullSeed();
            
            await db.transaction('rw', 
                db.personnel, db.cargo, db.inventory, db.assets, 
                db.missions, db.incidents, db.metadata, 
                async () => {
                    await db.personnel.bulkAdd(seed.personnel);
                    await db.cargo.bulkAdd(seed.cargo);
                    await db.inventory.bulkAdd(seed.inventory);
                    await db.assets.bulkAdd(seed.assets);
                    await db.missions.bulkAdd(seed.traverses);
                    await db.incidents.bulkAdd(seed.incidents);
                    await db.metadata.put({ key: "constants", value: seed.constants });
            });
            console.log("Database seeded successfully!");
        }
    } catch (err) {
        console.error("Dexie init failed:", err);
    }
}

export async function resetDemoData() {
    await db.delete();
    await db.open();
    await initDB();
    window.location.reload();
}

export default db;
