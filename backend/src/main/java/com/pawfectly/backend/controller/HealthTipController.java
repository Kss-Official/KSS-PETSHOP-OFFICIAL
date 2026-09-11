package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.HealthTipDto;
import com.pawfectly.backend.service.HealthTipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/health-tips", "/api/health-tips"})
@RequiredArgsConstructor
public class HealthTipController {

    private final HealthTipService healthTipService;

    @GetMapping
    public ResponseEntity<List<HealthTipDto>> getHealthTips(
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(healthTipService.getHealthTips(petType, category, featured, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthTipDto> getHealthTipById(@PathVariable Long id) {
        return ResponseEntity.ok(healthTipService.getHealthTipById(id));
    }
}
