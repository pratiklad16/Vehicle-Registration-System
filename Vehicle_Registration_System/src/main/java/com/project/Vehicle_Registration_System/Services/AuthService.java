package com.project.Vehicle_Registration_System.Services;

import com.project.Vehicle_Registration_System.dto.SignupRequest;
import com.project.Vehicle_Registration_System.dto.UserDto;

public interface AuthService {
    UserDto createUser(SignupRequest signupRequest);
    boolean hasUserWithEmail(String email);
}
