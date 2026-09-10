package com.pawfectly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long customerId;
    private String type; // ANNOUNCEMENT, APPOINTMENT_CONFIRMED, APPOINTMENT_REJECTED, NEW_VET
    private String title;
    private String message;
    private Long relatedEntityId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
