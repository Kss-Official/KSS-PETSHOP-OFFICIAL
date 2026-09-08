package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.PetDto;
import com.pawfectly.backend.entity.Pet;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.PetRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PetDto> getCustomerPets(Long userId) {
        return petRepository.findByOwnerId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PetDto getPetById(Long petId, Long userId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if (!pet.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this pet.");
        }

        return mapToDto(pet);
    }

    @Transactional
    public PetDto createPet(Long userId, PetDto petDto) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pet pet = Pet.builder()
                .owner(owner)
                .name(petDto.getName())
                .species(petDto.getSpecies())
                .breed(petDto.getBreed())
                .age(petDto.getAge())
                .build();

        Pet saved = petRepository.save(pet);
        log.info("Created new pet {} for user id: {}", saved.getName(), userId);
        return mapToDto(saved);
    }

    @Transactional
    public PetDto updatePet(Long petId, Long userId, PetDto petDto) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if (!pet.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You cannot edit a pet you do not own.");
        }

        pet.setName(petDto.getName());
        pet.setSpecies(petDto.getSpecies());
        pet.setBreed(petDto.getBreed());
        pet.setAge(petDto.getAge());

        Pet updated = petRepository.save(pet);
        log.info("Updated pet {} for user id: {}", petId, userId);
        return mapToDto(updated);
    }

    @Transactional
    public void deletePet(Long petId, Long userId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if (!pet.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You cannot delete a pet you do not own.");
        }

        petRepository.delete(pet);
        log.info("Deleted pet {} for user id: {}", petId, userId);
    }

    private PetDto mapToDto(Pet pet) {
        return PetDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .ownerId(pet.getOwner().getId())
                .build();
    }
}
