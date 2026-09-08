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
import java.util.ArrayList;
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

    @Transactional(readOnly = true)
    public List<AppointmentDto> getCustomerAppointments(Long customerId) {
        List<Pet> customerPets = petRepository.findByOwnerId(customerId);
        List<Appointment> allAppointments = new ArrayList<>();

        for (Pet pet : customerPets) {
            allAppointments.addAll(appointmentRepository.findByPetId(pet.getId()));
        }

        return allAppointments.stream()
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
        return mapToDto(saved);
    }

    @Transactional
    public AppointmentDto updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        appointment.setStatus(newStatus);
        Appointment saved = appointmentRepository.save(appointment);
        log.info("Updated appointment {} status to {}", appointmentId, newStatus);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAllAppointmentsAdmin() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AppointmentDto mapToDto(Appointment appointment) {
        Optional<MedicalRecord> record = medicalRecordRepository.findByAppointmentId(appointment.getId());

        return AppointmentDto.builder()
                .id(appointment.getId())
                .petId(appointment.getPet().getId())
                .petName(appointment.getPet().getName())
                .petSpecies(appointment.getPet().getSpecies())
                .vetId(appointment.getVet().getId())
                .vetName(appointment.getVet().getName())
                .vetSpecialization(appointment.getVet().getSpecialization())
                .vetAddress(appointment.getVet().getAddress())
                .serviceId(appointment.getService().getId())
                .serviceName(appointment.getService().getName())
                .dateTime(appointment.getDateTime())
                .status(appointment.getStatus())
                .createdAt(appointment.getCreatedAt())
                .diagnosis(record.map(MedicalRecord::getDiagnosis).orElse(null))
                .prescription(record.map(MedicalRecord::getPrescription).orElse(null))
                .notes(record.map(MedicalRecord::getNotes).orElse(null))
                .build();
    }
}
