package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryAndIsActiveTrue(String category);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity < 10 ORDER BY p.stockQuantity ASC")
    List<Product> findLowStockProducts();
}
