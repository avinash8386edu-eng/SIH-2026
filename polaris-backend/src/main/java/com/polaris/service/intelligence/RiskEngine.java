package com.polaris.service.intelligence;

import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RiskEngine {
    private final MissionRepository missionRepository;
    private final TrackingEventRepository trackingEventRepository;
    private final InventoryRepository inventoryRepository;
    private final AlertRepository alertRepository;

    public Map<String, Object> calculateOverallRisk() {
        int score = 0;
        List<String> factors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        // Check active alerts
        long activeAlerts = alertRepository.countByStatus(com.polaris.model.AlertStatus.ACTIVE);
        if (activeAlerts > 0) {
            score += (activeAlerts * 25);
            factors.add("Active emergency alerts: " + activeAlerts);
            recommendations.add("Resolve active emergencies immediately.");
        }

        // Check inventory thresholds
        List<com.polaris.model.Inventory> lowStock = inventoryRepository.findLowStock();
        if (!lowStock.isEmpty()) {
            score += (lowStock.size() * 15);
            factors.add("Low stock inventory items: " + lowStock.size());
            recommendations.add("Expedite supply lines for low stock items.");
        }

        // Check stale tracking pings
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        List<com.polaris.model.TrackingEvent> latest = trackingEventRepository.findLatestTrackingEvents();
        long staleCount = latest.stream().filter(e -> e.getTimestamp().isBefore(threshold)).count();
        
        if (staleCount > 0) {
            score += (staleCount * 20);
            factors.add("Entities with stale telemetry (>15 mins): " + staleCount);
            recommendations.add("Dispatch search or ping entities with stale telemetry.");
        }

        score = Math.min(score, 100);

        String level = score > 75 ? "CRITICAL" : (score > 40 ? "WARNING" : "NOMINAL");

        Map<String, Object> result = new HashMap<>();
        result.put("timestamp", LocalDateTime.now().toString());
        result.put("overallScore", score);
        result.put("riskLevel", level);
        result.put("contributingFactors", factors);
        result.put("recommendations", recommendations);
        return result;
    }
}
