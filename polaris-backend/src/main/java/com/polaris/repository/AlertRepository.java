package com.polaris.repository;

import com.polaris.model.Alert;
import com.polaris.model.AlertSeverity;
import com.polaris.model.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStatus(AlertStatus status);
    List<Alert> findByStationId(Long stationId);
    List<Alert> findByStatusAndSeverity(AlertStatus status, AlertSeverity severity);
}
