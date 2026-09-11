package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.VetReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VetReviewRepository extends JpaRepository<VetReview, Long> {

    List<VetReview> findByVetIdOrderByCreatedAtDesc(Long vetId);

    Optional<VetReview> findByAppointmentId(Long appointmentId);

    List<VetReview> findByCustomerId(Long customerId);

    boolean existsByAppointmentId(Long appointmentId);

    List<VetReview> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT AVG(r.rating) FROM VetReview r WHERE r.vet.id = :vetId")
    Double getAverageRatingForVet(Long vetId);

    @Query("SELECT COUNT(r) FROM VetReview r WHERE r.vet.id = :vetId")
    Long getReviewCountForVet(Long vetId);
}
