package com.polaris.controller;

import com.polaris.exception.ResourceNotFoundException;
import com.polaris.model.Transport;
import com.polaris.model.TransportStatus;
import com.polaris.repository.TransportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@RequiredArgsConstructor
public class TransportController {

    private final TransportRepository transportRepository;

    @GetMapping
    public ResponseEntity<List<Transport>> getAllTransports(@RequestParam(required = false) TransportStatus status) {
        if (status != null) {
            return ResponseEntity.ok(transportRepository.findByStatus(status));
        }
        return ResponseEntity.ok(transportRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Transport> createTransport(@RequestBody Transport transport) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transportRepository.save(transport));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transport> getTransportById(@PathVariable Long id) {
        return ResponseEntity.ok(transportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transport not found with id: " + id)));
    }
}

