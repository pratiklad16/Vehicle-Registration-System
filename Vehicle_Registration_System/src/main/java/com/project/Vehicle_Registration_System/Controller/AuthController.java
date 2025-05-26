package com.project.Vehicle_Registration_System.Controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Repository.UserRepository;
import com.project.Vehicle_Registration_System.Services.AuthService;
import com.project.Vehicle_Registration_System.Services.jwt.UserService;
import com.project.Vehicle_Registration_System.dto.AuthenticationRequest;
import com.project.Vehicle_Registration_System.dto.AuthenticationResponse;
import com.project.Vehicle_Registration_System.dto.SignupRequest;
import com.project.Vehicle_Registration_System.dto.UserDto;
import com.project.Vehicle_Registration_System.utils.JWTUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        if (authService.hasUserWithEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        UserDto userDto = authService.createUser(signupRequest);
        if (userDto == null) {
            return ResponseEntity.badRequest().body("User registration failed");
        }
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }

        final UserDetails userDetails = userService
                .userDetailsService()
                .loadUserByUsername(authenticationRequest.getEmail());

        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        final String jwt = jwtUtil.generateToken(userDetails);
        System.out.println("JWT Token: " + jwt);
        AuthenticationResponse response = new AuthenticationResponse();
        response.setJwt(jwt);
        response.setUserId(optionalUser.get().getId());
        response.setUsername(optionalUser.get().getName());
        response.setUserRole(optionalUser.get().getUserRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }
}
