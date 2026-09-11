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
public class ServiceDto {
    private Long id;

    @NotBlank(message = "Service name is required")
    private String name;

    private String description;
    @jakarta.validation.constraints.Size(max = 512, message = "Icon URL must not exceed 512 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^(https?://.*|[a-zA-Z0-9_-]+)?$", message = "Icon URL must start with http:// or https://")
    private String iconUrl;

    @Builder.Default
    private Boolean isActive = true;
}
