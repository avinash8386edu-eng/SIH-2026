package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "satellite_routes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SatelliteRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String routeName;
    private Double originLat;
    private Double originLng;
    private Double destinationLat;
    private Double destinationLng;

    @Column(columnDefinition = "LONGTEXT")
    private String routeGeoJson;

    @Column(columnDefinition = "LONGTEXT")
    private String dangerZonesGeoJson;

    private Double totalDistanceKm;
    private Double estimatedHours;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskScore;

    private LocalDateTime createdAt;
    private LocalDate satelliteImageDate;

    @Builder.Default
    private Boolean processed = false;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
