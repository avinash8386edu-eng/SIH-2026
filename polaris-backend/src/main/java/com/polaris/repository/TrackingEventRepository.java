package com.polaris.repository;

import com.polaris.model.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    Optional<TrackingEvent> findFirstByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, Long entityId);
    List<TrackingEvent> findByTimestampAfter(LocalDateTime since);
    
    @Query(value = "SELECT t1.* FROM tracking_events t1 JOIN (SELECT entity_type, entity_id, MAX(timestamp) as max_time FROM tracking_events GROUP BY entity_type, entity_id) t2 ON t1.entity_type = t2.entity_type AND t1.entity_id = t2.entity_id AND t1.timestamp = t2.max_time", nativeQuery = true)
    List<TrackingEvent> findLatestTrackingEvents();
}

