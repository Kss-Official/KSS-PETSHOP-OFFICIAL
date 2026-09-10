package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Vet;
import com.pawfectly.backend.repository.VetRepository;
import com.pawfectly.backend.repository.AppointmentRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/vets", "/api/admin/vets"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminVetController {

    private final VetRepository vetRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminVetController(VetRepository vetRepository, AppointmentRepository appointmentRepository) {
        this.vetRepository = vetRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Vet>> getAllVets() {
        return ResponseEntity.ok(vetRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vet> getVetById(@PathVariable Long id) {
        return vetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vet> createVet(@Valid @RequestBody Vet vet) {
        vet.setId(null);
        if (vet.getIsActive() == null) vet.setIsActive(true);
        if (vet.getRating() == null) vet.setRating(5.0);
        Vet saved = vetRepository.save(vet);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVet(@PathVariable Long id, @Valid @RequestBody Vet vetDetails) {
        return vetRepository.findById(id)
                .map(vet -> {
                    vet.setName(vetDetails.getName());
                    vet.setSpecialization(vetDetails.getSpecialization());
                    vet.setSecondarySpecialization(vetDetails.getSecondarySpecialization());
                    vet.setPetTypes(vetDetails.getPetTypes());
                    vet.setExperienceYears(vetDetails.getExperienceYears());
                    vet.setReviewsCount(vetDetails.getReviewsCount());
                    vet.setCity(vetDetails.getCity());
                    vet.setConsultationFee(vetDetails.getConsultationFee());
                    vet.setPhotoUrl(vetDetails.getPhotoUrl());
                    vet.setAddress(vetDetails.getAddress());
                    if (vetDetails.getRating() != null) vet.setRating(vetDetails.getRating());
                    if (vetDetails.getIsActive() != null) vet.setIsActive(vetDetails.getIsActive());
                    Vet updated = vetRepository.save(vet);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleVetStatus(@PathVariable Long id) {
        return vetRepository.findById(id)
                .map(vet -> {
                    vet.setIsActive(!Boolean.TRUE.equals(vet.getIsActive()));
                    Vet updated = vetRepository.save(vet);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isActive", updated.getIsActive(),
                            "message", "Vet status updated to " + (updated.getIsActive() ? "Active" : "Inactive")
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVet(@PathVariable Long id) {
        var vetOpt = vetRepository.findById(id);
        if (vetOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "id", id,
                    "message", "Veterinarian has already been deleted."
            ));
        }
        Vet vet = vetOpt.get();
        var appointments = appointmentRepository.findByVetId(id);
        if (appointments != null && !appointments.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Cannot permanently delete \"" + vet.getName() + "\" because they have " + appointments.size() + " existing appointment(s). You can deactivate them instead."
            ));
        }
        vetRepository.delete(vet);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Veterinarian \"" + vet.getName() + "\" deleted successfully."
        ));
    }
}
