package com.polaris.service.intelligence;

import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class WhatIfSimulator {
    private final InventoryRepository inventoryRepository;
    private final MissionRepository missionRepository;

    public Map<String, Object> simulate(String scenario, Map<String, Object> params) {
        Map<String, Object> results = new HashMap<>();
        List<String> affectedItems = new ArrayList<>();
        List<String> criticalShortages = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        
        List<com.polaris.model.Inventory> items = inventoryRepository.findAll();
        
        if ("VESSEL_DELAY".equals(scenario)) {
            int delayDays = params.containsKey("days") ? Integer.parseInt(params.get("days").toString()) : 14;
            recommendations.add("Simulating a supply vessel delay of " + delayDays + " days.");
            
            for (com.polaris.model.Inventory item : items) {
                double burnRate = item.getCategory() == com.polaris.model.InventoryCategory.FUEL ? 200.0 : 15.0;
                int currentDays = (int) (item.getQuantity() / burnRate);
                if (currentDays < delayDays + 7) {
                    affectedItems.add(item.getItemName());
                    if (currentDays < delayDays) {
                        criticalShortages.add(item.getItemName() + " (will run out before vessel arrives!)");
                    }
                }
            }
        } else if ("FUEL_SPIKE".equals(scenario)) {
            double multiplier = params.containsKey("multiplier") ? Double.parseDouble(params.get("multiplier").toString()) : 1.5;
            recommendations.add("Simulating a fuel burn rate spike by " + multiplier + "x due to severe weather.");
            
            for (com.polaris.model.Inventory item : items) {
                if (item.getCategory() == com.polaris.model.InventoryCategory.FUEL) {
                    affectedItems.add(item.getItemName());
                    double newBurn = 200.0 * multiplier;
                    int newDays = (int) (item.getQuantity() / newBurn);
                    if (newDays < 14) {
                        criticalShortages.add(item.getItemName() + " (Fuel will last only " + newDays + " days at this rate)");
                    }
                }
            }
        }
        
        results.put("scenario", scenario);
        results.put("affectedItems", affectedItems);
        results.put("criticalShortages", criticalShortages);
        results.put("recommendations", recommendations);
        return results;
    }
}
