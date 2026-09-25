package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ProductReviewDto;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.ProductReview;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.ProductRepository;
import com.pawfectly.backend.repository.ProductReviewRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProductReviewDto> getReviewsForProduct(Long productId) {
        return productReviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    public void syncAllProductRatings() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            Double avgRating = productReviewRepository.getAverageRatingForProduct(product.getId());
            Long reviewCount = productReviewRepository.getReviewCountForProduct(product.getId());

            if (avgRating != null && reviewCount != null && reviewCount > 0) {
                BigDecimal rounded = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
                product.setRating(rounded);
                product.setReviewsCount(reviewCount.intValue());
            } else {
                product.setRating(null);
                product.setReviewsCount(0);
            }
            productRepository.save(product);
        }
        log.info("Synchronized real database ratings and reviews for {} products.", products.size());
    }

    @Transactional
    public ProductReviewDto createReview(Long customerId, ProductReviewDto dto) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + dto.getProductId()));

        ProductReview review = ProductReview.builder()
                .product(product)
                .customer(customer)
                .rating(dto.getRating())
                .reviewText(dto.getReviewText() != null ? dto.getReviewText().trim() : null)
                .build();

        ProductReview saved = productReviewRepository.save(review);

        // Update Aggregate Rating and Reviews Count on Product
        Double avgRating = productReviewRepository.getAverageRatingForProduct(product.getId());
        Long reviewCount = productReviewRepository.getReviewCountForProduct(product.getId());

        if (avgRating != null) {
            BigDecimal rounded = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
            product.setRating(rounded);
        }
        product.setReviewsCount(reviewCount != null ? reviewCount.intValue() : 0);
        productRepository.save(product);

        log.info("Saved product review #{} for product #{}, new rating: {}, count: {}",
                saved.getId(), product.getId(), product.getRating(), product.getReviewsCount());

        return mapToDto(saved);
    }

    private ProductReviewDto mapToDto(ProductReview review) {
        return ProductReviewDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName() != null ? review.getCustomer().getName() : "Verified Customer")
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
