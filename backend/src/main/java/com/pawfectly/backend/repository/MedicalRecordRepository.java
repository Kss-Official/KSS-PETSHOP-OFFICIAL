package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    Optional<MedicalRecord> findByAppointmentId(Long appointmentId);

    @org.springframework.data.jpa.repository.Query("SELECT m.appointment.id FROM MedicalRecord m WHERE m.appointment.id IN :appointmentIds")
    java.util.List<Long> findAppointmentIdsByAppointmentIdIn(@org.springframework.data.repository.query.Param("appointmentIds") java.util.List<Long> appointmentIds);
}
