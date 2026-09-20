package com.polaris.controller;

import com.polaris.exception.ResourceNotFoundException;
import com.polaris.model.Cargo;
import com.polaris.model.CargoEvent;
import com.polaris.model.CargoStatus;
import com.polaris.repository.CargoEventRepository;
import com.polaris.repository.CargoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cargo")
@RequiredArgsConstructor
public class CargoController {

    private final CargoRepository cargoRepository;
    private final CargoEventRepository cargoEventRepository;

    @GetMapping
    public ResponseEntity<List<Cargo>> getAllCargo(@RequestParam(required = false) CargoStatus status) {
        if (status != null) {
            // Assuming findByStatus exists, otherwise filter
            List<Cargo> all = cargoRepository.findAll();
            return ResponseEntity.ok(all.stream().filter(c -> c.getStatus() == status).toList());
        }
        return ResponseEntity.ok(cargoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Cargo> createCargo(@RequestBody Cargo cargo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cargoRepository.save(cargo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cargo> getCargoById(@PathVariable Long id) {
        return ResponseEntity.ok(cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id)));
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<Cargo> getCargoByQr(@PathVariable String qrCode) {
        // Try finding by qrCode first, fallback to cargoCode
        Optional<Cargo> cargo = cargoRepository.findByQrCode(qrCode);
        if (cargo.isEmpty()) {
            cargo = cargoRepository.findByCargoCode(qrCode);
        }
        return ResponseEntity.ok(cargo
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with QR: " + qrCode)));
    }

    @PostMapping("/qr/{qrCode}/scan")
    public ResponseEntity<CargoEvent> scanCargoByQr(@PathVariable String qrCode, @RequestBody CargoEvent event) {
        Optional<Cargo> cargoOpt = cargoRepository.findByQrCode(qrCode);
        if (cargoOpt.isEmpty()) {
            cargoOpt = cargoRepository.findByCargoCode(qrCode);
        }
        Cargo cargo = cargoOpt.orElseThrow(() -> new ResourceNotFoundException("Cargo not found with QR: " + qrCode));
        
        event.setCargoId(cargo.getId());
        event.setEventType(com.polaris.model.CargoEventType.SCANNED);
        return ResponseEntity.status(HttpStatus.CREATED).body(cargoEventRepository.save(event));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Cargo> updateCargoStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        Cargo cargo = cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id));
        String statusStr = statusMap.get("status");
        if (statusStr != null) {
            cargo.setStatus(CargoStatus.valueOf(statusStr.toUpperCase()));
        }
        return ResponseEntity.ok(cargoRepository.save(cargo));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<CargoEvent>> getCargoTimeline(@PathVariable Long id) {
        // Assuming findByCargoIdOrderByTimestampAsc exists
        return ResponseEntity.ok(cargoEventRepository.findAll().stream()
                .filter(e -> e.getCargoId() != null && e.getCargoId().equals(id))
                .sorted((e1, e2) -> e1.getTimestamp().compareTo(e2.getTimestamp()))
                .toList());
    }

    @PostMapping("/{id}/scan")
    public ResponseEntity<CargoEvent> createCargoEvent(@PathVariable Long id, @RequestBody CargoEvent event) {
        Cargo cargo = cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id));
        event.setCargoId(cargo.getId());
        event.setEventType(com.polaris.model.CargoEventType.SCANNED); 
        return ResponseEntity.status(HttpStatus.CREATED).body(cargoEventRepository.save(event));
    }
}
