package com.pawfectly.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_tips", indexes = {
    @Index(name = "idx_health_tips_category", columnList = "category"),
    @Index(name = "idx_health_tips_pet_type", columnList = "pet_type"),
    @Index(name = "idx_health_tips_featured", columnList = "is_featured")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthTip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Size(max = 512, message = "Image URL must not exceed 512 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Image URL must start with http:// or https://")
    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Builder.Default
    @Column(name = "category", nullable = false)
    private String category = "Preventive Care";

    @Builder.Default
    @Column(name = "pet_type")
    private String petType = "ALL";

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

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
