package com.pawfectly.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "articles", indexes = {
    @Index(name = "idx_articles_pet_type", columnList = "pet_type"),
    @Index(name = "idx_articles_featured_published", columnList = "is_featured, published_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @jakarta.validation.constraints.Size(max = 512, message = "Image URL must not exceed 512 characters")
    @jakarta.validation.constraints.Pattern(regexp = "^(https?://.*)?$", message = "Image URL must start with http:// or https://")
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "pet_type")
    private String petType;

    @Column(name = "category")
    private String category;

    @Column(name = "excerpt", columnDefinition = "TEXT")
    private String excerpt;

    @Builder.Default
    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
