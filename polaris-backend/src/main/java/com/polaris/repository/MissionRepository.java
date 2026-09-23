package com.polaris.repository;

import com.polaris.model.Mission;
import com.polaris.model.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByStatus(MissionStatus status);
    long countByStatus(MissionStatus status);
    List<Mission> findByExpeditionId(Long expeditionId);
}

