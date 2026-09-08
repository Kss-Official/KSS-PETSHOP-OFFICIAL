package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ChangePasswordRequest;
import com.pawfectly.backend.dto.UserProfileDto;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UserProfileDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
                throw new BadRequestException("Email is already in use by another account.");
            }
            user.setEmail(request.getEmail().toLowerCase().trim());
        }

        user.setName(request.getName());

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            String cleanPhone = request.getPhone().replaceAll("\\D", "");
            if (cleanPhone.length() != 10) {
                throw new BadRequestException("Phone number must be exactly 10 digits.");
            }
            user.setPhone(cleanPhone);
        } else {
            user.setPhone(request.getPhone());
        }

        User updated = userRepository.save(user);
        log.info("Updated profile for user id: {}", userId);

        return mapToDto(updated);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password updated successfully for user id: {}", userId);
    }

    private UserProfileDto mapToDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }
}
