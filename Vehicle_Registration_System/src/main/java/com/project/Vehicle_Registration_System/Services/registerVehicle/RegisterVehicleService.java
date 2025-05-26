package com.project.Vehicle_Registration_System.Services.registerVehicle;

import java.util.List;

import com.project.Vehicle_Registration_System.dto.VehicleDto;

import io.jsonwebtoken.io.IOException;

public interface RegisterVehicleService {
    boolean registerVehicle(VehicleDto vehicleDto) throws IOException;
    List<VehicleDto> getAllVehicles() throws IOException;
    boolean hasVehicleWithRegistrationNumber(String registrationNumber) throws IOException;
    boolean hasVehicleWithVIN(String vin) throws IOException;
    List<VehicleDto> getUserVehicles() throws IOException;
    VehicleDto getVehicleById(Long vehicleId) throws IOException;
    boolean deleteVehicle(Long vehicleId) throws IOException;
    boolean adminDeleteVehicle(Long vehicleId) throws IOException;
    boolean updateVehicle(Long vehicleId,VehicleDto vehicleDto) throws IOException;
}
