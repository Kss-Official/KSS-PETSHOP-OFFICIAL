package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.HealthTip;
import com.pawfectly.backend.repository.HealthTipRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/health-tips", "/api/admin/health-tips"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminHealthTipController {

    private final HealthTipRepository healthTipRepository;

    public AdminHealthTipController(HealthTipRepository healthTipRepository) {
        this.healthTipRepository = healthTipRepository;
    }

    @GetMapping
    public ResponseEntity<List<HealthTip>> getAllHealthTips() {
        return ResponseEntity.ok(healthTipRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthTip> getHealthTipById(@PathVariable Long id) {
        return healthTipRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HealthTip> createHealthTip(@Valid @RequestBody HealthTip tip) {
        tip.setId(null);
        if (tip.getIsFeatured() == null) tip.setIsFeatured(false);
        if (tip.getIsActive() == null) tip.setIsActive(true);
        if (tip.getCategory() == null || tip.getCategory().isBlank()) tip.setCategory("Preventive Care");
        if (tip.getPetType() == null || tip.getPetType().isBlank()) tip.setPetType("ALL");
        if (tip.getPublishedAt() == null) tip.setPublishedAt(LocalDateTime.now());
        if (tip.getImageUrl() != null) {
            String trimmed = tip.getImageUrl().trim();
            tip.setImageUrl(trimmed.isEmpty() ? null : trimmed);
        }
        HealthTip saved = healthTipRepository.save(tip);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHealthTip(@PathVariable Long id, @Valid @RequestBody HealthTip tipDetails) {
        return healthTipRepository.findById(id)
                .map(tip -> {
                    tip.setTitle(tipDetails.getTitle());
                    tip.setContent(tipDetails.getContent());
                    if (tipDetails.getImageUrl() != null) {
                        String trimmed = tipDetails.getImageUrl().trim();
                        tip.setImageUrl(trimmed.isEmpty() ? null : trimmed);
                    }
                    if (tipDetails.getCategory() != null) tip.setCategory(tipDetails.getCategory());
                    if (tipDetails.getPetType() != null) tip.setPetType(tipDetails.getPetType());
                    if (tipDetails.getExcerpt() != null) tip.setExcerpt(tipDetails.getExcerpt());
                    if (tipDetails.getIsFeatured() != null) tip.setIsFeatured(tipDetails.getIsFeatured());
                    if (tipDetails.getIsActive() != null) tip.setIsActive(tipDetails.getIsActive());
                    HealthTip updated = healthTipRepository.save(tip);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-featured")
    public ResponseEntity<?> toggleHealthTipFeatured(@PathVariable Long id) {
        return healthTipRepository.findById(id)
                .map(tip -> {
                    tip.setIsFeatured(!Boolean.TRUE.equals(tip.getIsFeatured()));
                    HealthTip updated = healthTipRepository.save(tip);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isFeatured", updated.getIsFeatured(),
                            "message", "Health tip featured flag updated"
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleHealthTipStatus(@PathVariable Long id) {
        return healthTipRepository.findById(id)
                .map(tip -> {
                    boolean newStatus = !Boolean.TRUE.equals(tip.getIsActive());
                    tip.setIsActive(newStatus);
                    HealthTip updated = healthTipRepository.save(tip);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isActive", updated.getIsActive(),
                            "message", "Health tip status updated to " + (newStatus ? "Active" : "Inactive")
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHealthTip(@PathVariable Long id) {
        var tipOpt = healthTipRepository.findById(id);
        if (tipOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "id", id,
                    "message", "Health tip has already been deleted."
            ));
        }
        healthTipRepository.delete(tipOpt.get());
        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Health tip \"" + tipOpt.get().getTitle() + "\" deleted successfully."
        ));
    }
}
