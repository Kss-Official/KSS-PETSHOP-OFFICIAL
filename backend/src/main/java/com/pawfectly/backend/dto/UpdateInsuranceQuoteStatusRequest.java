package com.pawfectly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInsuranceQuoteStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String notes;
}
