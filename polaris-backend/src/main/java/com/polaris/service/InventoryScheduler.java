package com.polaris.service;

import com.polaris.model.Inventory;
import com.polaris.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryScheduler {

    private final InventoryRepository inventoryRepository;

    // Run at midnight every day
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkInventoryStatus() {
        log.info("Running daily inventory checks...");

        // 1. Check for expiring items (e.g., within 30 days)
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        List<Inventory> expiringItems = inventoryRepository.findExpiringBefore(thirtyDaysFromNow);
        
        for (Inventory item : expiringItems) {
            if (!item.getAlertSent()) {
                log.warn("ALERT: Item {} is expiring on {}", item.getItemName(), item.getExpiryDate());
                // In a real app, send an email or WebSocket notification here
                item.setAlertSent(true);
                inventoryRepository.save(item);
            }
        }

        // 2. Check for low stock
        List<Inventory> lowStockItems = inventoryRepository.findLowStock();
        for (Inventory item : lowStockItems) {
             log.warn("ALERT: Low stock for {}. Current quantity: {}, Minimum threshold: {}", 
                     item.getItemName(), item.getQuantity(), item.getMinimumThreshold());
             // Similar to expiry, handle alert notification
        }
        
        log.info("Daily inventory checks completed.");
    }
}
