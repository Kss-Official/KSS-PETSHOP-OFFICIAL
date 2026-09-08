package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.AdminDashboardStatsDto;
import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.MedicalRecord;
import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final VetRepository vetRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AppointmentRepository appointmentRepository;
    private final ArticleRepository articleRepository;
    private final NewsletterSubscriberRepository subscriberRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalPets = petRepository.count();
        long totalVets = vetRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalArticles = articleRepository.count();
        long totalSubscribers = subscriberRepository.count();

        BigDecimal revenue = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalPets(totalPets)
                .totalVets(totalVets)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalAppointments(totalAppointments)
                .totalArticles(totalArticles)
                .totalSubscribers(totalSubscribers)
                .totalRevenue(revenue)
                .build();
    }

    @Transactional
    public MedicalRecord saveMedicalRecord(Long appointmentId, String diagnosis, String prescription, String notes) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + appointmentId));

        Optional<MedicalRecord> existing = medicalRecordRepository.findByAppointmentId(appointmentId);
        MedicalRecord record;

        if (existing.isPresent()) {
            record = existing.get();
            record.setDiagnosis(diagnosis);
            record.setPrescription(prescription);
            record.setNotes(notes);
        } else {
            record = MedicalRecord.builder()
                    .appointment(appointment)
                    .diagnosis(diagnosis)
                    .prescription(prescription)
                    .notes(notes)
                    .build();
        }

        return medicalRecordRepository.save(record);
    }
}
