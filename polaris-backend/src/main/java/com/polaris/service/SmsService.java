package com.polaris.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    /**
     * Simulates sending a highly resilient SMS broadcast over the Iridium Satellite Network 
     * when an emergency is declared in an offline/low-bandwidth environment.
     */
    public void broadcastSatelliteSOS(String message, String coordinates) {
        log.warn("==================================================");
        log.warn("🚨 INITIATING SATELLITE SOS BROADCAST 🚨");
        log.warn("📡 NETWORK: IRIDIUM SHORT BURST DATA (SBD)");
        log.warn("📍 COORDINATES: {}", coordinates != null ? coordinates : "UNKNOWN/OFFLINE");
        log.warn("✉️ PAYLOAD: {}", message);
        log.warn("⚠️ STATUS: TRANSMITTED TO NCPOR GOA COMMAND CENTER");
        log.warn("==================================================");
    }
}
