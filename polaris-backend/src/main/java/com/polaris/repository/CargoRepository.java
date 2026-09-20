package com.polaris.repository;

import com.polaris.model.Cargo;
import com.polaris.model.CargoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    List<Cargo> findByStatus(CargoStatus status);
    List<Cargo> findByExpeditionId(Long expeditionId);
    Optional<Cargo> findByCargoCode(String cargoCode);
    Optional<Cargo> findByQrCode(String qrCode);
}
