package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationPreferenceDto;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.NewsletterSubscriberRepository;
import com.pawfectly.backend.repository.NotificationPreferenceRepository;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CustomerPreferenceServiceTest {

    @Autowired
    private CustomerPreferenceService preferenceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private NewsletterSubscriberRepository subscriberRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .name("Preference Test User")
                .email("pref_user_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build());
    }

    @Test
    @DisplayName("getPreferences: auto-creates default row with all toggles enabled")
    void getPreferences_CreatesDefaultRow() {
        NotificationPreferenceDto dto = preferenceService.getPreferences(testUser.getId());

        assertNotNull(dto);
        assertTrue(dto.getNewsletter());
        assertTrue(dto.getAppointmentReminders());
        assertTrue(dto.getOrderUpdates());
        assertTrue(dto.getHealthAlerts());
        assertTrue(preferenceRepository.existsByUserId(testUser.getId()));
    }

    @Test
    @DisplayName("updatePreferences: newsletter toggle syncs with newsletter_subscribers table")
    void updatePreferences_NewsletterSync() {
        String email = testUser.getEmail().toLowerCase();

        // Initially toggle ON
        preferenceService.updatePreferences(testUser.getId(), NotificationPreferenceDto.builder()
                .newsletter(true)
                .build());
        assertTrue(subscriberRepository.existsByEmail(email));

        // Toggle OFF -> removed from newsletter_subscribers
        preferenceService.updatePreferences(testUser.getId(), NotificationPreferenceDto.builder()
                .newsletter(false)
                .build());
        assertFalse(subscriberRepository.existsByEmail(email));

        // Toggle ON again -> re-added
        preferenceService.updatePreferences(testUser.getId(), NotificationPreferenceDto.builder()
                .newsletter(true)
                .build());
        assertTrue(subscriberRepository.existsByEmail(email));
    }

    @Test
    @DisplayName("updatePreferences: updates orderUpdates and appointmentReminders independently")
    void updatePreferences_OrderAndAppointmentToggles() {
        NotificationPreferenceDto updated = preferenceService.updatePreferences(testUser.getId(), NotificationPreferenceDto.builder()
                .appointmentReminders(false)
                .orderUpdates(false)
                .build());

        assertFalse(updated.getAppointmentReminders());
        assertFalse(updated.getOrderUpdates());
        assertTrue(updated.getNewsletter());
        assertTrue(updated.getHealthAlerts());
    }
}
