package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        product.setId(null);
        if (product.getIsActive() == null) product.setIsActive(true);
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setCategory(productDetails.getCategory());
                    product.setStockQuantity(productDetails.getStockQuantity());
                    product.setImageUrl(productDetails.getImageUrl());
                    if (productDetails.getIsActive() != null) {
                        product.setIsActive(productDetails.getIsActive());
                    }
                    Product updated = productRepository.save(product);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setIsActive(!Boolean.TRUE.equals(product.getIsActive()));
                    Product updated = productRepository.save(product);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isActive", updated.getIsActive(),
                            "message", "Product status updated to " + (updated.getIsActive() ? "Active" : "Inactive")
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok(Map.of("message", "Product deleted successfully."));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
