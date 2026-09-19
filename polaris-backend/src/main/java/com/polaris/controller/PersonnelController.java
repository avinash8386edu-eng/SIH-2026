package com.polaris.controller;

import com.polaris.dto.CheckInRequest;
import com.polaris.dto.StatusUpdateRequest;
import com.polaris.model.User;
import com.polaris.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personnel")
@RequiredArgsConstructor
public class PersonnelController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllPersonnel() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new com.polaris.exception.ResourceNotFoundException("User not found"));
        user.setCurrentStatus(request.getStatus());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<User> checkIn(@PathVariable Long id, @RequestBody CheckInRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new com.polaris.exception.ResourceNotFoundException("User not found"));
        user.setLastLatitude(request.getLatitude());
        user.setLastLongitude(request.getLongitude());
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            user.setCurrentStatus(request.getStatus());
        }
        return ResponseEntity.ok(userRepository.save(user));
    }
}

