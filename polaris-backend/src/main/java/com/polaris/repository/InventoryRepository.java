package com.polaris.repository;

import com.polaris.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    @Query("SELECT i FROM Inventory i WHERE i.expiryDate <= :date")
    List<Inventory> findExpiringBefore(LocalDate date);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minimumThreshold")
    List<Inventory> findLowStock();
}
