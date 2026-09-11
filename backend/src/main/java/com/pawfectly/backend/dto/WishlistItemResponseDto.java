package com.pawfectly.backend.dto;

import com.pawfectly.backend.entity.WishlistItemType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemResponseDto {
    private Long id;
    private WishlistItemType itemType;
    private Long itemId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private String specialization;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
