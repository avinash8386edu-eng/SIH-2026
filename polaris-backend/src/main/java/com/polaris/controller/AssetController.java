package com.polaris.controller;

import com.polaris.dto.StatusUpdateRequest;
import com.polaris.model.Asset;
import com.polaris.model.AssetStatus;
import com.polaris.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetRepository assetRepository;

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        asset.setLastScannedAt(LocalDateTime.now());
        return ResponseEntity.ok(assetRepository.save(asset));
    }

    @PreAuthorize("hasRole('COMMANDER') or hasRole('LOGISTICS')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Asset> updateAssetStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Asset asset = assetRepository.findById(id).orElseThrow(() -> new com.polaris.exception.ResourceNotFoundException("Asset not found"));
        asset.setStatus(AssetStatus.valueOf(request.getStatus().toUpperCase()));
        asset.setLastScannedAt(LocalDateTime.now());
        return ResponseEntity.ok(assetRepository.save(asset));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<Asset> getAssetByQrCode(@PathVariable String qrCode) {
        return assetRepository.findByQrCode(qrCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


