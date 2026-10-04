package com.polaris.repository;

import com.polaris.model.Transport;
import com.polaris.model.TransportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRepository extends JpaRepository<Transport, Long> {
    List<Transport> findByStatus(TransportStatus status);
    List<Transport> findByCurrentStationId(Long stationId);
}
