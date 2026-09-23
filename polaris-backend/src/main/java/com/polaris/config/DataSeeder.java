package com.polaris.config;

import com.polaris.model.*;
import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
        System.out.println("?? 43rd ISEA (Indian Scientific Expedition to Antarctica) Data Seeded Successfully!");
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

    private void seedAssets() {
        if (assetRepository.count() == 0) {
            Asset asset1 = Asset.builder()
                    .qrCode("POL-SCI-001")
                    .name("Milli-Q Ultra Water System")
                    .category(AssetCategory.SCIENTIFIC)
                    .status(AssetStatus.AT_STATION)
                    .currentLocation("Bharati Modular Lab")
                    .expeditionId(43L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusHours(2))
                    .build();

            Asset asset2 = Asset.builder()
                    .qrCode("POL-MED-002")
                    .name("Advanced Frostbite & Necrosis Kit")
                    .category(AssetCategory.MEDICAL)
                    .status(AssetStatus.ON_VESSEL)
                    .currentLocation("MV Vasiliy Golovnin")
                    .expeditionId(43L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusDays(1))
                    .build();

            Asset asset3 = Asset.builder()
                    .qrCode("AST_001")
                    .name("Kamov Ka-32 Helicopter")
                    .category(AssetCategory.VEHICLE)
                    .status(AssetStatus.ON_VESSEL)
                    .currentLocation("India Bay Ice Shelf")
                    .expeditionId(43L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusHours(5))
                    .build();
                    
            Asset asset4 = Asset.builder()
                    .qrCode("AST_003")
                    .name("PistenBully Polar 300 Tracked Vehicle")
                    .category(AssetCategory.VEHICLE)
                    .status(AssetStatus.AT_STATION)
                    .currentLocation("Maitri Station")
                    .expeditionId(43L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusMinutes(30))
                    .build();

            assetRepository.saveAll(List.of(asset1, asset2, asset3, asset4));
        }
    }

    private void seedInventory() {
        if (inventoryRepository.count() == 0) {
            Inventory fuel1 = Inventory.builder()
                    .itemName("Aviation Turbine Fuel (ATF)")
                    .category(InventoryCategory.FUEL)
                    .quantity(500.0)
                    .unit("Barrels")
                    .minimumThreshold(100.0)
                    .expiryDate(LocalDate.now().plusYears(2))
                    .storageLocation("Maitri Fuel Dump")
                    .expeditionId(43L)
                    .build();

            Inventory fuel2 = Inventory.builder()
                    .itemName("High-Speed Diesel (HSD)")
                    .category(InventoryCategory.FUEL)
                    .quantity(350000.0)
                    .unit("Liters")
                    .minimumThreshold(50000.0)
                    .expiryDate(LocalDate.now().plusYears(1))
                    .storageLocation("Bharati Generator Tanks")
                    .expeditionId(43L)
                    .build();
            
            Inventory food = Inventory.builder()
                    .itemName("DFRL MRE: Vegetable Pulav")
                    .category(InventoryCategory.FOOD)
                    .quantity(1200.0)
                    .unit("Pouches")
                    .minimumThreshold(300.0)
                    .expiryDate(LocalDate.now().plusMonths(12))
                    .storageLocation("Maitri Pantry")
                    .expeditionId(43L)
                    .build();

            Inventory expiringMed = Inventory.builder()
                    .itemName("Broad-Spectrum Antibiotics")
                    .category(InventoryCategory.MEDICAL)
                    .quantity(15.0)
                    .unit("Courses")
                    .minimumThreshold(50.0) // Below threshold!
                    .expiryDate(LocalDate.now().plusDays(8)) // Expiring soon!
                    .storageLocation("Bharati Medical Bay")
                    .expeditionId(43L)
                    .build();

            inventoryRepository.saveAll(List.of(fuel1, fuel2, food, expiringMed));
        }
    }
}


