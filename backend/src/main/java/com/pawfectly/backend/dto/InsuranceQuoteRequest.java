package com.pawfectly.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsuranceQuoteRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String customerEmail;

    @NotBlank(message = "Phone number is required")
    private String customerPhone;

    @NotBlank(message = "Pet name is required")
    private String petName;

    @NotBlank(message = "Pet species is required")
    private String petSpecies;

    @NotNull(message = "Pet age is required")
    @Min(value = 0, message = "Pet age cannot be negative")
    private Integer petAge;

    @NotBlank(message = "Selected plan is required")
    private String selectedPlan;
}
