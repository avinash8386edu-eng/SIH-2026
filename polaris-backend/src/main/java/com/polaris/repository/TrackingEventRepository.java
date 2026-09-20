package com.polaris.repository;

import com.polaris.model.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    Optional<TrackingEvent> findFirstByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    List<TrackingEvent> findByTimestampAfter(LocalDateTime since);
}
