package com.polaris.controller;

import com.polaris.exception.ResourceNotFoundException;
import com.polaris.model.SatelliteRoute;
import com.polaris.repository.SatelliteRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.polaris.service.satellite.RouteCalculatorService;

@RestController
@RequestMapping("/api/satellite")
@RequiredArgsConstructor
public class SatelliteController {

    private final SatelliteRouteRepository satelliteRouteRepository;
    private final RouteCalculatorService routeCalculatorService;

    @GetMapping("/routes")
    public ResponseEntity<List<SatelliteRoute>> getAllRoutes() {
        return ResponseEntity.ok(satelliteRouteRepository.findAll());
    }

    @PostMapping("/route/calculate")
    public ResponseEntity<SatelliteRoute> calculateRoute(@RequestBody SatelliteRoute request) {
        SatelliteRoute calculated = routeCalculatorService.calculateSafeRoute(
                request.getOriginLat(), request.getOriginLng(),
                request.getDestinationLat(), request.getDestinationLng()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(calculated);
    }

    @GetMapping("/danger-zones")
    public ResponseEntity<List<String>> getDangerZones() {
        return ResponseEntity.ok(satelliteRouteRepository.findAll().stream()
                .map(SatelliteRoute::getDangerZonesGeoJson)
                .filter(z -> z != null && !z.isEmpty())
                .toList());
    }

    @GetMapping("/routes/{id}")
    public ResponseEntity<SatelliteRoute> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(satelliteRouteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SatelliteRoute not found with id: " + id)));
    }
}
