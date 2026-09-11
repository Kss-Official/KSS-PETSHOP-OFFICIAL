package com.pawfectly.backend.scheduler;

import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.NotificationPreference;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.NotificationPreferenceRepository;
import com.pawfectly.backend.repository.NotificationRepository;
import com.pawfectly.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void processUpcomingAppointmentReminders() {
        log.info("Running scheduled job for appointment reminders...");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startWindow = now.plusHours(23);
        LocalDateTime endWindow = now.plusHours(25);

        List<Appointment> upcomingAppointments = appointmentRepository.findUpcomingAppointmentsByStatusAndRange(
                AppointmentStatus.CONFIRMED, startWindow, endWindow);

        for (Appointment apt : upcomingAppointments) {
            if (apt.getPet() == null || apt.getPet().getOwner() == null) continue;
            User owner = apt.getPet().getOwner();

            NotificationPreference pref = preferenceRepository.findByUserId(owner.getId())
                    .orElse(null);
            boolean reminderEnabled = pref == null || Boolean.TRUE.equals(pref.getAppointmentReminders());
            if (!reminderEnabled) {
                log.info("Skipping appointment reminder for user {} - appointmentReminders preference is OFF", owner.getId());
                continue;
            }

            boolean alreadySent = notificationRepository.existsByCustomerIdAndTypeAndRelatedEntityId(
                    owner.getId(), "APPOINTMENT_REMINDER", apt.getId());
            if (alreadySent) {
                continue;
            }

            String vetName = apt.getVet() != null ? apt.getVet().getName() : "your vet";
            String petName = apt.getPet() != null ? apt.getPet().getName() : "your pet";
            String title = "Upcoming Appointment Reminder";
            String message = String.format("Reminder: %s has an appointment with %s tomorrow.", petName, vetName);

            notificationService.createAppointmentNotification(
                    owner, "APPOINTMENT_REMINDER", title, message, apt.getId());
            log.info("Sent APPOINTMENT_REMINDER notification to user {} for appointment {}", owner.getId(), apt.getId());
        }
    }
}
