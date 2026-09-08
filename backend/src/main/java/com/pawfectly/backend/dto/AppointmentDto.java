package com.pawfectly.backend.dto;

import com.pawfectly.backend.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long petId;
    private String petName;
    private String petSpecies;
    private Long vetId;
    private String vetName;
    private String vetSpecialization;
    private String vetAddress;
    private Long serviceId;
    private String serviceName;
    private LocalDateTime dateTime;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private String diagnosis;
    private String prescription;
    private String notes;
}
