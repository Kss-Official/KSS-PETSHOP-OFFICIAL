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

    private String imageUrl;
    private String petType;

    @Builder.Default
    private Boolean isFeatured = false;

    private LocalDateTime publishedAt;
}
