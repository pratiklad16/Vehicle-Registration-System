package com.project.Vehicle_Registration_System.Services.sparePart;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.project.Vehicle_Registration_System.Enum.VehicleType;
import com.project.Vehicle_Registration_System.dto.SparePartDto;

public interface SparePartService {
    
    @Transactional
    SparePartDto addSparePart(SparePartDto sparePartDto);
    
    @Transactional
    SparePartDto updateSparePart(Long id, SparePartDto sparePartDto);
    
    List<SparePartDto> getAllSpareParts();
    
    SparePartDto getSparePartById(Long id);
    
    List<SparePartDto> getSparePartsByVehicleType(VehicleType vehicleType);
    
    List<SparePartDto> getSparePartsByModel(String model);
    
    @Transactional
    boolean updateStock(Long id, Integer quantityChange);
    
    boolean hasSparePartWithPartNumber(String partNumber);
    
    List<SparePartDto> getUserSpareParts();

    boolean adminDeleteSparePart(Long id);

    boolean userDeleteSparePart(Long id);

    List<SparePartDto> getUserSparePartsById(Long userId);
}