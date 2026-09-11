package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationDto;
import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.Notification;
import com.pawfectly.backend.entity.NotificationPreference;
import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.entity.Pet;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.entity.Vet;
import org.springframework.security.access.AccessDeniedException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.NotificationPreferenceRepository;
import com.pawfectly.backend.repository.NotificationRepository;
import com.pawfectly.backend.repository.OrderRepository;
import com.pawfectly.backend.repository.PetRepository;
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
    private final OrderRepository orderRepository;
    private final PetRepository petRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    @Transactional
    public List<NotificationDto> getCustomerNotifications(Long customerId) {
        syncMissingOrderNotifications(customerId);
        syncMissingAppointmentNotifications(customerId);
        return notificationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void syncMissingOrderNotifications(Long customerId) {
        try {
            User customer = userRepository.findById(customerId).orElse(null);
            if (customer == null) return;

            NotificationPreference pref = notificationPreferenceRepository.findByUserId(customerId).orElse(null);
            boolean orderUpdatesEnabled = pref == null || Boolean.TRUE.equals(pref.getOrderUpdates());
            if (!orderUpdatesEnabled) return;

            List<Order> customerOrders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
            for (Order order : customerOrders) {
                boolean exists = notificationRepository.existsByCustomerIdAndRelatedEntityId(customerId, order.getId());
                if (!exists) {
                    String orderRef = String.format("ORD-%04d", order.getId());
                    String statusFormatted = order.getOrderStatus().name().replace("_", " ");
                    String title = "Order " + statusFormatted;
                    String message = "Your order " + orderRef + " is currently " + statusFormatted + ".";

                    Notification notification = Notification.builder()
                            .customer(customer)
                            .type("ORDER_STATUS_UPDATE")
                            .title(title)
                            .message(message)
                            .relatedEntityId(order.getId())
                            .isRead(false)
                            .build();
                    notificationRepository.save(notification);
                    log.info("Synced missing notification for order #{} (customer #{})", order.getId(), customerId);
                }
            }
        } catch (Exception e) {
            log.warn("Error syncing order notifications for customer #{}: {}", customerId, e.getMessage());
        }
    }

    private void syncMissingAppointmentNotifications(Long customerId) {
        try {
            User customer = userRepository.findById(customerId).orElse(null);
            if (customer == null) return;

            NotificationPreference pref = notificationPreferenceRepository.findByUserId(customerId).orElse(null);
            boolean apptRemindersEnabled = pref == null || Boolean.TRUE.equals(pref.getAppointmentReminders());
            if (!apptRemindersEnabled) return;

            List<Pet> pets = petRepository.findByOwnerId(customerId);
            for (Pet pet : pets) {
                List<Appointment> appts = appointmentRepository.findByPetId(pet.getId());
                for (Appointment appt : appts) {
                    boolean exists = notificationRepository.existsByCustomerIdAndRelatedEntityId(customerId, appt.getId());
                    if (!exists) {
                        String vetName = appt.getVet() != null ? appt.getVet().getName() : "Veterinarian";
                        String petName = pet.getName();
                        String statusFormatted = appt.getStatus().name();
                        String title = appt.getStatus() == AppointmentStatus.CONFIRMED ? "Appointment Confirmed!" : ("Appointment " + statusFormatted);
                        String message = "Your appointment for " + petName + " with " + vetName + " is " + statusFormatted.toLowerCase() + ".";

                        Notification notification = Notification.builder()
                                .customer(customer)
                                .type(appt.getStatus() == AppointmentStatus.CONFIRMED ? "APPOINTMENT_CONFIRMED" : "APPOINTMENT_UPDATE")
                                .title(title)
                                .message(message)
                                .relatedEntityId(appt.getId())
                                .isRead(false)
                                .build();
                        notificationRepository.save(notification);
                        log.info("Synced missing notification for appointment #{} (customer #{})", appt.getId(), customerId);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error syncing appointment notifications for customer #{}: {}", customerId, e.getMessage());
        }
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
    public void createCustomerNotification(User customer, String type, String title, String message, Long relatedEntityId) {
        if (customer == null) return;

        Notification notification = Notification.builder()
                .customer(customer)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        log.info("Created notification '{}' for customer #{}", type, customer.getId());
    }

    @Transactional
    public void createAppointmentNotification(User customer, String type, String title, String message, Long appointmentId) {
        createCustomerNotification(customer, type, title, message, appointmentId);
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
