package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.WishlistIdDto;
import com.pawfectly.backend.dto.WishlistItemResponseDto;
import com.pawfectly.backend.dto.WishlistToggleRequest;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/wishlist")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItemResponseDto>> getWishlistItems(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlistItems(userDetails.getId()));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<WishlistIdDto>> getWishlistIds(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlistIds(userDetails.getId()));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleWishlistItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody WishlistToggleRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        boolean saved = wishlistService.toggleWishlistItem(userDetails.getId(), request);
        return ResponseEntity.ok(Map.of(
                "saved", saved,
                "message", saved ? "Item saved to wishlist" : "Item removed from wishlist"
        ));
    }
}
