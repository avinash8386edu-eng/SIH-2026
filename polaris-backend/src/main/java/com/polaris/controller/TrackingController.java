package com.polaris.controller;

import com.polaris.model.TrackingEvent;
import com.polaris.repository.TrackingEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingEventRepository trackingEventRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/update")
    public ResponseEntity<TrackingEvent> updateTracking(@RequestBody TrackingEvent trackingEvent) {
        TrackingEvent saved = trackingEventRepository.save(trackingEvent);
        // Broadcast telemetry to all connected clients for live map tracking
        messagingTemplate.convertAndSend("/topic/telemetry", saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/live")
    public ResponseEntity<List<TrackingEvent>> getLiveTracking() {
        List<TrackingEvent> allEvents = trackingEventRepository.findAll();
        // Group by entityType+entityId and get latest
        Map<String, TrackingEvent> latestEvents = allEvents.stream()
                .collect(Collectors.toMap(
                        e -> e.getEntityType() + "-" + e.getEntityId(),
                        e -> e,
                        (e1, e2) -> e1.getTimestamp().isAfter(e2.getTimestamp()) ? e1 : e2
                ));
        return ResponseEntity.ok(List.copyOf(latestEvents.values()));
    }

    @GetMapping("/history/{entityType}/{entityId}")
    public ResponseEntity<List<TrackingEvent>> getTrackingHistory(@PathVariable String entityType, @PathVariable Long entityId) {
        List<TrackingEvent> history = trackingEventRepository.findAll().stream()
                .filter(e -> entityType.equals(e.getEntityType()) && entityId.equals(e.getEntityId()))
                .sorted((e1, e2) -> e2.getTimestamp().compareTo(e1.getTimestamp()))
                .toList();
        return ResponseEntity.ok(history);
    }
}
