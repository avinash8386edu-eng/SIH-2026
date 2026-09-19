package com.polaris.config;

import com.polaris.model.*;
import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAssets();
        seedInventory();
        System.out.println("Ã¢Å“â€¦ 44th ISEA Data Seeded Successfully with MASSIVE payload!");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            String pass = passwordEncoder.encode("admin123");
            userRepository.saveAll(List.of(
                buildUser("Denney George (VU2DGR)", "admin@polaris.com", pass, Role.ADMIN, "BASE_COMMAND", -70.7667, 11.7333),
                buildUser("Dr. Anjali Sharma", "anjali@polaris.com", pass, Role.SCIENTIST, "ON_TRAVERSE", -71.5000, 11.2000),
                buildUser("Capt. Vikram Singh", "vikram@polaris.com", pass, Role.LOGISTICS, "AT_STATION", -70.7667, 11.7333),
                buildUser("Dr. Rajesh Kumar", "rajesh@polaris.com", pass, Role.LOGISTICS, "AT_STATION", -70.7667, 11.7333),
                buildUser("Amit Patel (Geologist)", "amit@polaris.com", pass, Role.SCIENTIST, "ON_TRAVERSE", -72.1000, 10.9000),
                buildUser("Lt. Cdr. Priya", "priya@polaris.com", pass, Role.LOGISTICS, "IN_TRANSIT", -55.0, 70.0),
                buildUser("Dr. Ritesh Desai", "ritesh@polaris.com", pass, Role.SCIENTIST, "QUARANTINE", -33.9249, 18.4241),
                buildUser("Pilot Arun Verma", "arun@polaris.com", pass, Role.LOGISTICS, "ON_TRAVERSE", -69.50, 76.0),
                buildUser("Mechanic John Doe", "john@polaris.com", pass, Role.LOGISTICS, "AT_STATION", -69.40, 76.19),
                buildUser("Dr. Meera N.", "meera@polaris.com", pass, Role.SCIENTIST, "AT_STATION", -69.40, 76.19)
            ));
        }
    }

    private User buildUser(String name, String email, String pass, Role role, String status, Double lat, Double lon) {
        return User.builder()
                .name(name).email(email).passwordHash(pass).role(role).expeditionId(44L)
                .currentStatus(status).lastLatitude(lat).lastLongitude(lon)
                .build();
    }

    private void seedAssets() {
        if (assetRepository.count() == 0) {
            assetRepository.saveAll(List.of(
                buildAsset("PistenBully 300W", AssetCategory.VEHICLE, "PB-01", AssetStatus.IN_USE),
                buildAsset("PistenBully 300 Polar", AssetCategory.VEHICLE, "PB-02", AssetStatus.AT_STATION),
                buildAsset("Kamov Ka-32 Helicopter", AssetCategory.VEHICLE, "HELI-1", AssetStatus.AT_STATION),
                buildAsset("Snow Scooter Yamaha", AssetCategory.VEHICLE, "SS-04", AssetStatus.IN_USE),
                buildAsset("Ice Core Drill Rig", AssetCategory.SCIENTIFIC, "DR-01", AssetStatus.IN_USE),
                buildAsset("Seismometer Array", AssetCategory.SCIENTIFIC, "SEIS-02", AssetStatus.AT_STATION),
                buildAsset("Portable VHF Repeater", AssetCategory.SCIENTIFIC, "VHF-01", AssetStatus.PACKED)
            ));
        }
    }

    private Asset buildAsset(String name, AssetCategory category, String qrCode, AssetStatus status) {
        return Asset.builder()
                .name(name).category(category).qrCode(qrCode).status(status).currentLocation("MAITRI_BASE")
                .isCritical(true).lastScannedAt(LocalDateTime.now()).expeditionId(44L).build();
    }

    private void seedInventory() {
        if (inventoryRepository.count() == 0) {
            inventoryRepository.saveAll(List.of(
                buildInv("High-Speed Diesel (HSD)", InventoryCategory.FUEL, 350000.0, "Liters", 50000.0, "Maitri Tank Farm A"),
                buildInv("Aviation Turbine Fuel (ATF)", InventoryCategory.FUEL, 120000.0, "Liters", 20000.0, "Maitri Helipad Barracks"),
                buildInv("Broad-Spectrum Antibiotics", InventoryCategory.MEDICAL, 15.0, "Courses", 50.0, "Maitri Med-Bay"),
                buildInv("Dehydrated Ration Packs", InventoryCategory.FOOD, 4500.0, "Meals", 1000.0, "Bharati Cold Store"),
                buildInv("Oxygen Cylinders (Medical)", InventoryCategory.MEDICAL, 45.0, "Units", 10.0, "Maitri Med-Bay"),
                buildInv("PistenBully Spare Tracks", InventoryCategory.SPARE, 4.0, "Pairs", 2.0, "Garage B"),
                buildInv("Arctic Tents", InventoryCategory.SCIENTIFIC, 12.0, "Units", 5.0, "Store C"),
                buildInv("Thermal Sleeping Bags", InventoryCategory.SCIENTIFIC, 50.0, "Units", 10.0, "Store C"),
                buildInv("Satellite Phones (Iridium)", InventoryCategory.SCIENTIFIC, 18.0, "Units", 5.0, "Comm Room"),
                buildInv("Vegetables (Frozen)", InventoryCategory.FOOD, 800.0, "Kg", 200.0, "Maitri Cold Store"),
                buildInv("Engine Oil (Synthetic)", InventoryCategory.SPARE, 1500.0, "Liters", 300.0, "Garage A"),
                buildInv("Emergency Flares", InventoryCategory.SCIENTIFIC, 200.0, "Units", 50.0, "Store A")
            ));
        }
    }

    private Inventory buildInv(String name, InventoryCategory cat, Double qty, String unit, Double min, String loc) {
        return Inventory.builder()
                .itemName(name).category(cat).quantity(qty).unit(unit)
                .minimumThreshold(min).storageLocation(loc).expeditionId(44L)
                .expiryDate(LocalDate.now().plusMonths(6)).alertSent(false)
                .build();
    }
}

