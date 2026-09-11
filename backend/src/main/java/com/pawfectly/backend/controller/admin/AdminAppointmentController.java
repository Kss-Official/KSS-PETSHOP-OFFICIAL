package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.MedicalRecord;
import com.pawfectly.backend.entity.Vet;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.MedicalRecordRepository;
import com.pawfectly.backend.repository.VetRepository;
import com.pawfectly.backend.repository.VetReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/v1/admin/appointments", "/api/admin/appointments"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminAppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final VetReviewRepository vetReviewRepository;
    private final VetRepository vetRepository;

    public AdminAppointmentController(
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            VetReviewRepository vetReviewRepository,
            VetRepository vetRepository) {
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.vetReviewRepository = vetReviewRepository;
        this.vetRepository = vetRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAppointments(
            @RequestParam(required = false) String status) {

        AppointmentStatus st = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try { st = AppointmentStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        List<Appointment> appointments = appointmentRepository.findFiltered(st);
        List<Long> apptIds = appointments.stream().map(Appointment::getId).collect(Collectors.toList());

        java.util.Set<Long> apptIdsWithRecords = apptIds.isEmpty()
                ? java.util.Set.of()
                : new java.util.HashSet<>(medicalRecordRepository.findAppointmentIdsByAppointmentIdIn(apptIds));

        List<Map<String, Object>> response = appointments.stream().map(apt -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", apt.getId());
            map.put("petId", apt.getPet() != null ? apt.getPet().getId() : null);
            map.put("petName", apt.getPet() != null ? apt.getPet().getName() : "Unknown");
            map.put("petSpecies", apt.getPet() != null ? apt.getPet().getSpecies() : "");
            map.put("petBreed", apt.getPet() != null ? apt.getPet().getBreed() : "");
            String owner = apt.getPet() != null && apt.getPet().getOwner() != null ? apt.getPet().getOwner().getName() : "Customer";
            String email = apt.getPet() != null && apt.getPet().getOwner() != null ? apt.getPet().getOwner().getEmail() : "";
            String phone = apt.getPet() != null && apt.getPet().getOwner() != null ? apt.getPet().getOwner().getPhone() : "";
            map.put("ownerName", owner);
            map.put("ownerEmail", email);
            map.put("ownerPhone", phone);
            map.put("customerName", owner);
            map.put("customerEmail", email);
            map.put("customerPhone", phone);
            map.put("vetId", apt.getVet() != null ? apt.getVet().getId() : null);
            map.put("vetName", apt.getVet() != null ? apt.getVet().getName() : "General Vet");
            map.put("serviceId", apt.getService() != null ? apt.getService().getId() : null);
            map.put("serviceName", apt.getService() != null ? apt.getService().getName() : "Consultation");
            Double fee = apt.getVet() != null && apt.getVet().getConsultationFee() != null ? apt.getVet().getConsultationFee() : 500.0;
            map.put("fee", fee);
            map.put("amount", fee);
            map.put("consultationFee", fee);
            map.put("dateTime", apt.getDateTime());
            map.put("createdAt", apt.getCreatedAt());
            map.put("status", apt.getStatus().name());
            String paymentStatus = apt.getPaymentStatus();
            if (apt.getStatus() == AppointmentStatus.COMPLETED && !"PAID".equalsIgnoreCase(paymentStatus)) {
                paymentStatus = "PAID";
                apt.setPaymentStatus("PAID");
                appointmentRepository.save(apt);
            }
            map.put("paymentStatus", paymentStatus != null ? paymentStatus : "UNPAID");
            map.put("hasMedicalRecord", apptIdsWithRecords.contains(apt.getId()));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }

        try {
            AppointmentStatus newStatus = AppointmentStatus.valueOf(statusStr.toUpperCase());
            return appointmentRepository.findById(id).map(apt -> {
                apt.setStatus(newStatus);
                if (newStatus == AppointmentStatus.COMPLETED) {
                    apt.setPaymentStatus("PAID");
                }
                Appointment saved = appointmentRepository.save(apt);
                return ResponseEntity.ok(Map.of(
                        "id", saved.getId(),
                        "status", saved.getStatus().name(),
                        "paymentStatus", saved.getPaymentStatus() != null ? saved.getPaymentStatus() : "PAID",
                        "message", "Appointment status updated to " + saved.getStatus().name()
                ));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value"));
        }
    }

    @RequestMapping(value = "/{id}/payment-status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String paymentStatusStr = body.get("paymentStatus");
        if (paymentStatusStr == null) {
            paymentStatusStr = body.get("status");
        }
        if (paymentStatusStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment status is required"));
        }

        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt == null) {
            return ResponseEntity.notFound().build();
        }

        String currentStatus = apt.getPaymentStatus() != null ? apt.getPaymentStatus().toUpperCase() : "UNPAID";
        if ("PAID".equals(currentStatus) || "FAILED".equals(currentStatus)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Payment status is already in terminal state '" + currentStatus + "' and cannot be modified."
            ));
        }

        String targetStatus = paymentStatusStr.toUpperCase();
        if (!"PAID".equals(targetStatus) && !"FAILED".equals(targetStatus) && !"UNPAID".equals(targetStatus)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid payment status. Allowed: UNPAID, PAID, FAILED"));
        }

        apt.setPaymentStatus(targetStatus);
        Appointment saved = appointmentRepository.save(apt);
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "paymentStatus", saved.getPaymentStatus(),
                "message", "Payment status updated to " + saved.getPaymentStatus()
        ));
    }

    @GetMapping("/{id}/medical-record")
    public ResponseEntity<?> getMedicalRecord(@PathVariable Long id) {
        return medicalRecordRepository.findByAppointmentId(id)
                .map(rec -> ResponseEntity.ok(Map.of(
                        "id", rec.getId(),
                        "appointmentId", id,
                        "diagnosis", rec.getDiagnosis() != null ? rec.getDiagnosis() : "",
                        "prescription", rec.getPrescription() != null ? rec.getPrescription() : "",
                        "notes", rec.getNotes() != null ? rec.getNotes() : ""
                )))
                .orElse(ResponseEntity.ok(Map.of("appointmentId", id, "diagnosis", "", "prescription", "", "notes", "")));
    }

    @PostMapping("/{id}/medical-record")
    public ResponseEntity<?> saveMedicalRecord(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Medical records can only be created for completed appointments"));
        }

        MedicalRecord record = medicalRecordRepository.findByAppointmentId(id)
                .orElse(MedicalRecord.builder().appointment(appointment).build());

        record.setDiagnosis(body.get("diagnosis"));
        record.setPrescription(body.get("prescription"));
        record.setNotes(body.get("notes"));

        MedicalRecord saved = medicalRecordRepository.save(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "appointmentId", id,
                "message", "Medical record saved successfully"
        ));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Appointment apt = appointmentRepository.findById(id).orElse(null);
        if (apt == null) {
            return ResponseEntity.notFound().build();
        }

        Long vetId = apt.getVet() != null ? apt.getVet().getId() : null;

        // 1. Delete associated VetReview if any
        vetReviewRepository.findByAppointmentId(id).ifPresent(vetReviewRepository::delete);

        // 2. Delete associated MedicalRecord if any
        medicalRecordRepository.findByAppointmentId(id).ifPresent(medicalRecordRepository::delete);

        // 3. Delete Appointment
        appointmentRepository.delete(apt);

        // 4. Recalculate vet ratings if vet exists
        if (vetId != null) {
            Vet vet = vetRepository.findById(vetId).orElse(null);
            if (vet != null) {
                Long reviewCount = vetReviewRepository.getReviewCountForVet(vetId);
                Double avgRating = vetReviewRepository.getAverageRatingForVet(vetId);
                vet.setReviewsCount(reviewCount != null ? reviewCount.intValue() : 0);
                vet.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);
                vetRepository.save(vet);
            }
        }

        return ResponseEntity.ok(Map.of("message", "Appointment #" + id + " deleted successfully"));
    }

    @DeleteMapping("/clear-all-mock")
    @Transactional
    public ResponseEntity<?> clearAllMockAppointments() {
        // 1. Delete all vet reviews
        vetReviewRepository.deleteAll();

        // 2. Delete all medical records
        medicalRecordRepository.deleteAll();

        // 3. Delete all appointments
        appointmentRepository.deleteAll();

        // 4. Reset vet ratings to clean state
        List<Vet> vets = vetRepository.findAll();
        for (Vet vet : vets) {
            vet.setReviewsCount(0);
            vet.setRating(null);
        }
        vetRepository.saveAll(vets);

        return ResponseEntity.ok(Map.of("message", "All mock appointments and associated records removed successfully"));
    }
}
