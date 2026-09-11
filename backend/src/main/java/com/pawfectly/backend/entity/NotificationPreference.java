package com.pawfectly.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_preferences", indexes = {
    @Index(name = "idx_notification_preferences_user_id", columnList = "user_id")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true, foreignKey = @ForeignKey(name = "fk_notification_preferences_user"))
    private User user;

    @Builder.Default
    @Column(name = "newsletter", nullable = false)
    private Boolean newsletter = true;

    @Builder.Default
    @Column(name = "appointment_reminders", nullable = false)
    private Boolean appointmentReminders = true;

    @Builder.Default
    @Column(name = "order_updates", nullable = false)
    private Boolean orderUpdates = true;

    @Builder.Default
    @Column(name = "health_alerts", nullable = false)
    private Boolean healthAlerts = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
