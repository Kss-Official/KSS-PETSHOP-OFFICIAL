package com.pawfectly.backend.scheduler;

import com.pawfectly.backend.dto.NotificationDto;
import com.pawfectly.backend.dto.NotificationPreferenceDto;
import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.repository.*;
import com.pawfectly.backend.service.CustomerPreferenceService;
import com.pawfectly.backend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AppointmentReminderSchedulerTest {

    @Autowired
    private AppointmentReminderScheduler scheduler;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private VetRepository vetRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CustomerPreferenceService preferenceService;

    private User customer;
    private Appointment upcomingApt;

    @BeforeEach
    void setUp() {
        customer = userRepository.save(User.builder()
                .name("Reminder Test Customer")
                .email("reminder_cust_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build());

        Pet pet = petRepository.save(Pet.builder()
                .name("Buddy")
                .species("Dog")
                .breed("Golden Retriever")
                .age(3)
                .owner(customer)
                .build());

        Vet vet = vetRepository.save(Vet.builder()
                .name("Dr. Smith")
                .specialization("General Health")
                .city("New York")
                .build());

        ServiceEntity service = serviceRepository.save(ServiceEntity.builder()
                .name("General Checkup")
                .description("Routine checkup")
                .build());

        upcomingApt = appointmentRepository.save(Appointment.builder()
                .pet(pet)
                .vet(vet)
                .service(service)
                .dateTime(LocalDateTime.now().plusHours(24))
                .status(AppointmentStatus.CONFIRMED)
                .paymentStatus("UNPAID")
                .build());
    }

    @Test
    @DisplayName("Scheduled Reminder: Creates notification when appointmentReminders preference is ON")
    void processUpcomingAppointmentReminders_Enabled() {
        preferenceService.updatePreferences(customer.getId(), NotificationPreferenceDto.builder()
                .appointmentReminders(true)
                .build());

        scheduler.processUpcomingAppointmentReminders();

        List<NotificationDto> notifs = notificationService.getCustomerNotifications(customer.getId());
        assertEquals(1, notifs.size());
        assertEquals("APPOINTMENT_REMINDER", notifs.get(0).getType());
        assertEquals(upcomingApt.getId(), notifs.get(0).getRelatedEntityId());
    }

    @Test
    @DisplayName("Scheduled Reminder: Skips notification when appointmentReminders preference is OFF")
    void processUpcomingAppointmentReminders_Disabled() {
        preferenceService.updatePreferences(customer.getId(), NotificationPreferenceDto.builder()
                .appointmentReminders(false)
                .build());

        scheduler.processUpcomingAppointmentReminders();

        List<NotificationDto> notifs = notificationService.getCustomerNotifications(customer.getId());
        assertTrue(notifs.isEmpty());
    }

    @Test
    @DisplayName("Scheduled Reminder: Idempotent - running twice does not duplicate notification")
    void processUpcomingAppointmentReminders_Idempotent() {
        preferenceService.updatePreferences(customer.getId(), NotificationPreferenceDto.builder()
                .appointmentReminders(true)
                .build());

        scheduler.processUpcomingAppointmentReminders();
        scheduler.processUpcomingAppointmentReminders();

        List<NotificationDto> notifs = notificationService.getCustomerNotifications(customer.getId());
        assertEquals(1, notifs.size());
    }
}
