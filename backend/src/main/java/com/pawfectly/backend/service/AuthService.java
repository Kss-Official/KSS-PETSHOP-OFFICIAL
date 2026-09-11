package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.AuthRequest;
import com.pawfectly.backend.dto.AuthResponse;
import com.pawfectly.backend.dto.RegisterRequest;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.repository.UserRepository;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.CUSTOMER;

        String rawPhone = request.getPhone();
        String cleanPhone = null;
        if (rawPhone != null && !rawPhone.isBlank()) {
            cleanPhone = rawPhone.replaceAll("\\D", "");
            if (cleanPhone.length() != 10) {
                throw new BadRequestException("Phone number must be exactly 10 digits.");
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .phone(cleanPhone)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user {} with role {}", savedUser.getEmail(), savedUser.getRole());

        String jwt = jwtUtils.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(jwt)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .phone(savedUser.getPhone())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        if (!userDetails.isEnabled()) {
            throw new org.springframework.security.authentication.DisabledException("Your account has been deactivated. Please contact support.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .build();
    }
}
