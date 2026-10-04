package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cargoCode;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private CargoCategory category;

    private Double weight;

    @Enumerated(EnumType.STRING)
    private CargoPriority priority;

    @Enumerated(EnumType.STRING)
    private CargoStatus status;

    @Column(unique = true)
    private String qrCode;

    private Long originStationId;
    private Long destinationStationId;
    private Double currentLatitude;
    private Double currentLongitude;
    private String description;
    private Long expeditionId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
