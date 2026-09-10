package com.pawfectly.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VetReviewDto {
    private Long id;
    
    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    private Long vetId;
    private String vetName;
    
    private Long customerId;
    private String customerName;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    private String reviewText;
    private LocalDateTime createdAt;
}
