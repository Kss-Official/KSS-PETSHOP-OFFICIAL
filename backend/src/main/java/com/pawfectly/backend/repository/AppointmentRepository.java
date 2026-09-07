package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
