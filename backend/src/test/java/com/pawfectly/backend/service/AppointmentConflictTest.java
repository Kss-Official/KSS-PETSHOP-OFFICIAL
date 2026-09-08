package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.BookAppointmentRequest;
import com.pawfectly.backend.entity.Pet;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.repository.PetRepository;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AppointmentConflictTest {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    private User testUser;
    private Pet testPet;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .name("Appointment Tester")
                .email("apt_tester_" + System.currentTimeMillis() + "@pawfectly.test")
                .password("password123")
                .role(Role.CUSTOMER)
                .build());

        testPet = petRepository.save(Pet.builder()
                .name("Oscar")
                .species("Dog")
                .breed("Shih Tzu")
                .age(3)
                .owner(testUser)
                .build());
    }

    @Test
    @DisplayName("Business Logic: Booking the same vet slot twice is rejected with conflict error")
    void duplicateAppointment_ThrowsBadRequestException() {
        LocalDateTime appointmentDateTime = LocalDateTime.now().plusDays(20 + (long)(Math.random() * 500)).withHour(14).withMinute(0).withSecond(0).withNano(0);

        BookAppointmentRequest request = BookAppointmentRequest.builder()
                .petId(testPet.getId())
                .vetId(1L)
                .serviceId(1L)
                .dateTime(appointmentDateTime)
                .build();

        // 1. First booking succeeds
        assertDoesNotThrow(() -> appointmentService.bookAppointment(testUser.getId(), request));

        // 2. Second booking for the exact same vet + date + time MUST throw BadRequestException
        BadRequestException exception = assertThrows(BadRequestException.class, () ->
                appointmentService.bookAppointment(testUser.getId(), request)
        );

        assertTrue(exception.getMessage().contains("already booked") || exception.getMessage().contains("unavailable"));
    }
}
