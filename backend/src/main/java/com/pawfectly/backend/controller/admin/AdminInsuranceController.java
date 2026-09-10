package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.dto.InsuranceQuoteDto;
import com.pawfectly.backend.dto.UpdateInsuranceQuoteStatusRequest;
import com.pawfectly.backend.service.InsuranceQuoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/admin/insurance-quotes", "/api/admin/insurance-quotes"})
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminInsuranceController {

    private final InsuranceQuoteService insuranceQuoteService;

    @GetMapping
    public ResponseEntity<List<InsuranceQuoteDto>> getAllQuotes(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(insuranceQuoteService.getAllQuotes(status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<InsuranceQuoteDto> updateQuoteStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInsuranceQuoteStatusRequest request) {
        return ResponseEntity.ok(insuranceQuoteService.updateQuoteStatus(id, request.getStatus(), request.getNotes()));
    }
}
