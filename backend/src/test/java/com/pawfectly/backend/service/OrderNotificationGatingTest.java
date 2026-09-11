package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationDto;
import com.pawfectly.backend.dto.NotificationPreferenceDto;
import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.repository.OrderRepository;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class OrderNotificationGatingTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerPreferenceService preferenceService;

    @Autowired
    private NotificationService notificationService;

    private User customer;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        customer = userRepository.save(User.builder()
                .name("Order Gate Customer")
                .email("order_gate_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build());

        testOrder = orderRepository.save(Order.builder()
                .customer(customer)
                .totalAmount(BigDecimal.valueOf(99.99))
                .orderStatus(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PAID)
                .build());
    }

    @Test
    @DisplayName("Order Status Update: Sends notification when orderUpdates preference is ON")
    void updateOrderStatus_CreatesNotificationWhenEnabled() {
        preferenceService.updatePreferences(customer.getId(), NotificationPreferenceDto.builder()
                .orderUpdates(true)
                .build());

        orderService.updateOrderStatus(testOrder.getId(), OrderStatus.READY_FOR_PICKUP);

        List<NotificationDto> notifs = notificationService.getCustomerNotifications(customer.getId());
        assertEquals(1, notifs.size());
        assertEquals("ORDER_STATUS_UPDATE", notifs.get(0).getType());
        assertEquals(testOrder.getId(), notifs.get(0).getRelatedEntityId());
        assertTrue(notifs.get(0).getMessage().contains("READY_FOR_PICKUP"));
    }

    @Test
    @DisplayName("Order Status Update: Skips notification when orderUpdates preference is OFF")
    void updateOrderStatus_SkipsNotificationWhenDisabled() {
        preferenceService.updatePreferences(customer.getId(), NotificationPreferenceDto.builder()
                .orderUpdates(false)
                .build());

        orderService.updateOrderStatus(testOrder.getId(), OrderStatus.READY_FOR_PICKUP);

        List<NotificationDto> notifs = notificationService.getCustomerNotifications(customer.getId());
        assertTrue(notifs.isEmpty());
    }
}
