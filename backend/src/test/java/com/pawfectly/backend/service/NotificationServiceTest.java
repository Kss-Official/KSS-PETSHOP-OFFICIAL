package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationDto;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    private User customerA;
    private User customerB;

    @BeforeEach
    void setUp() {
        customerA = userRepository.save(User.builder()
                .name("Notification Customer A")
                .email("notif_a_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build());

        customerB = userRepository.save(User.builder()
                .name("Notification Customer B")
                .email("notif_b_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543211")
                .build());
    }

    @Test
    @DisplayName("Announcement Fan-Out: Only reaches customers existing at creation time")
    void createAnnouncement_SnapshotFanOut() {
        // 1. Create announcement for currently existing customers (customerA and customerB)
        int recipientCount = notificationService.createAnnouncement("Vaccination Drive", "Free rabies vaccination this Sunday.");
        assertTrue(recipientCount >= 2);

        // 2. Register a NEW customer AFTER announcement was created
        User customerC = userRepository.save(User.builder()
                .name("Notification Customer C")
                .email("notif_c_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543212")
                .build());

        // 3. Verify Customer A received the announcement
        List<NotificationDto> aNotifs = notificationService.getCustomerNotifications(customerA.getId());
        assertTrue(aNotifs.stream().anyMatch(n -> "Vaccination Drive".equals(n.getTitle())));

        // 4. Verify Customer C (who joined AFTER announcement) did NOT receive the announcement
        List<NotificationDto> cNotifs = notificationService.getCustomerNotifications(customerC.getId());
        assertFalse(cNotifs.stream().anyMatch(n -> "Vaccination Drive".equals(n.getTitle())));
    }

    @Test
    @DisplayName("Ownership Isolation: Customer cannot mark or delete another customer's notification")
    void notification_OwnershipEnforcement() {
        notificationService.createAppointmentNotification(customerA, "APPOINTMENT_CONFIRMED", "Confirmed", "Your visit is set", 100L);

        List<NotificationDto> aNotifs = notificationService.getCustomerNotifications(customerA.getId());
        assertFalse(aNotifs.isEmpty());
        Long notifId = aNotifs.get(0).getId();

        // Customer B attempts to mark Customer A's notification as read -> Throws AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> notificationService.markAsRead(customerB.getId(), notifId));

        // Customer B attempts to delete Customer A's notification -> Throws AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> notificationService.deleteNotification(customerB.getId(), notifId));

        // Customer A marks as read successfully
        NotificationDto updated = notificationService.markAsRead(customerA.getId(), notifId);
        assertTrue(updated.getIsRead());

        // Customer A deletes notification successfully
        notificationService.deleteNotification(customerA.getId(), notifId);
        List<NotificationDto> aNotifsAfter = notificationService.getCustomerNotifications(customerA.getId());
        assertTrue(aNotifsAfter.stream().noneMatch(n -> n.getId().equals(notifId)));
    }
}
