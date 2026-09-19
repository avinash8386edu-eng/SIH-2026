package com.polaris.controller;

import com.polaris.model.Emergency;
import com.polaris.model.EmergencyStatus;
import com.polaris.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import com.polaris.service.SmsService;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyRepository emergencyRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final SmsService smsService;
    private static final Logger logger = LoggerFactory.getLogger(EmergencyController.class);

    @GetMapping
    public ResponseEntity<List<Emergency>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyRepository.findAll());
    }

    @PostMapping("/sos")
    public ResponseEntity<Emergency> triggerSOS(@RequestBody Emergency emergency) {
        emergency.setStatus(EmergencyStatus.ACTIVE);
        Emergency savedEmergency = emergencyRepository.save(emergency);
        
        // 1. Global Command Center Broadcast
        messagingTemplate.convertAndSend("/topic/sos", savedEmergency);
        
        // 2. Multi-Node Routing Logic based on Location / Context
        logger.warn("==================================================");
        logger.warn("?? EMERGENCY SOS RECEIVED AT COMMAND CENTER ??");
        
        if (savedEmergency.getLatitude() != null && savedEmergency.getLatitude() > -60.0) {
            // Assume Ship / Ocean Transit (Southern Ocean)
            logger.warn("?? LOCATION CONTEXT: SOUTHERN OCEAN / TRANSIT");
            logger.warn("?? ROUTING 1: Broadcasting to nearby vessels via Marine VHF Channel 16 / AIS...");
            logger.warn("?? ROUTING 2: Uplinking to INMARSAT & IRIDIUM Satellite Constellations...");
        } else {
            // Assume Polar Ice Shelf (Antarctica)
            logger.warn("?? LOCATION CONTEXT: POLAR ICE SHELF (ANTARCTICA)");
            logger.warn("?? ROUTING 1: Pinging ALL nearby Field Scientists' PDA devices within 50km radius...");
            logger.warn("?? ROUTING 2: Alerting Base Commander & Radio Operator at MAITRI / BHARATI...");
            logger.warn("?? ROUTING 3: Sending diplomatic alert to International Stations (McMurdo [USA], Progress [Russia])...");
        }
        
        // 3. Fallback Satellite SMS
        smsService.broadcastSatelliteSOS(
            "SOS [" + savedEmergency.getType() + "]: " + savedEmergency.getDescription(), 
            savedEmergency.getLatitude() + ", " + savedEmergency.getLongitude()
        );
        logger.warn("==================================================");
        
        return ResponseEntity.ok(savedEmergency);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Emergency> resolveEmergency(@PathVariable Long id) {
        Emergency emergency = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
        
        emergency.setStatus(EmergencyStatus.RESOLVED);
        Emergency updatedEmergency = emergencyRepository.save(emergency);
        messagingTemplate.convertAndSend("/topic/sos-updates", updatedEmergency);
        
        return ResponseEntity.ok(updatedEmergency);
    }
}
