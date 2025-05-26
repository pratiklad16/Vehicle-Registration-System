package com.project.Vehicle_Registration_System.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String licenseNumber;
}
