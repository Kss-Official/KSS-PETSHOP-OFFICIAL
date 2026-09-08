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
