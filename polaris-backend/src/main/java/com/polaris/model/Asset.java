package com.polaris.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String qrCode;

    private String name;

    @Enumerated(EnumType.STRING)
    private AssetCategory category;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;

    private String currentLocation;

    private Long expeditionId;

    private Boolean isCritical;

    private LocalDateTime lastScannedAt;
}
