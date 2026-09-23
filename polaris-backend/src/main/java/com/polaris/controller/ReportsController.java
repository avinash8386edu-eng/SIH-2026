package com.polaris.controller;

import com.polaris.model.AlertStatus;
import com.polaris.model.MissionStatus;
import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final CargoRepository cargoRepository;
    private final MissionRepository missionRepository;
    private final InventoryRepository inventoryRepository; // Or similar inventory repo
    private final AlertRepository alertRepository;
    private final TransportRepository transportRepository;
    private final UserRepository userRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCargo", cargoRepository.count());
        summary.put("activeMissions", missionRepository.countByStatus(MissionStatus.ACTIVE));
        summary.put("totalPersonnel", userRepository.count());
        summary.put("activeAlerts", alertRepository.countByStatus(AlertStatus.ACTIVE));
        summary.put("totalTransports", transportRepository.count());
        
        long inventoryCount = 0;
        try {
            inventoryCount = inventoryRepository.count();
        } catch (Exception e) {
            // ignore if repo unavailable
        }
        summary.put("inventoryItems", inventoryCount);
        return ResponseEntity.ok(summary);
    }
}
