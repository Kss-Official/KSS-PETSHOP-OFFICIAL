package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.NotificationPreferenceDto;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.service.CustomerPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/preferences")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
@RequiredArgsConstructor
public class CustomerPreferenceController {

    private final CustomerPreferenceService customerPreferenceService;

    @GetMapping
    public ResponseEntity<NotificationPreferenceDto> getPreferences(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(customerPreferenceService.getPreferences(userDetails.getId()));
    }

    @PutMapping
    public ResponseEntity<NotificationPreferenceDto> updatePreferences(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody NotificationPreferenceDto dto) {
        return ResponseEntity.ok(customerPreferenceService.updatePreferences(userDetails.getId(), dto));
    }
}
