package com.project.Vehicle_Registration_System.Entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.Vehicle_Registration_System.Enum.VehicleType;
import com.project.Vehicle_Registration_System.dto.VehicleDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private long id;

    private String brand;

    private String color;

    private String name;

    private String model;

    public VehicleType vehicleType;

    private String registrationNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date manufactureYear;

    private String vehicleIdentificationNumber;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //@Column(name = "image", columnDefinition = "LONGBLOB")
    //private byte[] image;
    public VehicleDto getVehicleDto() {
        VehicleDto vehicleDto = new VehicleDto();
        vehicleDto.setId(this.id);
        vehicleDto.setBrand(this.brand);
        vehicleDto.setColor(this.color);
        vehicleDto.setName(this.name);
        vehicleDto.setModel(this.model);
        vehicleDto.setVehicleType(this.vehicleType);
        vehicleDto.setManufactureYear(this.manufactureYear);
        vehicleDto.setVehicleIdentificationNumber(this.vehicleIdentificationNumber);
        vehicleDto.setRegistrationNumber(this.registrationNumber);

        if (this.user != null) {
            vehicleDto.setUserId(this.user.getId());
            vehicleDto.setOwnerName(this.user.getName());
            vehicleDto.setOwnerEmail(this.user.getEmail());
            vehicleDto.setOwnerLicenseNumber(this.user.getLicenseNumber());
        }
        //vehicleDto.setImage(this.image);
        return vehicleDto;
    }
}
