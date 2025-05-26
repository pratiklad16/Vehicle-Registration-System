package com.project.Vehicle_Registration_System.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final RegisterVehicleService registerVehicleService;
    private final SparePartService sparePartService;
    private final OrderService orderService;

    @PostMapping("/registerVehicle")
    public ResponseEntity<?> registerVehicle(@RequestBody VehicleDto vehicleDto) throws IOException {
        if (registerVehicleService.hasVehicleWithRegistrationNumber(vehicleDto.getRegistrationNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vehicle with this registration number already exists");
        }
        if (registerVehicleService.hasVehicleWithVIN(vehicleDto.getVehicleIdentificationNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vehicle with this VIN already exists");
        }
        boolean isRegistered = registerVehicleService.registerVehicle(vehicleDto);
        if (isRegistered) {
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Authentication working correctly!");
    }

    // Add this to your RegisterVehicleController.java or any other controller
    @GetMapping("/auth-debug")
    public ResponseEntity<Map<String, Object>> debugAuth() {
        // Get the current authentication
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("isAuthenticated", auth.isAuthenticated());
        debugInfo.put("principal", auth.getPrincipal().toString());
        debugInfo.put("authorities", auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList()));

        return ResponseEntity.ok(debugInfo);
    }

    @GetMapping("/getUserVehicles")
    public ResponseEntity<?> getUserVehicles() {
        try {
            List<VehicleDto> userVehicles = registerVehicleService.getUserVehicles();
            return ResponseEntity.ok(userVehicles);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user vehicles: " + e.getMessage());
        }
    }

    @GetMapping("/MyVehicles/{vehicleId}")
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

    private final UserService userService;

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteOwnProfile() {
        boolean deleted = userService.deleteCurrentUserProfile();
        if (deleted) {
            return ResponseEntity.ok("User profile deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete user profile");
        }
    }

    @DeleteMapping("/deleteVehicle/{vehicleId}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long vehicleId) {
        try {
            boolean deleted = registerVehicleService.deleteVehicle(vehicleId);
            if (deleted) {
                return ResponseEntity.ok("Vehicle deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Vehicle not found or you don't have permission to delete it");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteSparePart/{sparePartId}")
    public ResponseEntity<?> deleteSparePart(@PathVariable Long sparePartId) {
        boolean deleted = sparePartService.userDeleteSparePart(sparePartId);
        if (deleted) {
            return ResponseEntity.ok("Spare part deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Spare part not found or you don't have permission to delete it");
        }
    }

    @DeleteMapping("/deleteOrder/{orderId}")
    public ResponseEntity<?> deleteUserOrder (@PathVariable Long orderId) {
        boolean deleted = orderService.userDeleteOrder(orderId);
        if (deleted) {
            return ResponseEntity.ok("Order deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order not found or you don't have permission to delete it");
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

    @PutMapping("/updateVehicle/{vehicleId}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long vehicleId, @RequestBody VehicleDto vehicleDto) {
        try {
            boolean updated = registerVehicleService.updateVehicle(vehicleId, vehicleDto);
            if (updated) {
                return ResponseEntity.ok("Vehicle updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Vehicle not found or you don't have permission to update it");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating vehicle: " + e.getMessage());
        }
    }
    
    @GetMapping("/GetUserProfile")
    public ResponseEntity<?> getUserProfile() {
        try {
            UserDto userDto = userService.getUserProfile();
            if (userDto != null) {
                return ResponseEntity.ok(userDto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user profile: " + e.getMessage());
        }
    }

}
