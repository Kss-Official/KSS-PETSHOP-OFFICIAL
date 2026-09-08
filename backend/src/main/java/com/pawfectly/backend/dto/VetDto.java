package com.pawfectly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VetDto {
    private Long id;

    @NotBlank(message = "Vet name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String secondarySpecialization;
    private String petTypes;
    private Integer experienceYears;
    private Integer reviewsCount;
    private String city;
    private Double consultationFee;

    private String photoUrl;
    private Double rating;
    private String address;

    @Builder.Default
    private Boolean isActive = true;
}
