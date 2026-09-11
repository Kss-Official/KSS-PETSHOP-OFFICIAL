package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPetId(Long petId);
    List<Appointment> findByVetId(Long vetId);
    List<Appointment> findByServiceId(Long serviceId);
    Optional<Appointment> findByVetIdAndDateTime(Long vetId, LocalDateTime dateTime);
    @Query("SELECT a FROM Appointment a " +
           "LEFT JOIN FETCH a.pet p " +
           "LEFT JOIN FETCH p.owner " +
           "LEFT JOIN FETCH a.vet " +
           "LEFT JOIN FETCH a.service " +
           "ORDER BY a.createdAt DESC, a.id DESC")
    List<Appointment> findRecentAppointmentsWithDetails(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT a FROM Appointment a " +
           "LEFT JOIN FETCH a.pet p " +
           "LEFT JOIN FETCH p.owner " +
           "LEFT JOIN FETCH a.vet " +
           "LEFT JOIN FETCH a.service " +
           "WHERE (:status IS NULL OR a.status = :status) " +
           "ORDER BY a.createdAt DESC, a.id DESC")
    List<Appointment> findFiltered(@Param("status") AppointmentStatus status);

    long countByStatus(AppointmentStatus status);

    @Query("SELECT COALESCE(SUM(COALESCE(a.vet.consultationFee, 500.0)), 0.0) FROM Appointment a WHERE a.status = 'COMPLETED' AND a.dateTime >= :startDate")
    Double sumCompletedAppointmentRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT a FROM Appointment a " +
           "LEFT JOIN FETCH a.vet " +
           "WHERE a.status = 'COMPLETED' AND a.dateTime >= :startDate")
    List<Appointment> findCompletedAppointmentsSinceWithVet(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT a FROM Appointment a WHERE a.status = 'COMPLETED' AND a.dateTime >= :startDate AND a.dateTime < :endDate")
    List<Appointment> findCompletedAppointmentsBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM Appointment a WHERE a.pet.owner.id = :customerId ORDER BY a.createdAt DESC, a.id DESC")
    List<Appointment> findByCustomerId(@Param("customerId") Long customerId);
}
