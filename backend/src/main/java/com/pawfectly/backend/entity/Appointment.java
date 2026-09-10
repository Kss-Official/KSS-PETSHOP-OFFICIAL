package com.pawfectly.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_appointments_vet_datetime", columnNames = {"vet_id", "date_time"})
    },
    indexes = {
        @Index(name = "idx_appointments_pet_id", columnList = "pet_id"),
        @Index(name = "idx_appointments_vet_id", columnList = "vet_id"),
        @Index(name = "idx_appointments_service_id", columnList = "service_id")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_appointments_pet"))
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_appointments_vet"))
    private Vet vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false, foreignKey = @ForeignKey(name = "fk_appointments_service"))
    private ServiceEntity service;

    @NotNull
    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Builder.Default
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus = "UNPAID";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
