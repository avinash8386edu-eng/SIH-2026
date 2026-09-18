package com.polaris.controller;

import com.polaris.model.Emergency;
import com.polaris.model.EmergencyStatus;
import com.polaris.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.polaris.service.SmsService;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyRepository emergencyRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final SmsService smsService;

    @GetMapping
    public ResponseEntity<List<Emergency>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyRepository.findAll());
    }

    @PostMapping("/sos")
    public ResponseEntity<Emergency> triggerSOS(@RequestBody Emergency emergency) {
        emergency.setStatus(EmergencyStatus.ACTIVE);
        Emergency savedEmergency = emergencyRepository.save(emergency);
        
        // Broadcast via WebSocket
        messagingTemplate.convertAndSend("/topic/sos", savedEmergency);
        
        // Trigger Satellite SMS for ultimate resilience
        smsService.broadcastSatelliteSOS(
            "SOS [" + savedEmergency.getType() + "]: " + savedEmergency.getDescription(), 
            savedEmergency.getLatitude() + ", " + savedEmergency.getLongitude()
        );
        
        return ResponseEntity.ok(savedEmergency);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Emergency> resolveEmergency(@PathVariable Long id) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new com.polaris.exception.ResourceNotFoundException("Emergency not found"));
        
        emergency.setStatus(EmergencyStatus.RESOLVED);
        Emergency updatedEmergency = emergencyRepository.save(emergency);
        
        // Broadcast update via WebSocket
        messagingTemplate.convertAndSend("/topic/sos-updates", updatedEmergency);
        
        return ResponseEntity.ok(updatedEmergency);
    }
}

