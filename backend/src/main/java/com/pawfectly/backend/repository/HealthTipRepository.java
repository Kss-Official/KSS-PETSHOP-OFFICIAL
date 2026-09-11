package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.HealthTip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthTipRepository extends JpaRepository<HealthTip, Long> {
    List<HealthTip> findByIsActiveTrue();
    List<HealthTip> findByIsActiveTrueAndIsFeaturedTrue();
    List<HealthTip> findByIsActiveTrueAndCategoryIgnoreCase(String category);
}
