package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.InsuranceQuoteDto;
import com.pawfectly.backend.dto.InsuranceQuoteRequest;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.service.InsuranceQuoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
public class PublicInsuranceController {

    private final InsuranceQuoteService insuranceQuoteService;

    @PostMapping("/quote")
    public ResponseEntity<InsuranceQuoteDto> submitQuote(
            @Valid @RequestBody InsuranceQuoteRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userEmail = (userDetails != null) ? userDetails.getUsername() : null;
        InsuranceQuoteDto response = insuranceQuoteService.submitQuote(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
