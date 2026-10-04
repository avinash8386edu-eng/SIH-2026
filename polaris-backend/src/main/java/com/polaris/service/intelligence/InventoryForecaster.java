package com.polaris.service.intelligence;

import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InventoryForecaster {
    private final InventoryRepository inventoryRepository;
    private final AlertRepository alertRepository;

    public List<Map<String, Object>> forecastAll() {
        List<Map<String, Object>> forecasts = new ArrayList<>();
        List<com.polaris.model.Inventory> items = inventoryRepository.findAll();
        
        for (com.polaris.model.Inventory item : items) {
            Map<String, Object> forecast = new HashMap<>();
            forecast.put("itemId", item.getId());
            forecast.put("itemName", item.getItemName());
            forecast.put("currentQuantity", item.getQuantity());
            
            // Heuristic burn rates
            double burnRate = 0;
            if (item.getCategory() == com.polaris.model.InventoryCategory.FUEL) {
                burnRate = 200.0; // 200L/day
            } else if (item.getCategory() == com.polaris.model.InventoryCategory.FOOD) {
                burnRate = 15.0;
            } else {
                burnRate = 1.0;
            }
            
            int daysRemaining = (int) (item.getQuantity() / burnRate);
            forecast.put("burnRatePerDay", burnRate);
            forecast.put("daysRemaining", daysRemaining);
            
            if (daysRemaining < 7) {
                forecast.put("status", "CRITICAL");
            } else if (daysRemaining < 30) {
                forecast.put("status", "WARNING");
            } else {
                forecast.put("status", "NOMINAL");
            }
            
            forecasts.add(forecast);
        }
        
        return forecasts;
    }
}
