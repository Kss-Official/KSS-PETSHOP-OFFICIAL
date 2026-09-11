package com.pawfectly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDto {
    private Boolean newsletter;
    private Boolean appointmentReminders;
    private Boolean orderUpdates;
    private Boolean healthAlerts;
}
