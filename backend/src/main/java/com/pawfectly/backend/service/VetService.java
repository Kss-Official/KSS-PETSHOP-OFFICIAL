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
    public List<VetDto> getActiveVets(String specialization, String search, Integer limit) {
        List<Vet> vets;
        if (specialization != null && !specialization.isBlank() && !specialization.equalsIgnoreCase("All Specializations") && !specialization.equalsIgnoreCase("All")) {
            vets = vetRepository.findBySpecializationAndIsActiveTrue(specialization);
        } else {
            vets = vetRepository.findByIsActiveTrue();
        }

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            vets = vets.stream()
                    .filter(v -> v.getName().toLowerCase().contains(lower) ||
                            v.getSpecialization().toLowerCase().contains(lower) ||
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
                .photoUrl(dto.getPhotoUrl())
                .rating(dto.getRating() != null ? dto.getRating() : 5.0)
                .address(dto.getAddress())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Vet saved = vetRepository.save(vet);
        log.info("Created vet: {}", saved.getName());
        return mapToDto(saved);
    }

    @Transactional
    public VetDto updateVet(Long id, VetDto dto) {
        Vet vet = vetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with id: " + id));

        vet.setName(dto.getName());
        vet.setSpecialization(dto.getSpecialization());
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
                .photoUrl(vet.getPhotoUrl())
                .rating(vet.getRating())
                .address(vet.getAddress())
                .isActive(vet.getIsActive())
                .build();
    }
}
