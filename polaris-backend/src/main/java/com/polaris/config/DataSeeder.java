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
        System.out.println("???? POLARIS Demo Data Seeded Successfully!");
    }

    private void seedUsers() {
        if (userRepository.findByEmail("admin@polaris.com").isEmpty()) {
            User admin = User.builder()
                    .name("NCPOR Admin")
                    .email("admin@polaris.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .expeditionId(44L)
                    .currentStatus("ACTIVE")
                    .build();
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("commander@polaris.com").isEmpty()) {
            User commander = User.builder()
                    .name("Station Commander")
                    .email("commander@polaris.com")
                    .passwordHash(passwordEncoder.encode("commander123"))
                    .role(Role.COMMANDER)
                    .expeditionId(44L)
                    .currentStatus("ACTIVE")
                    .build();
            userRepository.save(commander);
        }

        if (userRepository.findByEmail("scientist1@polaris.com").isEmpty()) {
            User scientist1 = User.builder()
                    .name("Dr. Arvind (Field Team)")
                    .email("scientist1@polaris.com")
                    .passwordHash(passwordEncoder.encode("sci123"))
                    .role(Role.SCIENTIST)
                    .expeditionId(44L)
                    .currentStatus("ON_TRAVERSE")
                    .lastLatitude(-75.250973)
                    .lastLongitude(106.237096)
                    .build();
            userRepository.save(scientist1);
        }

        if (userRepository.findByEmail("scientist2@polaris.com").isEmpty()) {
            User scientist2 = User.builder()
                    .name("Dr. Meera (Ice Core)")
                    .email("scientist2@polaris.com")
                    .passwordHash(passwordEncoder.encode("sci123"))
                    .role(Role.SCIENTIST)
                    .expeditionId(44L)
                    .currentStatus("ON_TRAVERSE")
                    .lastLatitude(-75.300000)
                    .lastLongitude(106.100000)
                    .build();
            userRepository.save(scientist2);
        }
    }

    private void seedAssets() {
        if (assetRepository.findByQrCode("POL-SCI-001").isEmpty()) {
            Asset asset1 = Asset.builder()
                    .qrCode("POL-SCI-001")
                    .name("Seismometer Alpha")
                    .category(AssetCategory.SCIENTIFIC)
                    .status(AssetStatus.AT_STATION)
                    .currentLocation("Bharati Station")
                    .expeditionId(44L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusHours(2))
                    .build();
            assetRepository.save(asset1);
        }

        if (assetRepository.findByQrCode("POL-MED-002").isEmpty()) {
            Asset asset2 = Asset.builder()
                    .qrCode("POL-MED-002")
                    .name("Emergency Trauma Kit")
                    .category(AssetCategory.MEDICAL)
                    .status(AssetStatus.ON_VESSEL)
                    .currentLocation("MV Ivan Papanin")
                    .expeditionId(44L)
                    .isCritical(true)
                    .lastScannedAt(LocalDateTime.now().minusDays(1))
                    .build();
            assetRepository.save(asset2);
        }
    }

    private void seedInventory() {
        if (inventoryRepository.count() == 0) {
            Inventory food = Inventory.builder()
                    .itemName("MRE Winter Ration Packs")
                    .category(InventoryCategory.FOOD)
                    .quantity(500.0)
                    .unit("Boxes")
                    .minimumThreshold(100.0)
                    .expiryDate(LocalDate.now().plusMonths(6))
                    .storageLocation("Warehouse B")
                    .expeditionId(44L)
                    .build();

            Inventory fuel = Inventory.builder()
                    .itemName("Winter Diesel (ATF)")
                    .category(InventoryCategory.FUEL)
                    .quantity(15000.0)
                    .unit("Liters")
                    .minimumThreshold(5000.0)
                    .expiryDate(LocalDate.now().plusYears(1))
                    .storageLocation("Fuel Dump 1")
                    .expeditionId(44L)
                    .build();
            
            Inventory expiringMed = Inventory.builder()
                    .itemName("Amoxicillin Antibiotics")
                    .category(InventoryCategory.MEDICAL)
                    .quantity(50.0)
                    .unit("Packs")
                    .minimumThreshold(100.0) // Below threshold!
                    .expiryDate(LocalDate.now().plusDays(10)) // Expiring soon!
                    .storageLocation("Medical Bay")
                    .expeditionId(44L)
                    .build();

            inventoryRepository.saveAll(List.of(food, fuel, expiringMed));
        }
    }
}

