package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cargo_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CargoEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long cargoId;

    @Enumerated(EnumType.STRING)
    private CargoEventType eventType;

    private String location;
    private Long stationId;
    private Double latitude;
    private Double longitude;
    private String notes;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    private String updatedBy;
}

