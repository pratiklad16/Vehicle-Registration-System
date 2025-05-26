package com.project.Vehicle_Registration_System.dto;

import java.util.Date;

import com.project.Vehicle_Registration_System.Enum.VehicleType;

import lombok.Data;

@Data
public class VehicleDto {
    private long id;

    private String brand;

    private String color;

    private String name;

    private String model;

    public VehicleType vehicleType;

    private String registrationNumber;

    private Date manufactureYear;

    private String vehicleIdentificationNumber;

    private long userId;
    private String ownerName;
    private String ownerEmail;
    private String ownerLicenseNumber;
    //private MultipartFile image;

    //private byte[] returedImage;
}
