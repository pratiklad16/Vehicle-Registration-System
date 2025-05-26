package com.project.Vehicle_Registration_System.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Entity.Vehicle;
import com.project.Vehicle_Registration_System.dto.VehicleDto;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>  {
    //List<Vehicle> findByOwnerName(String ownerName);
    List<VehicleDto> findByUser(User user);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    Optional<Vehicle> findByVehicleIdentificationNumber(String vehicleIdentificationNumber);
    void deleteByUserId(Long userId);
}
