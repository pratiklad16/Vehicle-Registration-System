package com.project.Vehicle_Registration_System.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.Vehicle_Registration_System.Entity.SparePart;
import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Enum.VehicleType;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findByPartNumber(String partNumber);
    List<SparePart> findByVehicleType(VehicleType vehicleType);
    List<SparePart> findByUser(User user);
    List<SparePart> findByCompatibleModelsContaining(String model);
    List<SparePart> findByQuantityInStockGreaterThan(Integer minStock);
    void deleteByUserId(Long userId);
    List<SparePart> findByUserId(Long userId);
}