package com.pawfectly.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private Long id;

    @NotBlank(message = "Article title is required")
    private String title;

    @NotBlank(message = "Article content is required")
    private String content;

    @jakarta.validation.constraints.Size(max = 512, message = "Image URL must not exceed 512 characters")
    private String imageUrl;
    private String petType;
    private String category;
    private String excerpt;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime publishedAt;
}
