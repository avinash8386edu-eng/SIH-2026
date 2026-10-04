package com.polaris.repository;

import com.polaris.model.CargoEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargoEventRepository extends JpaRepository<CargoEvent, Long> {
    List<CargoEvent> findByCargoIdOrderByTimestampAsc(Long cargoId);
}
