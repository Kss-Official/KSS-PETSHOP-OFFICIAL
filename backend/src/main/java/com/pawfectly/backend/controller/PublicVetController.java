package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.VetDto;
import com.pawfectly.backend.dto.VetReviewDto;
import com.pawfectly.backend.service.VetReviewService;
import com.pawfectly.backend.service.VetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vets")
@RequiredArgsConstructor
public class PublicVetController {

    private final VetService vetService;
    private final VetReviewService vetReviewService;

    @GetMapping
    public ResponseEntity<List<VetDto>> getVets(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(vetService.getActiveVets(specialization, petType, search, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VetDto> getVetById(@PathVariable Long id) {
        return ResponseEntity.ok(vetService.getVetById(id));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<VetReviewDto>> getReviewsForVet(@PathVariable Long id) {
        return ResponseEntity.ok(vetReviewService.getReviewsForVet(id));
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        return ResponseEntity.ok(vetService.getAllSpecializations());
    }
}
