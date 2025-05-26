package com.project.Vehicle_Registration_System.Configuration;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.Vehicle_Registration_System.Services.jwt.UserService;
import com.project.Vehicle_Registration_System.utils.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j  // Add logging
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserService userService;

    /*
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Log the request path and method for debugging
        log.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());
        
        // 1. Check if Authorization header is missing or doesn't start with "Bearer "
        if (StringUtils.isEmpty(authHeader) || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header");
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract JWT token and get username (email) from it
        jwt = authHeader.substring(7);
        try {
            userEmail = jwtUtil.extractUserName(jwt);
            log.info("JWT Token extracted for user: {}", userEmail);
        } catch (Exception e) {
            log.error("Error extracting username from JWT token", e);
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If userEmail exists and not already authenticated
        if (StringUtils.hasText(userEmail)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails;
            try {
                userDetails = userService
                        .userDetailsService()
                        .loadUserByUsername(userEmail);
                log.info("User details loaded: {} with roles: {}", 
                        userDetails.getUsername(), userDetails.getAuthorities());
            } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
                log.error("Username not found while loading user details", e);
                filterChain.doFilter(request, response);
                return;
            } catch (RuntimeException e) {
                log.error("Unexpected error loading user details", e);
                filterChain.doFilter(request, response);
                return;
            }

            // 4. Validate JWT token with the userDetails
            try {
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    SecurityContext context = SecurityContextHolder.createEmptyContext();

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    context.setAuthentication(authToken);
                    SecurityContextHolder.setContext(context);
                    log.info("Authentication successful for user: {}", userEmail);
                } else {
                    log.warn("Invalid JWT token for user: {}", userEmail);
                }
            } catch (Exception e) {
                log.error("Error validating JWT token", e);
            }
        }

        // 5. Continue with the filter chain
        filterChain.doFilter(request, response);
    }*/
    // Modify your JWTAuthenticationFilter's doFilterInternal method to add more logging

@Override
protected void doFilterInternal(HttpServletRequest request,
                              HttpServletResponse response,
                              FilterChain filterChain)
      throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;

    // Log the request path and method for debugging
    log.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());
    
    // 1. Check if Authorization header is missing or doesn't start with "Bearer "
    if (StringUtils.isEmpty(authHeader) || !authHeader.startsWith("Bearer ")) {
        log.warn("Missing or invalid Authorization header");
        filterChain.doFilter(request, response);
        return;
    }

    // 2. Extract JWT token and get username (email) from it
    jwt = authHeader.substring(7);
    try {
        userEmail = jwtUtil.extractUserName(jwt);
        log.info("JWT Token extracted for user: {}", userEmail);
        
        // Debug token details
        jwtUtil.debugTokenDetails(jwt);
    } catch (Exception e) {
        log.error("Error extracting username from JWT token", e);
        filterChain.doFilter(request, response);
        return;
    }

    // 3. If userEmail exists and not already authenticated
    if (StringUtils.hasText(userEmail)
            && SecurityContextHolder.getContext().getAuthentication() == null) {

        UserDetails userDetails;
        try {
            userDetails = userService
                    .userDetailsService()
                    .loadUserByUsername(userEmail);
            log.info("User details loaded: {} with roles: {}", 
                    userDetails.getUsername(), userDetails.getAuthorities());
        } catch (Exception e) {
            log.error("Error loading user details", e);
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Validate JWT token with the userDetails
        try {
            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                SecurityContext context = SecurityContextHolder.createEmptyContext();

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authToken);
                SecurityContextHolder.setContext(context);
                log.info("Authentication successful for user: {} with authorities: {}", 
                         userEmail, userDetails.getAuthorities());
            } else {
                log.warn("Invalid JWT token for user: {}", userEmail);
            }
        } catch (Exception e) {
            log.error("Error validating JWT token", e);
        }
    }

    // 5. Continue with the filter chain
    filterChain.doFilter(request, response);
}
}