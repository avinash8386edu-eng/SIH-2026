package com.polaris.service.intelligence;

import com.polaris.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DelayPredictor {
    private final CargoRepository cargoRepository;
    private final CargoEventRepository cargoEventRepository;
    // Injecting StationRepository if exists, else skipping

    public Map<String, Object> predictDelay(Long cargoId) {
        float probability = 0.0f;
        List<String> factors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        Optional<com.polaris.model.Cargo> cargoOpt = cargoRepository.findById(cargoId);
        if (cargoOpt.isPresent()) {
            com.polaris.model.Cargo cargo = cargoOpt.get();
            if (cargo.getStatus() == com.polaris.model.CargoStatus.DELAYED) {
                probability += 0.65f;
                factors.add("Cargo already marked as DELAYED.");
            } else if (cargo.getStatus() == com.polaris.model.CargoStatus.IN_TRANSIT) {
                probability += 0.15f;
                factors.add("Cargo is IN_TRANSIT.");
            }

            long delayEvents = cargoEventRepository.findByCargoIdOrderByTimestampAsc(cargoId).stream()
                .filter(e -> com.polaris.model.CargoEventType.DELAYED.equals(e.getEventType()))
                .count();
            if (delayEvents > 0) {
                probability += Math.min(delayEvents * 0.08f, 0.40f);
                factors.add("Cargo has " + delayEvents + " historical delay events.");
            }
            
            if (cargo.getWeight() != null && cargo.getWeight() > 5000) {
                probability += 0.10f;
                factors.add("Heavy cargo (>5000kg) typically incurs handling delays.");
            }
        }
        
        probability = Math.min(probability, 0.95f);
        probability = Math.max(probability, 0.0f);

        int probPercent = (int)(probability * 100);

        Map<String, Object> result = new HashMap<>();
        result.put("cargoId", cargoId);
        result.put("delayProbability", probPercent);
        result.put("delayRiskFactors", factors);
        result.put("recommendations", recommendations);
        return result;
    }
}

