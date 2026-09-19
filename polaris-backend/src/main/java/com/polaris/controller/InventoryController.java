package com.polaris.controller;

import com.polaris.model.Inventory;
import com.polaris.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(inventoryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        return ResponseEntity.ok(inventoryRepository.save(inventory));
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<Inventory>> getExpiringInventory() {
        // e.g. expiring within next 30 days
        LocalDate nextMonth = LocalDate.now().plusDays(30);
        return ResponseEntity.ok(inventoryRepository.findExpiringBefore(nextMonth));
    }
}

