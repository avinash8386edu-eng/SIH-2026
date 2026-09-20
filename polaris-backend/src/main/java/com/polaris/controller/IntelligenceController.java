package com.polaris.controller;

import com.polaris.service.intelligence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/intelligence")
@RequiredArgsConstructor
public class IntelligenceController {

    private final RiskEngine riskEngine;
    private final DelayPredictor delayPredictor;
    private final InventoryForecaster inventoryForecaster;
    private final AnomalyDetector anomalyDetector;
    private final WhatIfSimulator whatIfSimulator;

    @GetMapping("/risk")
    public ResponseEntity<?> getRisk() {
        return ResponseEntity.ok(riskEngine.calculateOverallRisk());
    }

    @GetMapping("/cargo/{id}/delay-prediction")
    public ResponseEntity<?> getDelayPrediction(@PathVariable Long id) {
        return ResponseEntity.ok(delayPredictor.predictDelay(id));
    }

    @GetMapping("/inventory/forecast")
    public ResponseEntity<?> getInventoryForecast() {
        return ResponseEntity.ok(inventoryForecaster.forecastAll());
    }

    @GetMapping("/anomalies")
    public ResponseEntity<?> getAnomalies() {
        return ResponseEntity.ok(anomalyDetector.scanAnomalies());
    }

    @PostMapping("/what-if")
    public ResponseEntity<?> simulateWhatIf(@RequestBody Map<String, Object> body) {
        String scenario = (String) body.get("scenario");
        Map<String, Object> params = (Map<String, Object>) body.get("params");
        return ResponseEntity.ok(whatIfSimulator.simulate(scenario, params));
    }
}
