package com.polaris.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "missions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String missionName;

    @Enumerated(EnumType.STRING)
    private MissionType missionType;

    @Enumerated(EnumType.STRING)
    private MissionStatus status;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Long originStationId;
    private Long destinationStationId;
    private Long teamLeadId;
    private LocalDateTime startTime;
    private LocalDateTime expectedReturn;
    private LocalDateTime actualReturn;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String routeGeoJson;

    private Long expeditionId;
}
