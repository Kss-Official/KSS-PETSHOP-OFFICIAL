package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.VetReviewDto;
import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.Vet;
import com.pawfectly.backend.entity.VetReview;
import org.springframework.security.access.AccessDeniedException;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.VetRepository;
import com.pawfectly.backend.repository.VetReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VetReviewService {

    private final VetReviewRepository vetReviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final VetRepository vetRepository;

    @Transactional
    public VetReviewDto createReview(Long customerId, VetReviewDto dto) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + dto.getAppointmentId()));

        // Ownership Check: Only owner of the appointment pet can review
        if (!appointment.getPet().getOwner().getId().equals(customerId)) {
            throw new AccessDeniedException("You can only review appointments for your own pets.");
        }

        // Status Check: Must be COMPLETED
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for completed appointments.");
        }

        // Uniqueness Check: Only 1 review per appointment
        if (vetReviewRepository.existsByAppointmentId(appointment.getId())) {
            throw new BadRequestException("A review has already been submitted for this appointment.");
        }

        Vet vet = appointment.getVet();

        VetReview review = VetReview.builder()
                .vet(vet)
                .customer(appointment.getPet().getOwner())
                .appointment(appointment)
                .rating(dto.getRating())
                .reviewText(dto.getReviewText())
                .build();

        VetReview saved = vetReviewRepository.save(review);

        // Recalculate computed average and count on Vet
        Double avgRating = vetReviewRepository.getAverageRatingForVet(vet.getId());
        Long reviewCount = vetReviewRepository.getReviewCountForVet(vet.getId());

        vet.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);
        vet.setReviewsCount(reviewCount != null ? reviewCount.intValue() : 0);
        vetRepository.save(vet);

        log.info("Saved review #{} for vet #{}, new rating: {}, count: {}", saved.getId(), vet.getId(), vet.getRating(), vet.getReviewsCount());

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<VetReviewDto> getReviewsForCustomer(Long customerId) {
        return vetReviewRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VetReviewDto> getReviewsForVet(Long vetId) {
        return vetReviewRepository.findByVetIdOrderByCreatedAtDesc(vetId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VetReviewDto getReviewForAppointment(Long appointmentId) {
        return vetReviewRepository.findByAppointmentId(appointmentId)
                .map(this::mapToDto)
                .orElse(null);
    }

    private VetReviewDto mapToDto(VetReview review) {
        String fullName = review.getCustomer() != null ? review.getCustomer().getName() : "Anonymous";
        String displayName = formatCustomerDisplayName(fullName);

        return VetReviewDto.builder()
                .id(review.getId())
                .appointmentId(review.getAppointment() != null ? review.getAppointment().getId() : null)
                .vetId(review.getVet() != null ? review.getVet().getId() : null)
                .vetName(review.getVet() != null ? review.getVet().getName() : "Veterinarian")
                .customerId(review.getCustomer() != null ? review.getCustomer().getId() : null)
                .customerName(displayName)
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private String formatCustomerDisplayName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Anonymous";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        return parts[0] + " " + parts[parts.length - 1].substring(0, 1).toUpperCase() + ".";
    }
}
