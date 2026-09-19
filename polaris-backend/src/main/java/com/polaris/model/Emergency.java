package com.polaris.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergencies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emergency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EmergencyType type;

    @Enumerated(EnumType.STRING)
    private EmergencySeverity severity;

    private Long reportedBy;

    private Double latitude;

    private Double longitude;

    private String description;

    @Enumerated(EnumType.STRING)
    private EmergencyStatus status;

    @Builder.Default
    private Boolean offlineQueued = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
