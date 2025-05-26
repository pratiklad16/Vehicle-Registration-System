package com.project.Vehicle_Registration_System.dto;

import com.project.Vehicle_Registration_System.Enum.UserRole;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;
    private long userId;
    private String username;
    private UserRole userRole;
}
