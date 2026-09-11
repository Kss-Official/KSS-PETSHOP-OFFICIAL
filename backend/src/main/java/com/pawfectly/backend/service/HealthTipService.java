package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.HealthTipDto;
import com.pawfectly.backend.entity.HealthTip;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.HealthTipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthTipService {

    private final HealthTipRepository healthTipRepository;

    @PostConstruct
    public void ensureHealthTips() {
        try {
            List<HealthTip> tips = healthTipRepository.findAll();
            boolean changed = false;
            for (HealthTip t : tips) {
                if (t.getIsActive() == null || !t.getIsActive()) {
                    t.setIsActive(true);
                    changed = true;
                }
                String title = t.getTitle() != null ? t.getTitle().toLowerCase() : "";
                String currentCat = t.getCategory();
                String targetCat = currentCat;
                if (currentCat == null || currentCat.isBlank() || currentCat.equalsIgnoreCase("Preventive Care") || currentCat.equalsIgnoreCase("General")) {
                    if (title.contains("nutrition") || title.contains("food") || title.contains("diet")) {
                        targetCat = "Nutrition";
                    } else if (title.contains("vaccin") || title.contains("shot")) {
                        targetCat = "Vaccination";
                    } else if (title.contains("groom") || title.contains("bath") || title.contains("wash")) {
                        targetCat = "Grooming";
                    } else if (title.contains("sign") || title.contains("sick") || title.contains("emergenc")) {
                        targetCat = "Emergency Care";
                    } else if (title.contains("cat") || title.contains("indoor") || title.contains("play") || title.contains("behaviour") || title.contains("behavior")) {
                        targetCat = "Behaviour";
                    } else if (title.contains("senior") || title.contains("aging") || title.contains("old")) {
                        targetCat = "Senior Pet Care";
                    } else if (title.contains("prevent") || title.contains("flea") || title.contains("tick") || title.contains("dental") || title.contains("checkup")) {
                        targetCat = "Preventive Care";
                    }
                }
                if (targetCat != null && !targetCat.equalsIgnoreCase(currentCat)) {
                    t.setCategory(targetCat);
                    changed = true;
                }
            }
            if (changed) {
                healthTipRepository.saveAll(tips);
                log.info("Initialized and normalized {} health tips", tips.size());
            }
        } catch (Exception e) {
            log.warn("Could not auto-activate or normalize health tips: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<HealthTipDto> getHealthTips(String petType, String category, Boolean featured, String search) {
        List<HealthTip> tips = healthTipRepository.findAll();

        // Only active tips are visible publicly
        tips = tips.stream()
                .filter(t -> t.getIsActive() == null || Boolean.TRUE.equals(t.getIsActive()))
                .collect(Collectors.toList());

        if (featured != null && featured) {
            tips = tips.stream().filter(t -> Boolean.TRUE.equals(t.getIsFeatured())).collect(Collectors.toList());
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All") && !category.equalsIgnoreCase("All Tips")) {
            tips = tips.stream()
                    .filter(t -> t.getCategory() != null && t.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }

        if (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All") && !petType.equalsIgnoreCase("All Pets") && !petType.equalsIgnoreCase("All Tips")) {
            tips = tips.stream()
                    .filter(t -> t.getPetType() != null && (t.getPetType().equalsIgnoreCase("ALL") || t.getPetType().equalsIgnoreCase(petType.trim())))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            tips = tips.stream()
                    .filter(t -> (t.getTitle() != null && t.getTitle().toLowerCase().contains(lower)) ||
                            (t.getContent() != null && t.getContent().toLowerCase().contains(lower)) ||
                            (t.getCategory() != null && t.getCategory().toLowerCase().contains(lower)))
                    .collect(Collectors.toList());
        }

        return tips.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HealthTipDto getHealthTipById(Long id) {
        HealthTip tip = healthTipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health tip not found with id: " + id));
        return mapToDto(tip);
    }

    @Transactional
    public HealthTipDto createHealthTip(HealthTipDto dto) {
        HealthTip tip = HealthTip.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .petType(dto.getPetType() != null ? dto.getPetType() : "ALL")
                .category(dto.getCategory() != null ? dto.getCategory() : "Preventive Care")
                .excerpt(dto.getExcerpt())
                .isFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .publishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now())
                .build();
        return mapToDto(healthTipRepository.save(tip));
    }

    @Transactional
    public HealthTipDto updateHealthTip(Long id, HealthTipDto dto) {
        HealthTip tip = healthTipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health tip not found with id: " + id));

        tip.setTitle(dto.getTitle());
        tip.setContent(dto.getContent());
        if (dto.getImageUrl() != null) tip.setImageUrl(dto.getImageUrl());
        if (dto.getPetType() != null) tip.setPetType(dto.getPetType());
        if (dto.getCategory() != null) tip.setCategory(dto.getCategory());
        if (dto.getExcerpt() != null) tip.setExcerpt(dto.getExcerpt());
        if (dto.getIsFeatured() != null) tip.setIsFeatured(dto.getIsFeatured());
        if (dto.getIsActive() != null) tip.setIsActive(dto.getIsActive());

        return mapToDto(healthTipRepository.save(tip));
    }

    @Transactional
    public void deleteHealthTip(Long id) {
        HealthTip tip = healthTipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health tip not found with id: " + id));
        healthTipRepository.delete(tip);
    }

    private HealthTipDto mapToDto(HealthTip tip) {
        return HealthTipDto.builder()
                .id(tip.getId())
                .title(tip.getTitle())
                .content(tip.getContent())
                .imageUrl(tip.getImageUrl())
                .petType(tip.getPetType())
                .category(tip.getCategory())
                .excerpt(tip.getExcerpt())
                .isFeatured(tip.getIsFeatured())
                .isActive(tip.getIsActive())
                .publishedAt(tip.getPublishedAt())
                .createdAt(tip.getCreatedAt())
                .updatedAt(tip.getUpdatedAt())
                .build();
    }
}
