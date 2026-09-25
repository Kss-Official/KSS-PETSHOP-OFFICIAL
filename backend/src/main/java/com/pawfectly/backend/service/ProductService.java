package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ProductDto;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
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
            products = productRepository.findByProductTypeAndCategoryAndIsActiveTrue("PHARMACY", category);
        } else {
            products = productRepository.findByProductTypeAndIsActiveTrue("PHARMACY");
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
    public List<ProductDto> getPetEssentialsProducts(
            String petType,
            String species,
            String category,
            String subcategory,
            String brand,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort) {

        String normPetType = (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All"))
                ? petType.trim().toUpperCase() : null;
        String normSpecies = (species != null && !species.isBlank() && !species.equalsIgnoreCase("All"))
                ? species.trim().toUpperCase() : null;
        String normCategory = (category != null && !category.isBlank() && !category.equalsIgnoreCase("All"))
                ? category.trim() : null;
        String normSubcategory = (subcategory != null && !subcategory.isBlank() && !subcategory.equalsIgnoreCase("All"))
                ? subcategory.trim() : null;
        String normBrand = (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All"))
                ? brand.trim() : null;

        List<Product> products = productRepository.findEssentials(
                "ESSENTIAL", normPetType, normSpecies, normCategory, normSubcategory, normBrand);

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(lower) ||
                            (p.getDescription() != null && p.getDescription().toLowerCase().contains(lower)) ||
                            (p.getBrand() != null && p.getBrand().toLowerCase().contains(lower)) ||
                            (p.getSubcategory() != null && p.getSubcategory().toLowerCase().contains(lower)))
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice().compareTo(minPrice) >= 0)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice().compareTo(maxPrice) <= 0)
                    .collect(Collectors.toList());
        }

        if (sort != null && !sort.isBlank()) {
            switch (sort.toLowerCase().trim()) {
                case "price_asc":
                case "price-low-to-high":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;
                case "price_desc":
                case "price-high-to-low":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "rating":
                    products.sort(Comparator.comparing(p -> p.getRating() != null ? p.getRating() : BigDecimal.ZERO, Comparator.reverseOrder()));
                    break;
                case "newest":
                    products.sort(Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                default:
                    // default order
                    break;
            }
        }

        return products.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getBrandsByPetType(String petType) {
        String normPet = (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All"))
                ? petType.trim().toUpperCase() : null;
        return productRepository.findDistinctBrandsByPetType(normPet).stream()
                .filter(b -> b != null && !b.isBlank())
                .collect(Collectors.toList());
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
                .petType(dto.getPetType())
                .species(dto.getSpecies())
                .productType(dto.getProductType() != null ? dto.getProductType() : "ESSENTIAL")
                .subcategory(dto.getSubcategory())
                .brand(dto.getBrand())
                .rating(dto.getRating())
                .reviewsCount(dto.getReviewsCount() != null ? dto.getReviewsCount() : 0)
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
        if (dto.getPetType() != null) product.setPetType(dto.getPetType());
        if (dto.getSpecies() != null) product.setSpecies(dto.getSpecies());
        if (dto.getProductType() != null) product.setProductType(dto.getProductType());
        if (dto.getSubcategory() != null) product.setSubcategory(dto.getSubcategory());
        if (dto.getBrand() != null) product.setBrand(dto.getBrand());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getReviewsCount() != null) product.setReviewsCount(dto.getReviewsCount());
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
                .petType(product.getPetType())
                .species(product.getSpecies())
                .productType(product.getProductType())
                .subcategory(product.getSubcategory())
                .brand(product.getBrand())
                .rating(product.getRating())
                .reviewsCount(product.getReviewsCount())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .isActive(product.getIsActive())
                .build();
    }
}
