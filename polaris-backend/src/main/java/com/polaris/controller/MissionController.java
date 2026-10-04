package com.polaris.controller;

import com.polaris.exception.ResourceNotFoundException;
import com.polaris.model.Mission;
import com.polaris.model.MissionStatus;
import com.polaris.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionRepository missionRepository;

    @GetMapping
    public ResponseEntity<List<Mission>> getAllMissions(@RequestParam(required = false) MissionStatus status) {
        if (status != null) {
            return ResponseEntity.ok(missionRepository.findByStatus(status));
        }
        return ResponseEntity.ok(missionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Mission> createMission(@RequestBody Mission mission) {
        return ResponseEntity.status(HttpStatus.CREATED).body(missionRepository.save(mission));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mission> getMissionById(@PathVariable Long id) {
        return ResponseEntity.ok(missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mission not found with id: " + id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Mission> updateMissionStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        Mission mission = missionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mission not found with id: " + id));
        String statusStr = statusMap.get("status");
        if (statusStr != null) {
            mission.setStatus(MissionStatus.valueOf(statusStr.toUpperCase()));
        }
        return ResponseEntity.ok(missionRepository.save(mission));
    }
}
