package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.AppointmentDto;
import com.pawfectly.backend.dto.BookAppointmentRequest;
import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;
    private final VetRepository vetRepository;
    private final ServiceRepository serviceRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<AppointmentDto> getCustomerAppointments(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDto bookAppointment(Long customerId, BookAppointmentRequest request) {
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + request.getPetId()));

        if (!pet.getOwner().getId().equals(customerId)) {
            throw new AccessDeniedException("You can only book appointments for your own pets.");
        }

        Vet vet = vetRepository.findById(request.getVetId())
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with id: " + request.getVetId()));

        if (!vet.getIsActive()) {
            throw new BadRequestException("This vet is currently inactive.");
        }

        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        LocalDateTime normalizedDateTime = request.getDateTime().withSecond(0).withNano(0);
        Optional<Appointment> conflicting = appointmentRepository.findByVetIdAndDateTime(request.getVetId(), normalizedDateTime);
        if (conflicting.isPresent() && conflicting.get().getStatus() != AppointmentStatus.CANCELLED) {
            throw new BadRequestException("This time slot is already booked for this veterinarian. Please choose another time.");
        }

        Appointment appointment = Appointment.builder()
                .pet(pet)
                .vet(vet)
                .service(service)
                .dateTime(normalizedDateTime)
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.saveAndFlush(appointment);
        log.info("Booked appointment id {} for pet id {} and vet id {}", saved.getId(), pet.getId(), vet.getId());
        return mapToDto(saved);
    }

    @Transactional
    public AppointmentDto cancelAppointment(Long appointmentId, Long customerId, boolean isAdmin) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        if (!isAdmin && !appointment.getPet().getOwner().getId().equals(customerId)) {
            throw new AccessDeniedException("You can only cancel your own appointments.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Cancelled appointment id: {}", appointmentId);

        if (saved.getPet() != null && saved.getPet().getOwner() != null) {
            notificationService.createAppointmentNotification(
                    saved.getPet().getOwner(),
                    "APPOINTMENT_REJECTED",
                    "Appointment Cancelled",
                    "Your appointment for " + saved.getPet().getName() + " with Dr. " + (saved.getVet() != null ? saved.getVet().getName() : "") + " has been cancelled.",
                    saved.getId()
            );
        }

        return mapToDto(saved);
    }

    @Transactional
    public AppointmentDto updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        appointment.setStatus(newStatus);
        if (newStatus == AppointmentStatus.COMPLETED) {
            appointment.setPaymentStatus("PAID");
        }
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Updated appointment {} status to {}", appointmentId, newStatus);

        if (saved.getPet() != null && saved.getPet().getOwner() != null) {
            if (newStatus == AppointmentStatus.CONFIRMED) {
                notificationService.createAppointmentNotification(
                        saved.getPet().getOwner(),
                        "APPOINTMENT_CONFIRMED",
                        "Appointment Confirmed!",
                        "Your appointment for " + saved.getPet().getName() + " with Dr. " + (saved.getVet() != null ? saved.getVet().getName() : "") + " has been confirmed.",
                        saved.getId()
                );
            } else if (newStatus == AppointmentStatus.CANCELLED) {
                notificationService.createAppointmentNotification(
                        saved.getPet().getOwner(),
                        "APPOINTMENT_REJECTED",
                        "Appointment Rejected/Cancelled",
                        "Your appointment for " + saved.getPet().getName() + " with Dr. " + (saved.getVet() != null ? saved.getVet().getName() : "") + " was cancelled or rejected.",
                        saved.getId()
                );
            }
        }

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAllAppointmentsAdmin() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDto updateAppointmentPaymentStatus(Long appointmentId, String newPaymentStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        String currentStatus = appointment.getPaymentStatus() != null ? appointment.getPaymentStatus().toUpperCase() : "UNPAID";

        // Terminal state enforcement: If currently PAID or FAILED, reject updates
        if ("PAID".equals(currentStatus) || "FAILED".equals(currentStatus)) {
            throw new BadRequestException("Payment status is in terminal state '" + currentStatus + "' and cannot be modified.");
        }

        String targetStatus = newPaymentStatus != null ? newPaymentStatus.toUpperCase() : "UNPAID";
        if (!"PAID".equals(targetStatus) && !"FAILED".equals(targetStatus) && !"UNPAID".equals(targetStatus)) {
            throw new BadRequestException("Invalid payment status '" + newPaymentStatus + "'. Allowed values: UNPAID, PAID, FAILED.");
        }

        appointment.setPaymentStatus(targetStatus);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Updated appointment {} payment status to {}", appointmentId, targetStatus);
        return mapToDto(saved);
    }

    private AppointmentDto mapToDto(Appointment appointment) {
        Optional<MedicalRecord> record = medicalRecordRepository.findByAppointmentId(appointment.getId());

        Pet pet = appointment.getPet();
        Vet vet = appointment.getVet();
        ServiceEntity service = appointment.getService();

        return AppointmentDto.builder()
                .id(appointment.getId())
                .petId(pet != null ? pet.getId() : null)
                .petName(pet != null ? pet.getName() : "Pet")
                .petSpecies(pet != null ? pet.getSpecies() : "Pet")
                .vetId(vet != null ? vet.getId() : null)
                .vetName(vet != null ? vet.getName() : "Veterinarian")
                .vetSpecialization(vet != null ? vet.getSpecialization() : "")
                .vetAddress(vet != null ? vet.getAddress() : "")
                .serviceId(service != null ? service.getId() : null)
                .serviceName(service != null ? service.getName() : "Consultation")
                .dateTime(appointment.getDateTime())
                .status(appointment.getStatus())
                .paymentStatus(appointment.getPaymentStatus() != null ? appointment.getPaymentStatus() : "UNPAID")
                .createdAt(appointment.getCreatedAt())
                .diagnosis(record.map(MedicalRecord::getDiagnosis).orElse(null))
                .prescription(record.map(MedicalRecord::getPrescription).orElse(null))
                .notes(record.map(MedicalRecord::getNotes).orElse(null))
                .build();
    }
}
