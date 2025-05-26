package com.project.Vehicle_Registration_System.dto;

import java.util.Date;

import com.project.Vehicle_Registration_System.Enum.VehicleType;

import lombok.Data;

@Data
public class SparePartDto {
    private Long id;
    private String partName;
    private String partNumber;
    private VehicleType vehicleType;
    private String compatibleModels;
    private Integer quantityInStock;
    private String vendorName;
    private Double price;
    private Date addedOn;
    
    // User information who added the part (usually admin)
    private Long userId;
    private String userName;
    private String userEmail;
}