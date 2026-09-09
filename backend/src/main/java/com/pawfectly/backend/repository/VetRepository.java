package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VetRepository extends JpaRepository<Vet, Long> {
    List<Vet> findByIsActiveTrue();
    List<Vet> findBySpecializationAndIsActiveTrue(String specialization);
    long countByIsActive(Boolean isActive);
}
