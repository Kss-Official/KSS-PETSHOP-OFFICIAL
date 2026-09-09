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
    List<Appointment> findAllByOrderByDateTimeDesc();

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:status IS NULL OR a.status = :status) " +
           "ORDER BY a.dateTime DESC")
    List<Appointment> findFiltered(@Param("status") AppointmentStatus status);

    long countByStatus(AppointmentStatus status);

    @Query("SELECT COALESCE(SUM(COALESCE(a.vet.consultationFee, 50.0)), 0.0) FROM Appointment a WHERE a.status = 'COMPLETED' AND a.dateTime >= :startDate")
    Double sumCompletedAppointmentRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT a FROM Appointment a WHERE a.status = 'COMPLETED' AND a.dateTime >= :startDate AND a.dateTime < :endDate")
    List<Appointment> findCompletedAppointmentsBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM Appointment a WHERE a.pet.owner.id = :customerId ORDER BY a.dateTime DESC")
    List<Appointment> findByCustomerId(@Param("customerId") Long customerId);
}
