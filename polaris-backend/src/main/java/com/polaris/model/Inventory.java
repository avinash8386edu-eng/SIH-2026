package com.polaris.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "inventories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    @Enumerated(EnumType.STRING)
    private InventoryCategory category;

    private Double quantity;

    private String unit;

    private Double minimumThreshold;

    private LocalDate expiryDate;

    private String storageLocation;

    private Long expeditionId;

    @Builder.Default
    private Boolean alertSent = false;
}
