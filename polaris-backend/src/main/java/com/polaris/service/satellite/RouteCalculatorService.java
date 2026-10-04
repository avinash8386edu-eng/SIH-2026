package com.polaris.service.satellite;

import com.polaris.model.RiskLevel;
import com.polaris.model.SatelliteRoute;
import com.polaris.repository.SatelliteRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RouteCalculatorService {

    private final SatelliteRouteRepository repository;

    public SatelliteRoute calculateSafeRoute(double originLat, double originLng, double destLat, double destLng) {
        // Haversine distance calculation (in km)
        double R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(destLat - originLat);
        double dLon = Math.toRadians(destLng - originLng);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(originLat)) * Math.cos(Math.toRadians(destLat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double straightDistance = R * c;

        // Simulate A* routing by adding 15% distance for avoiding crevasses
        double safeDistance = straightDistance * 1.15;
        double estimatedHours = safeDistance / 20.0; // Assume 20km/h for polar vehicles

        // Generate GeoJSON line for the route (origin -> midpoint deviation -> destination)
        // Midpoint deviation to simulate avoiding a crevasse
        double midLat = (originLat + destLat) / 2.0 + 0.05; 
        double midLng = (originLng + destLng) / 2.0 + 0.05;

        String routeGeoJson = String.format(
            "{\"type\":\"Feature\",\"geometry\":{\"type\":\"LineString\",\"coordinates\":[[%f,%f],[%f,%f],[%f,%f]]}}",
            originLng, originLat, midLng, midLat, destLng, destLat
        );

        // Simulated danger zone (crevasse) near the midpoint
        String dangerZoneGeoJson = String.format(
            "{\"type\":\"Feature\",\"properties\":{\"type\":\"CREVASSE\"},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[%f,%f],[%f,%f],[%f,%f],[%f,%f],[%f,%f]]]}}",
            midLng - 0.02, midLat - 0.02,
            midLng + 0.02, midLat - 0.02,
            midLng + 0.02, midLat + 0.02,
            midLng - 0.02, midLat + 0.02,
            midLng - 0.02, midLat - 0.02
        );

        SatelliteRoute route = SatelliteRoute.builder()
                .routeName("SAFE-ROUTE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .originLat(originLat).originLng(originLng)
                .destinationLat(destLat).destinationLng(destLng)
                .totalDistanceKm(Math.round(safeDistance * 100.0) / 100.0)
                .estimatedHours(Math.round(estimatedHours * 10.0) / 10.0)
                .routeGeoJson(routeGeoJson)
                .dangerZonesGeoJson(dangerZoneGeoJson)
                .riskScore(RiskLevel.LOW)
                .satelliteImageDate(LocalDate.now().minusDays(1))
                .processed(true)
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(route);
    }
}
