package com.project.Vehicle_Registration_System.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Vehicle_Registration_System.Services.jwt.UserService;
import com.project.Vehicle_Registration_System.Services.order.OrderService;
import com.project.Vehicle_Registration_System.Services.registerVehicle.RegisterVehicleService;
import com.project.Vehicle_Registration_System.Services.sparePart.SparePartService;
import com.project.Vehicle_Registration_System.dto.UserDto;
import com.project.Vehicle_Registration_System.dto.VehicleDto;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RegisterVehicleService registerVehicleService;
    private final UserService userService;
    private final OrderService orderService;
    private final SparePartService sparePartService;

    @GetMapping("/getAllVehicles")
    public ResponseEntity<?> getAllVehicles() throws IOException {
        return ResponseEntity.ok(registerVehicleService.getAllVehicles());
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Authentication working correctly!");
    }

    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long vehicleId) {
        try {
            VehicleDto vehicleDto = registerVehicleService.getVehicleById(vehicleId);
            if (vehicleDto != null) {
                return ResponseEntity.ok(vehicleDto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle not found");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving vehicle");
        }
    }

    @GetMapping("/getAllOwners")
    public ResponseEntity<?> getAllOwners() {
        try {
            List<VehicleDto> vehicles = registerVehicleService.getAllVehicles();

            // Extract only owner-related fields and remove duplicates
            List<Map<String, Object>> owners = vehicles.stream()
                    .map(vehicle -> {
                        Map<String, Object> ownerMap = new HashMap<>();
                        ownerMap.put("userId", vehicle.getUserId());
                        ownerMap.put("ownerName", vehicle.getOwnerName());
                        ownerMap.put("ownerEmail", vehicle.getOwnerEmail());
                        ownerMap.put("ownerLicenseNumber", vehicle.getOwnerLicenseNumber());
                        return ownerMap;
                    })
                    .distinct() // removes duplicates based on full map object
                    .collect(Collectors.toList());

            return ResponseEntity.ok(owners);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving owners");
        }
    }

    @GetMapping("/owners/{ownerId}")
    public ResponseEntity<?> getOwnerInfomartion(@PathVariable Long ownerId) {
        try {
            List<VehicleDto> vehicles = registerVehicleService.getAllVehicles();

            // Extract only owner-related fields and remove duplicates
            Map<String, Object> owner = vehicles.stream()
                    .filter(vehicle -> vehicle.getUserId() == ownerId)
                    .findFirst()
                    .map(vehicle -> {
                        Map<String, Object> ownerMap = new HashMap<>();
                        ownerMap.put("userId", vehicle.getUserId());
                        ownerMap.put("ownerName", vehicle.getOwnerName());
                        ownerMap.put("ownerEmail", vehicle.getOwnerEmail());
                        ownerMap.put("ownerLicenseNumber", vehicle.getOwnerLicenseNumber());
                        return ownerMap;
                    })
                    .orElse(null);

            return ResponseEntity.ok(owner);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving Owner");
        }
    }

    @GetMapping("/ownerVehicles/{ownerId}")
    public ResponseEntity<?> getVehiclesByOwnerId(@PathVariable Long ownerId) {
        try {
            List<VehicleDto> vehicles = registerVehicleService.getAllVehicles();

            // Filter vehicles where userId matches the ownerId
            List<VehicleDto> ownerVehicles = vehicles.stream()
                    .filter(vehicle -> vehicle.getUserId() == ownerId)
                    .collect(Collectors.toList());

            if (!ownerVehicles.isEmpty()) {
                return ResponseEntity.ok(ownerVehicles);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No vehicles found for the given owner ID");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving vehicles for the owner: " + e.getMessage());
        }
    }

    @DeleteMapping("/DeleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        boolean deleted = userService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or you don't have permission to delete this user");
        }
    }

    @DeleteMapping("/deleteVehicle/{vehicleId}")
    public ResponseEntity<?> adminDeleteVehicle(@PathVariable Long vehicleId) {
        try {
            boolean deleted = registerVehicleService.adminDeleteVehicle(vehicleId);
            if (deleted) {
                return ResponseEntity.ok("Vehicle deleted successfully by admin");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteOrder/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        boolean deleted = orderService.adminDeleteOrder(orderId);
        if (deleted) {
            return ResponseEntity.ok("Order deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order not found or you don't have permission to delete it");
        }
    }

    @DeleteMapping("/deleteSparePart/{sparePartId}")
    public ResponseEntity<?> deleteSparePart(@PathVariable Long sparePartId) {
        boolean deleted = sparePartService.adminDeleteSparePart(sparePartId);
        if (deleted) {
            return ResponseEntity.ok("Spare part deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Spare part not found or you don't have permission to delete it");
        }
    }

    @GetMapping("/viewCurrentProfile")
    public ResponseEntity<?> viewCurrentProfile() {
        try {
            return ResponseEntity.ok(userService.getUserProfile());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving current user profile: " + e.getMessage());
        }
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDto userDto) {
        boolean updated = userService.updateUserProfile(userDto);
        if (updated) {
            return ResponseEntity.ok("User profile updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update user profile");
        }
    }
}
