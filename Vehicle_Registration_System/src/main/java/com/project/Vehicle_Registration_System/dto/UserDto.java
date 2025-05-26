package com.project.Vehicle_Registration_System.dto;

import com.project.Vehicle_Registration_System.Enum.UserRole;

import lombok.Data;

@Data
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private UserRole userRole;
    private String licenseNumber;
}
