package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryAndIsActiveTrue(String category);

    List<Product> findByProductTypeAndIsActiveTrue(String productType);
    List<Product> findByProductTypeAndCategoryAndIsActiveTrue(String productType, String category);

    @Query("SELECT p FROM Product p WHERE p.productType = :productType AND p.isActive = true " +
           "AND (:petType IS NULL OR p.petType = :petType) " +
           "AND (:species IS NULL OR p.species = :species) " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:subcategory IS NULL OR p.subcategory = :subcategory) " +
           "AND (:brand IS NULL OR p.brand = :brand)")
    List<Product> findEssentials(
            @Param("productType") String productType,
            @Param("petType") String petType,
            @Param("species") String species,
            @Param("category") String category,
            @Param("subcategory") String subcategory,
            @Param("brand") String brand);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.productType = 'ESSENTIAL' AND p.isActive = true AND (:petType IS NULL OR p.petType = :petType)")
    List<String> findDistinctBrandsByPetType(@Param("petType") String petType);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity < 10 ORDER BY p.stockQuantity ASC")
    List<Product> findLowStockProducts();
}
