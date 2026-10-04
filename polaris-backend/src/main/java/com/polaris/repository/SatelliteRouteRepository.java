package com.polaris.repository;

import com.polaris.model.SatelliteRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SatelliteRouteRepository extends JpaRepository<SatelliteRoute, Long> {
    List<SatelliteRoute> findByProcessedTrue();
}
