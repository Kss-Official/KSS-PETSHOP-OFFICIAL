package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NotificationPreferenceDto;
import com.pawfectly.backend.entity.NewsletterSubscriber;
import com.pawfectly.backend.entity.NotificationPreference;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.NewsletterSubscriberRepository;
import com.pawfectly.backend.repository.NotificationPreferenceRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final NewsletterSubscriberRepository subscriberRepository;

    @Transactional(readOnly = true)
    public NotificationPreferenceDto getPreferences(Long customerId) {
        NotificationPreference pref = preferenceRepository.findByUserId(customerId)
                .orElseGet(() -> createDefaultPreference(customerId));
        return mapToDto(pref);
    }

    @Transactional
    public NotificationPreferenceDto updatePreferences(Long customerId, NotificationPreferenceDto dto) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + customerId));

        NotificationPreference pref = preferenceRepository.findByUserId(customerId)
                .orElseGet(() -> createDefaultPreference(customerId));

        if (dto.getNewsletter() != null && !dto.getNewsletter().equals(pref.getNewsletter())) {
            boolean newStatus = dto.getNewsletter();
            pref.setNewsletter(newStatus);
            syncNewsletterSubscriber(user.getEmail(), newStatus);
        }

        if (dto.getAppointmentReminders() != null) {
            pref.setAppointmentReminders(dto.getAppointmentReminders());
        }
        if (dto.getOrderUpdates() != null) {
            pref.setOrderUpdates(dto.getOrderUpdates());
        }
        if (dto.getHealthAlerts() != null) {
            pref.setHealthAlerts(dto.getHealthAlerts());
        }

        NotificationPreference saved = preferenceRepository.save(pref);
        log.info("Updated notification preferences for customer {}", customerId);
        return mapToDto(saved);
    }

    @Transactional
    public NotificationPreference createDefaultPreference(Long customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + customerId));

        NotificationPreference newPref = NotificationPreference.builder()
                .user(user)
                .newsletter(true)
                .appointmentReminders(true)
                .orderUpdates(true)
                .healthAlerts(true)
                .build();

        syncNewsletterSubscriber(user.getEmail(), true);
        return preferenceRepository.save(newPref);
    }

    private void syncNewsletterSubscriber(String rawEmail, boolean subscribe) {
        if (rawEmail == null || rawEmail.isBlank()) return;
        String email = rawEmail.toLowerCase().trim();
        if (subscribe) {
            if (!subscriberRepository.existsByEmail(email)) {
                NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                        .email(email)
                        .build();
                subscriberRepository.save(subscriber);
                log.info("Synced email {} to newsletter_subscribers via preference toggle", email);
            }
        } else {
            subscriberRepository.findByEmail(email).ifPresent(subscriber -> {
                subscriberRepository.delete(subscriber);
                log.info("Removed email {} from newsletter_subscribers via preference toggle", email);
            });
        }
    }

    public NotificationPreferenceDto mapToDto(NotificationPreference pref) {
        return NotificationPreferenceDto.builder()
                .newsletter(pref.getNewsletter())
                .appointmentReminders(pref.getAppointmentReminders())
                .orderUpdates(pref.getOrderUpdates())
                .healthAlerts(pref.getHealthAlerts())
                .build();
    }
}
