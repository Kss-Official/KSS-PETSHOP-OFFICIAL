package com.pawfectly.backend.dto;

import com.pawfectly.backend.entity.WishlistItemType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistIdDto {
    private WishlistItemType itemType;
    private Long itemId;
}
