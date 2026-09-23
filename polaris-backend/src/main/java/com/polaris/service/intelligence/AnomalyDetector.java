package com.polaris.service.intelligence;

import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnomalyDetector {
    private final TrackingEventRepository trackingEventRepository;
    private final MissionRepository missionRepository;
    private final AlertRepository alertRepository;

    public List<Map<String, Object>> scanAnomalies() {
        List<Map<String, Object>> anomalies = new ArrayList<>();
        
        List<com.polaris.model.TrackingEvent> latest = trackingEventRepository.findLatestTrackingEvents();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        for (com.polaris.model.TrackingEvent event : latest) {
            if (event.getTimestamp().isBefore(now.minusMinutes(15))) {
                anomalies.add(createAnomaly(event, "SIGNAL_LOST", "No telemetry received for over 15 minutes."));
            }
            if (event.getBatteryLevel() != null && event.getBatteryLevel() < 20.0) {
                anomalies.add(createAnomaly(event, "LOW_BATTERY", "Battery level critically low: " + event.getBatteryLevel() + "%"));
            }
            if (event.getSpeed() != null && event.getSpeed() == 0 && event.getTimestamp().isBefore(now.minusHours(2))) {
                anomalies.add(createAnomaly(event, "STATIONARY", "Entity stationary for > 2 hours."));
            }
        }
        return anomalies;
    }

    private Map<String, Object> createAnomaly(com.polaris.model.TrackingEvent event, String type, String desc) {
        Map<String, Object> map = new HashMap<>();
        map.put("entityType", event.getEntityType());
        map.put("entityId", event.getEntityId());
        map.put("anomalyType", type);
        map.put("description", desc);
        map.put("detectedAt", java.time.LocalDateTime.now().toString());
        return map;
    }
}
