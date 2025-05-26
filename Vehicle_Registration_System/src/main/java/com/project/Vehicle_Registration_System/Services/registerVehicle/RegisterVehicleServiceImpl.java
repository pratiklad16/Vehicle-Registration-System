package com.project.Vehicle_Registration_System.Services.registerVehicle;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Entity.Vehicle;
import com.project.Vehicle_Registration_System.Repository.UserRepository;
import com.project.Vehicle_Registration_System.Repository.VehicleRepository;
import com.project.Vehicle_Registration_System.dto.VehicleDto;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterVehicleServiceImpl implements RegisterVehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    String currentUserEmail;

    @Override
    public boolean registerVehicle(VehicleDto vehicleDto) {
        try {
            currentUserEmail = getCurrentUserEmail();

            Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

            User currentUser = userOptional.get();

            Vehicle vehicle = new Vehicle();
            vehicle.setBrand(vehicleDto.getBrand());
            vehicle.setColor(vehicleDto.getColor());
            vehicle.setName(vehicleDto.getName());
            vehicle.setModel(vehicleDto.getModel());
            vehicle.setVehicleType(vehicleDto.getVehicleType());
            vehicle.setRegistrationNumber(vehicleDto.getRegistrationNumber());
            //vehicle.setOwnerName(vehicleDto.getOwnerName());
            vehicle.setManufactureYear(vehicleDto.getManufactureYear());
            vehicle.setVehicleIdentificationNumber(vehicleDto.getVehicleIdentificationNumber());
            vehicle.setUser(currentUser);
            //vehicle.setImage(vehicleDto.getImage().getBytes());
            vehicleRepository.save(vehicle);
            return true;
        } catch (org.springframework.dao.DataAccessException e) {
            return false;
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // In Spring Security, getName() returns the username (email in your case)
        }
        return null;
    }

    @Override
    public boolean hasVehicleWithRegistrationNumber(String registrationNumber) {
        return vehicleRepository.findByRegistrationNumber(registrationNumber).isPresent();
    }

    @Override
    public boolean hasVehicleWithVIN(String vin) {
        return vehicleRepository.findByVehicleIdentificationNumber(vin).isPresent();
    }

    @Override
    public List<VehicleDto> getAllVehicles() throws IOException {
        return vehicleRepository.findAll().stream().map(vehicle -> vehicle.getVehicleDto()).collect(Collectors.toList());
    }

    @Override
    public List<VehicleDto> getUserVehicles() throws IOException {
        currentUserEmail = getCurrentUserEmail();

        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();

            // Find all vehicles associated with the current user
            List<Vehicle> userVehicles = currentUser.getVehicles();

            // Convert vehicle entities to DTOs
            return userVehicles.stream()
                    .map(Vehicle::getVehicleDto)
                    .collect(Collectors.toList());
        }

        return List.of(); // Return empty list if user not found
    }

    @Override
    public VehicleDto getVehicleById(Long vehicleId) throws IOException {
        return vehicleRepository.findById(vehicleId)
                .map(Vehicle::getVehicleDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public boolean deleteVehicle(Long vehicleId) throws IOException {
        currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

        if (userOptional.isPresent() && vehicleOptional.isPresent()) {
            User currentUser = userOptional.get();
            Vehicle vehicle = vehicleOptional.get();

            // Check if the current user owns this vehicle
            if (vehicle.getUser() != null && vehicle.getUser().getId() == currentUser.getId()) {
                vehicleRepository.deleteById(vehicleId);
                return true;
            }
        }

        return false;
    }

    @Override
    @Transactional
    public boolean adminDeleteVehicle(Long vehicleId) throws IOException {
        currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

        if (userOptional.isPresent() && vehicleOptional.isPresent()) {
            User currentUser = userOptional.get();

            // Check if current user is admin
            if (currentUser.getUserRole().name().equals("ADMIN")) {
                vehicleRepository.deleteById(vehicleId);
                return true;
            }
        }

        return false;
    }

    @Override
    @Transactional
    public boolean updateVehicle(Long vehicleId, VehicleDto vehicleDto) throws IOException {
        // check if the owner of the vehicle is the current user
        String currentUserEmail = getCurrentUserEmail();  // Fixed variable declaration
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

        if (userOptional.isPresent() && vehicleOptional.isPresent()) {
            User currentUser = userOptional.get();
            Vehicle vehicle = vehicleOptional.get();

            // Check if the current user owns this vehicle
            if (vehicle.getUser() != null && vehicle.getUser().getId() == currentUser.getId()) {  // Fixed comparison
                // Only update fields that are not null
                if (vehicleDto.getBrand() != null && !vehicleDto.getBrand().isEmpty()) {
                    vehicle.setBrand(vehicleDto.getBrand());
                }

                if (vehicleDto.getColor() != null && !vehicleDto.getColor().isEmpty()) {
                    vehicle.setColor(vehicleDto.getColor());
                }

                if (vehicleDto.getName() != null && !vehicleDto.getName().isEmpty()) {
                    vehicle.setName(vehicleDto.getName());
                }

                if (vehicleDto.getModel() != null && !vehicleDto.getModel().isEmpty()) {
                    vehicle.setModel(vehicleDto.getModel());
                }

                if (vehicleDto.getVehicleType() != null) {
                    vehicle.setVehicleType(vehicleDto.getVehicleType());
                }

                if (vehicleDto.getRegistrationNumber() != null && !vehicleDto.getRegistrationNumber().isEmpty()) {
                    vehicle.setRegistrationNumber(vehicleDto.getRegistrationNumber());
                }

                if (vehicleDto.getManufactureYear() != null) {
                    vehicle.setManufactureYear(vehicleDto.getManufactureYear());
                }

                if (vehicleDto.getVehicleIdentificationNumber() != null && !vehicleDto.getVehicleIdentificationNumber().isEmpty()) {
                    vehicle.setVehicleIdentificationNumber(vehicleDto.getVehicleIdentificationNumber());
                }

                vehicleRepository.save(vehicle);
                return true;
            }
        }
        return false;
    }
}
