package com.project.Vehicle_Registration_System.Services.jwt;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Repository.OrderRepository;
import com.project.Vehicle_Registration_System.Repository.SparePartRepository;
import com.project.Vehicle_Registration_System.Repository.UserRepository;
import com.project.Vehicle_Registration_System.Repository.VehicleRepository;
import com.project.Vehicle_Registration_System.dto.UserDto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final SparePartRepository sparePartRepository;
    private final OrderRepository orderRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findFirstByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserDetailsService userDetailsService() {
        return this; // Return self as it already implements UserDetailsService functionality
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public boolean deleteUserById(Long userId) {
        // Check if current user is admin or the user themselves
        String currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail == null) {
            return false;
        }

        Optional<User> currentUserOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<User> targetUserOptional = userRepository.findById(userId);

        if (currentUserOptional.isPresent() && targetUserOptional.isPresent()) {
            User currentUser = currentUserOptional.get();
            User targetUser = targetUserOptional.get();

            // Allow deletion if current user is admin or the user themselves
            if (currentUser.getUserRole().name().equals("ADMIN") || (currentUser.getId() == targetUser.getId())) {
                deleteUserCascade(userId);
                return true;
            }
        }

        return false;
    }

    @Override
    @Transactional
    public boolean deleteCurrentUserProfile() {
        String currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail == null) {
            return false;
        }

        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            deleteUserCascade(user.getId());
            return true;
        }

        return false;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    @Transactional
    private void deleteUserCascade(Long userId) {
        // Delete all orders related to the user
        orderRepository.deleteByUserId(userId);

        // Delete all spare parts added by the user
        sparePartRepository.deleteByUserId(userId);

        // Delete all vehicles registered by the user
        vehicleRepository.deleteByUserId(userId);

        // Finally delete the user
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public boolean updateUserProfile(UserDto userDto) {
        String currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail == null) {
            return false;
        }

        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Only update fields that are not null
            if (userDto.getName() != null && !userDto.getName().isEmpty()) {
                user.setName(userDto.getName());
            }

            // For email, probably best to only update if different from current
            if (userDto.getEmail() != null && !userDto.getEmail().isEmpty()
                    && !userDto.getEmail().equals(currentUserEmail)) {
                user.setEmail(userDto.getEmail());
            }

            if (userDto.getLicenseNumber() != null && !userDto.getLicenseNumber().isEmpty()) {
                user.setLicenseNumber(userDto.getLicenseNumber());
            }

            userRepository.save(user);
            return true;
        }

        return false;
    }

    @Override
    public UserDto getUserProfile() {
        String currentUserEmail = getCurrentUserEmail();
        if (currentUserEmail == null) {
            return null;
        }

        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
        
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setUserRole(user.getUserRole());
        userDto.setLicenseNumber(user.getLicenseNumber());
        
        return userDto;
        }

        return null;
    }
}
