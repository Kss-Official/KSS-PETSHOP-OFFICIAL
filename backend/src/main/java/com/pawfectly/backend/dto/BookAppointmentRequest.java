package com.pawfectly.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookAppointmentRequest {
    @NotNull(message = "Pet ID is required")
    private Long petId;

    @NotNull(message = "Vet ID is required")
    private Long vetId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Date and time is required")
    @Future(message = "Appointment date and time must be in the future")
    private LocalDateTime dateTime;
}
