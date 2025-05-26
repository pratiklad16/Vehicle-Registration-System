package com.project.Vehicle_Registration_System.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.Vehicle_Registration_System.Enum.VehicleType;
import com.project.Vehicle_Registration_System.Services.sparePart.SparePartService;
import com.project.Vehicle_Registration_System.dto.SparePartDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/spare-parts")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    @PostMapping
    public ResponseEntity<?> addSparePart(@RequestBody SparePartDto sparePartDto) {
        // Check if part number already exists
        if (sparePartService.hasSparePartWithPartNumber(sparePartDto.getPartNumber())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Spare part with this part number already exists");
        }

        SparePartDto createdPart = sparePartService.addSparePart(sparePartDto);
        if (createdPart != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPart);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create spare part");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSparePart(@PathVariable Long id, @RequestBody SparePartDto sparePartDto) {
        SparePartDto updatedPart = sparePartService.updateSparePart(id, sparePartDto);
        if (updatedPart != null) {
            return ResponseEntity.ok(updatedPart);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spare part not found");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSpareParts() {
        return ResponseEntity.ok(sparePartService.getAllSpareParts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSparePartById(@PathVariable Long id) {
        SparePartDto part = sparePartService.getSparePartById(id);
        if (part != null) {
            return ResponseEntity.ok(part);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spare part not found");
        }
    }

    @GetMapping("/vehicle-type/{vehicleType}")
    public ResponseEntity<?> getSparePartsByVehicleType(@PathVariable VehicleType vehicleType) {
        return ResponseEntity.ok(sparePartService.getSparePartsByVehicleType(vehicleType));
    }

    @GetMapping("/model")
    public ResponseEntity<?> getSparePartsByModel(@RequestParam String model) {
        return ResponseEntity.ok(sparePartService.getSparePartsByModel(model));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> stockUpdate) {
        Integer quantityChange = stockUpdate.get("quantityChange");
        if (quantityChange == null) {
            return ResponseEntity.badRequest().body("quantityChange is required");
        }

        boolean updated = sparePartService.updateStock(id, quantityChange);
        if (updated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to update stock. Check if the spare part exists or if the operation would result in negative stock.");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserSpareParts() {
        return ResponseEntity.ok(sparePartService.getUserSpareParts());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSparePartsById(@PathVariable Long userId) {
        return ResponseEntity.ok(sparePartService.getUserSparePartsById(userId));
    }
    /*
    @GetMapping("/inventory-adjustments")
    public ResponseEntity<?> getAllInventoryAdjustments() {
        return ResponseEntity.ok(sparePartService.getAllInventoryAdjustments());
    }
     */
}
