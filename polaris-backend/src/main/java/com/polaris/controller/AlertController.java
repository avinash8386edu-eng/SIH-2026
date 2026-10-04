package com.polaris.controller;

import com.polaris.exception.ResourceNotFoundException;
import com.polaris.model.Alert;
import com.polaris.model.AlertStatus;
import com.polaris.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertRepository alertRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/sos")
    public ResponseEntity<Alert> createSosAlert(@RequestBody Alert alert) {
        alert.setStatus(AlertStatus.ACTIVE);
        if (alert.getTitle() == null) {
            alert.setTitle("SOS EMERGENCY: " + alert.getAlertType().name());
        }
        Alert savedAlert = alertRepository.save(alert);
        
        // Broadcast to all connected clients
        messagingTemplate.convertAndSend("/topic/alerts", savedAlert);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAlert);
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts(@RequestParam(required = false, defaultValue = "ACTIVE") AlertStatus status) {
        return ResponseEntity.ok(alertRepository.findByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        return ResponseEntity.ok(alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id)));
    }

    @PatchMapping("/{id}/acknowledge")
    public ResponseEntity<Alert> acknowledgeAlert(@PathVariable Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));
        alert.setStatus(AlertStatus.ACKNOWLEDGED);
        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));
        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        return ResponseEntity.ok(alertRepository.save(alert));
    }
}
