package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationDto;
import com.pawfectly.backend.entity.Notification;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.entity.Vet;
import org.springframework.security.access.AccessDeniedException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.NotificationRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> getCustomerNotifications(Long customerId) {
        return notificationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long customerId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        // Ownership check
        if (!notification.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("Access denied to notification.");
        }

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteNotification(Long customerId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        // Ownership check
        if (!notification.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("Access denied to notification.");
        }

        notificationRepository.delete(notification);
        log.info("Deleted notification #{} for user #{}", notificationId, customerId);
    }

    @Transactional
    public int createAnnouncement(String title, String message) {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        if (customers.isEmpty()) {
            log.info("No customers found for announcement fan-out.");
            return 0;
        }

        List<Notification> notifications = customers.stream()
                .map(customer -> Notification.builder()
                        .customer(customer)
                        .type("ANNOUNCEMENT")
                        .title(title)
                        .message(message)
                        .isRead(false)
                        .build())
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
        log.info("Fanned out announcement '{}' to {} existing customers", title, notifications.size());
        return notifications.size();
    }

    @Transactional
    public void createAppointmentNotification(User customer, String type, String title, String message, Long appointmentId) {
        if (customer == null) return;

        Notification notification = Notification.builder()
                .customer(customer)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(appointmentId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        log.info("Created appointment notification '{}' for customer #{}", type, customer.getId());
    }

    @Transactional
    public void createNewVetNotification(Vet vet) {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        if (customers.isEmpty()) return;

        String title = "New Veterinarian Joined!";
        String message = vet.getName() + " (" + vet.getSpecialization() + ") is now available for consultations. Book an appointment today!";

        List<Notification> notifications = customers.stream()
                .map(customer -> Notification.builder()
                        .customer(customer)
                        .type("NEW_VET")
                        .title(title)
                        .message(message)
                        .relatedEntityId(vet.getId())
                        .isRead(false)
                        .build())
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
        log.info("Created NEW_VET notification for vet #{} to {} customers", vet.getId(), notifications.size());
    }

    private NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .customerId(n.getCustomer().getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .relatedEntityId(n.getRelatedEntityId())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
