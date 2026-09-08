package com.pawfectly.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {
    private long totalUsers;
    private long totalPets;
    private long totalVets;
    private long totalProducts;
    private long totalOrders;
    private long totalAppointments;
    private long totalArticles;
    private long totalSubscribers;
    private BigDecimal totalRevenue;
}
