package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.ProductReviewDto;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService productReviewService;

    // Public endpoint to read all reviews for a product
    @GetMapping({"/api/products/{productId}/reviews", "/api/pet-essentials/products/{productId}/reviews"})
    public ResponseEntity<List<ProductReviewDto>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(productReviewService.getReviewsForProduct(productId));
    }

    // Authenticated Customer endpoint to submit a review for a product
    @PostMapping("/api/customer/products/{productId}/reviews")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ProductReviewDto> createProductReview(
            @PathVariable Long productId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProductReviewDto request) {
        request.setProductId(productId);
        ProductReviewDto saved = productReviewService.createReview(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
