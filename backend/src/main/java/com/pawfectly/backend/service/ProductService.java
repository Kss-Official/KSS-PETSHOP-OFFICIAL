package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ProductDto;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductDto> getActiveProducts(String category, String search) {
        List<Product> products;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            products = productRepository.findByCategoryAndIsActiveTrue(category);
        } else {
            products = productRepository.findByIsActiveTrue();
        }

        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase().trim();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(lowerSearch) ||
                            (p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerSearch)))
                    .collect(Collectors.toList());
        }

        return products.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        if (!Boolean.TRUE.equals(product.getIsActive())) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .imageUrl(dto.getImageUrl())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Product saved = productRepository.save(product);
        log.info("Created product: {}", saved.getName());
        return mapToDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        if (dto.getStockQuantity() != null) {
            product.setStockQuantity(dto.getStockQuantity());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getIsActive() != null) {
            product.setIsActive(dto.getIsActive());
        }

        Product updated = productRepository.save(product);
        log.info("Updated product id: {}", id);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setIsActive(false);
        productRepository.save(product);
        log.info("Soft-deleted product id: {}", id);
    }

    public ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .isActive(product.getIsActive())
                .build();
    }
}
