package com.pawfectly.backend.dto;

import com.pawfectly.backend.entity.WishlistItemType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistToggleRequest {
    @NotNull(message = "Item type is required")
    private WishlistItemType itemType;

    @NotNull(message = "Item ID is required")
    private Long itemId;
}
