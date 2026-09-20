package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "transports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String transportName;

    @Enumerated(EnumType.STRING)
    private TransportType type;

    private Double capacity;

    @Enumerated(EnumType.STRING)
    private TransportStatus status;

    private Long currentStationId;
    private Double fuelLevel;
    private LocalDate lastMaintenanceDate;
    private Long expeditionId;
}
