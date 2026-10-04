package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private Long entityId;

    private Double latitude;
    private Double longitude;
    private Double altitude;
    private Double speed;
    private Double heading;
    private Double batteryLevel;
    private Double signalStrength;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }
}

