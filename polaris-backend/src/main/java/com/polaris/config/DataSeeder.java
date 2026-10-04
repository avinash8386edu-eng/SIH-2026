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
    private final ExpeditionRepository expeditionRepository;

    @Override
    public void run(String... args) throws Exception {
        seedExpeditions();
        seedUsers();
        seedAssets();
        seedInventory();
        System.out.println("Ã¢Å“â€¦ 44th ISEA Data Seeded Successfully with MASSIVE payload!");
    }

    private void seedExpeditions() {
        if (!expeditionRepository.findById(43L).isPresent()) {
            Expedition exp = Expedition.builder()
                .id(43L)
                .name("43rd ISEA")
                
                .startDate(LocalDate.of(2023, 11, 1))
                .endDate(LocalDate.of(2025, 4, 30))
                .station(Station.BOTH)
                .build();
            expeditionRepository.save(exp);
        }
    }

    private void seedUsers() {
        seedUserIfNotExists("Denney George (VU2DGR)", "admin@polaris.com", "admin123", Role.ADMIN, "ACTIVE");
        seedUserIfNotExists("Subrata Moulik (Maitri)", "commander@polaris.com", "commander123", Role.COMMANDER, "ACTIVE");
        seedUserIfNotExists("Dr. Yogesh Ray (Expedition Leader)", "scientist1@polaris.com", "sci123", Role.SCIENTIST, "ON_TRAVERSE");
        seedUserIfNotExists("Showmitra Chowdhury (CSC)", "scientist2@polaris.com", "sci123", Role.SCIENTIST, "ON_TRAVERSE");
    }

    private void seedUserIfNotExists(String name, String email, String password, Role role, String status) {
        if (!userRepository.findByEmail(email).isPresent()) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .expeditionId(43L)
                    .currentStatus(status)
                    .build();
            userRepository.save(user);
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

