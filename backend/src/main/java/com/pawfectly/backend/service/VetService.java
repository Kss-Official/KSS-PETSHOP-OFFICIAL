package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.VetDto;
import com.pawfectly.backend.entity.Vet;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.VetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<VetDto> getActiveVets(String specialization, String petType, String search, Integer limit) {
        List<Vet> vets = vetRepository.findByIsActiveTrue();

        if (specialization != null && !specialization.isBlank() && !specialization.equalsIgnoreCase("All Specializations") && !specialization.equalsIgnoreCase("All")) {
            String specLower = specialization.toLowerCase().trim();
            vets = vets.stream()
                    .filter(v -> (v.getSpecialization() != null && v.getSpecialization().toLowerCase().contains(specLower)) ||
                            (v.getSecondarySpecialization() != null && v.getSecondarySpecialization().toLowerCase().contains(specLower)))
                    .collect(Collectors.toList());
        }

        if (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All")) {
            String petLower = petType.toLowerCase().trim();
            vets = vets.stream()
                    .filter(v -> v.getPetTypes() != null && v.getPetTypes().toLowerCase().contains(petLower))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            vets = vets.stream()
                    .filter(v -> v.getName().toLowerCase().contains(lower) ||
                            (v.getSpecialization() != null && v.getSpecialization().toLowerCase().contains(lower)) ||
                            (v.getSecondarySpecialization() != null && v.getSecondarySpecialization().toLowerCase().contains(lower)) ||
                            (v.getCity() != null && v.getCity().toLowerCase().contains(lower)) ||
                            (v.getAddress() != null && v.getAddress().toLowerCase().contains(lower)))
                    .collect(Collectors.toList());
        }

        if (limit != null && limit > 0 && vets.size() > limit) {
            vets = vets.subList(0, limit);
        }

        return vets.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VetDto getVetById(Long id) {
        Vet vet = vetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with id: " + id));
        if (!Boolean.TRUE.equals(vet.getIsActive())) {
            throw new ResourceNotFoundException("Vet not found with id: " + id);
        }
        return mapToDto(vet);
    }

    @Transactional(readOnly = true)
    public List<String> getAllSpecializations() {
        return vetRepository.findAll().stream()
                .map(Vet::getSpecialization)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VetDto> getAllVetsAdmin() {
        return vetRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VetDto createVet(VetDto dto) {
        Vet vet = Vet.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .secondarySpecialization(dto.getSecondarySpecialization())
                .petTypes(dto.getPetTypes())
                .experienceYears(dto.getExperienceYears())
                .reviewsCount(dto.getReviewsCount() != null ? dto.getReviewsCount() : 0)
                .city(dto.getCity())
                .consultationFee(dto.getConsultationFee())
                .photoUrl(dto.getPhotoUrl())
                .rating(dto.getRating() != null ? dto.getRating() : 5.0)
                .address(dto.getAddress())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Vet saved = vetRepository.save(vet);
        log.info("Created vet: {}", saved.getName());
        try {
            notificationService.createNewVetNotification(saved);
        } catch (Exception e) {
            log.error("Failed to send new vet notification: {}", e.getMessage());
        }
        return mapToDto(saved);
    }

    @Transactional
    public VetDto updateVet(Long id, VetDto dto) {
        Vet vet = vetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with id: " + id));

        if (dto.getName() != null) vet.setName(dto.getName());
        if (dto.getSpecialization() != null) vet.setSpecialization(dto.getSpecialization());
        if (dto.getSecondarySpecialization() != null) vet.setSecondarySpecialization(dto.getSecondarySpecialization());
        if (dto.getPetTypes() != null) vet.setPetTypes(dto.getPetTypes());
        if (dto.getExperienceYears() != null) vet.setExperienceYears(dto.getExperienceYears());
        if (dto.getReviewsCount() != null) vet.setReviewsCount(dto.getReviewsCount());
        if (dto.getCity() != null) vet.setCity(dto.getCity());
        if (dto.getConsultationFee() != null) vet.setConsultationFee(dto.getConsultationFee());
        if (dto.getPhotoUrl() != null) vet.setPhotoUrl(dto.getPhotoUrl());
        if (dto.getRating() != null) vet.setRating(dto.getRating());
        if (dto.getAddress() != null) vet.setAddress(dto.getAddress());
        if (dto.getIsActive() != null) vet.setIsActive(dto.getIsActive());

        Vet updated = vetRepository.save(vet);
        log.info("Updated vet id: {}", id);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteVet(Long id) {
        Vet vet = vetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with id: " + id));
        vet.setIsActive(false);
        vetRepository.save(vet);
        log.info("Soft-deleted vet id: {}", id);
    }

    private VetDto mapToDto(Vet vet) {
        return VetDto.builder()
                .id(vet.getId())
                .name(vet.getName())
                .specialization(vet.getSpecialization())
                .secondarySpecialization(vet.getSecondarySpecialization())
                .petTypes(vet.getPetTypes())
                .experienceYears(vet.getExperienceYears())
                .reviewsCount(vet.getReviewsCount())
                .city(vet.getCity())
                .consultationFee(vet.getConsultationFee())
                .photoUrl(vet.getPhotoUrl())
                .rating(vet.getRating())
                .address(vet.getAddress())
                .isActive(vet.getIsActive())
                .build();
    }
}
