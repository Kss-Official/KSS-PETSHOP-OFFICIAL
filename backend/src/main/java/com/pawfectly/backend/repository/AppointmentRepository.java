package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.pet.id = :petId")
    List<Appointment> findByPetId(@Param("petId") Long petId);

    @Query("SELECT a FROM Appointment a WHERE a.vet.id = :vetId")
    List<Appointment> findByVetId(@Param("vetId") Long vetId);

    @Query("SELECT a FROM Appointment a WHERE a.service.id = :serviceId")
    List<Appointment> findByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT a FROM Appointment a WHERE a.vet.id = :vetId AND a.dateTime = :dateTime")
    Optional<Appointment> findByVetIdAndDateTime(@Param("vetId") Long vetId, @Param("dateTime") LocalDateTime dateTime);
}
