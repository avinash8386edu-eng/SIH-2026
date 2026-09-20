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

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAssets();
        seedInventory();
        System.out.println("?? 43rd ISEA (Indian Scientific Expedition to Antarctica) Data Seeded Successfully!");
    }

    private void seedUsers() {
        // HACKATHON DEMO MODE: Always reseed to ensure fresh BCrypt hashes
        if (userRepository.count() > 0) {
            userRepository.deleteAll();
            System.out.println("🔄 Cleared stale user records for fresh demo seeding.");
        }
        {
            User admin = User.builder()
                    .name("Denney George (VU2DGR)")
                    .email("admin@polaris.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .expeditionId(43L)
                    .currentStatus("ACTIVE")
                    .build();

            User commander = User.builder()
                    .name("Subrata Moulik (Maitri)")
                    .email("commander@polaris.com")
                    .passwordHash(passwordEncoder.encode("commander123"))
                    .role(Role.COMMANDER)
                    .expeditionId(43L)
                    .currentStatus("ACTIVE")
                    .build();

            User scientist1 = User.builder()
                    .name("Dr. Yogesh Ray (Expedition Leader)")
                    .email("scientist1@polaris.com")
                    .passwordHash(passwordEncoder.encode("sci123"))
                    .role(Role.SCIENTIST)
                    .expeditionId(43L)
                    .currentStatus("ON_TRAVERSE")
                    .lastLatitude(-70.7661) // Maitri Area
                    .lastLongitude(11.7322)
                    .build();

            User scientist2 = User.builder()
                    .name("Showmitra Chowdhury (CSC)")
                    .email("scientist2@polaris.com")
                    .passwordHash(passwordEncoder.encode("sci123"))
                    .role(Role.SCIENTIST)
                    .expeditionId(43L)
                    .currentStatus("ON_TRAVERSE")
                    .lastLatitude(-69.4069) // Bharati Area
                    .lastLongitude(76.1953)
                    .build();

            userRepository.saveAll(List.of(admin, commander, scientist1, scientist2));
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
