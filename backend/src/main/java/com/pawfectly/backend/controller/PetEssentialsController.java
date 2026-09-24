package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.ProductDto;
import com.pawfectly.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/pet-essentials")
@RequiredArgsConstructor
public class PetEssentialsController {

    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getEssentialsProducts(
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(productService.getPetEssentialsProducts(
                petType, species, category, subcategory, brand, search, minPrice, maxPrice, sort));
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands(
            @RequestParam(required = false) String petType) {
        return ResponseEntity.ok(productService.getBrandsByPetType(petType));
    }
}
