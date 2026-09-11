package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.WishlistIdDto;
import com.pawfectly.backend.dto.WishlistItemResponseDto;
import com.pawfectly.backend.dto.WishlistToggleRequest;
import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final VetRepository vetRepository;
    private final ServiceRepository serviceRepository;

    @Transactional
    public boolean toggleWishlistItem(Long customerId, WishlistToggleRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        validateItemExists(request.getItemType(), request.getItemId());

        Optional<WishlistItem> existing = wishlistItemRepository.findByCustomerIdAndItemTypeAndItemId(
                customerId, request.getItemType(), request.getItemId());

        if (existing.isPresent()) {
            wishlistItemRepository.delete(existing.get());
            return false; // Removed from wishlist
        } else {
            WishlistItem item = WishlistItem.builder()
                    .customer(customer)
                    .itemType(request.getItemType())
                    .itemId(request.getItemId())
                    .build();
            wishlistItemRepository.save(item);
            return true; // Added to wishlist
        }
    }

    @Transactional(readOnly = true)
    public List<WishlistIdDto> getWishlistIds(Long customerId) {
        return wishlistItemRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(item -> WishlistIdDto.builder()
                        .itemType(item.getItemType())
                        .itemId(item.getItemId())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WishlistItemResponseDto> getWishlistItems(Long customerId) {
        List<WishlistItem> items = wishlistItemRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        List<WishlistItemResponseDto> responseList = new ArrayList<>();

        for (WishlistItem item : items) {
            try {
                WishlistItemResponseDto dto = hydrateWishlistItem(item);
                if (dto != null && !Boolean.FALSE.equals(dto.getIsActive())) {
                    responseList.add(dto);
                }
            } catch (Exception e) {
                // skip corrupted/deleted item
            }
        }

        return responseList;
    }

    private void validateItemExists(WishlistItemType itemType, Long itemId) {
        if (itemType == WishlistItemType.PRODUCT) {
            Product p = productRepository.findById(itemId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemId));
            if (!Boolean.TRUE.equals(p.getIsActive())) {
                throw new IllegalArgumentException("Product is no longer active");
            }
        } else if (itemType == WishlistItemType.VET) {
            Vet v = vetRepository.findById(itemId)
                    .orElseThrow(() -> new IllegalArgumentException("Veterinarian not found with ID: " + itemId));
            if (!Boolean.TRUE.equals(v.getIsActive())) {
                throw new IllegalArgumentException("Veterinarian is no longer active");
            }
        } else if (itemType == WishlistItemType.SERVICE) {
            ServiceEntity s = serviceRepository.findById(itemId)
                    .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + itemId));
            if (!Boolean.TRUE.equals(s.getIsActive())) {
                throw new IllegalArgumentException("Service is no longer active");
            }
        }
    }

    private WishlistItemResponseDto hydrateWishlistItem(WishlistItem item) {
        if (item.getItemType() == WishlistItemType.PRODUCT) {
            Optional<Product> productOpt = productRepository.findById(item.getItemId());
            if (productOpt.isEmpty()) return null;
            Product p = productOpt.get();
            return WishlistItemResponseDto.builder()
                    .id(item.getId())
                    .itemType(item.getItemType())
                    .itemId(item.getItemId())
                    .name(p.getName())
                    .price(p.getPrice())
                    .imageUrl(p.getImageUrl())
                    .category(p.getCategory())
                    .description(p.getDescription())
                    .isActive(p.getIsActive())
                    .createdAt(item.getCreatedAt())
                    .build();
        } else if (item.getItemType() == WishlistItemType.VET) {
            Optional<Vet> vetOpt = vetRepository.findById(item.getItemId());
            if (vetOpt.isEmpty()) return null;
            Vet v = vetOpt.get();
            return WishlistItemResponseDto.builder()
                    .id(item.getId())
                    .itemType(item.getItemType())
                    .itemId(item.getItemId())
                    .name(v.getName())
                    .price(v.getConsultationFee() != null ? BigDecimal.valueOf(v.getConsultationFee()) : BigDecimal.valueOf(500))
                    .imageUrl(v.getPhotoUrl())
                    .specialization(v.getSpecialization())
                    .description(v.getBio())
                    .isActive(v.getIsActive())
                    .createdAt(item.getCreatedAt())
                    .build();
        } else if (item.getItemType() == WishlistItemType.SERVICE) {
            Optional<ServiceEntity> serviceOpt = serviceRepository.findById(item.getItemId());
            if (serviceOpt.isEmpty()) return null;
            ServiceEntity s = serviceOpt.get();
            return WishlistItemResponseDto.builder()
                    .id(item.getId())
                    .itemType(item.getItemType())
                    .itemId(item.getItemId())
                    .name(s.getName())
                    .description(s.getDescription())
                    .imageUrl(s.getIconUrl())
                    .isActive(s.getIsActive())
                    .createdAt(item.getCreatedAt())
                    .build();
        }
        return null;
    }
}
