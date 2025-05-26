package com.project.Vehicle_Registration_System.Services.jwt;


import org.springframework.security.core.userdetails.UserDetailsService;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.dto.UserDto;


public interface UserService extends UserDetailsService {
    UserDetailsService userDetailsService();
    public User getUserById(Long id);
    boolean deleteCurrentUserProfile();
    boolean deleteUserById(Long id);
    boolean updateUserProfile(UserDto userDto);
    UserDto getUserProfile();
}
