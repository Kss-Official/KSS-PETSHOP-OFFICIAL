package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.entity.OrderItem;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.OrderItemRepository;
import com.pawfectly.backend.repository.OrderRepository;
import com.pawfectly.backend.repository.ProductRepository;
import com.pawfectly.backend.repository.UserRepository;
import com.pawfectly.backend.repository.VetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/v1/admin/dashboard", "/api/admin/dashboard"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final OrderRepository orderRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final VetRepository vetRepository;
    private final ProductRepository productRepository;

    public AdminDashboardController(
            OrderRepository orderRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            OrderItemRepository orderItemRepository,
            VetRepository vetRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
        this.vetRepository = vetRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        LocalDateTime startOfMonth = LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);

        long totalOrdersThisMonth = orderRepository.countOrdersSince(startOfMonth);
        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        
        BigDecimal orderRevenueThisMonth = orderRepository.sumRevenueSince(startOfMonth);
        Double apptRevenueThisMonth = appointmentRepository.sumCompletedAppointmentRevenueSince(startOfMonth);
        BigDecimal totalRevenueThisMonth = (orderRevenueThisMonth != null ? orderRevenueThisMonth : BigDecimal.ZERO)
                .add(BigDecimal.valueOf(apptRevenueThisMonth != null ? apptRevenueThisMonth : 0.0));

        long activeVets = vetRepository.countByIsActive(true);
        long inactiveVets = vetRepository.countByIsActive(false);

        List<Product> lowStock = productRepository.findLowStockProducts();
        List<Map<String, Object>> lowStockList = lowStock.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("category", p.getCategory());
            map.put("stockQuantity", p.getStockQuantity());
            map.put("price", p.getPrice());
            map.put("imageUrl", p.getImageUrl());
            map.put("isActive", p.getIsActive());
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrdersThisMonth", totalOrdersThisMonth);
        stats.put("pendingAppointments", pendingAppointments);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalRevenueThisMonth", totalRevenueThisMonth);
        stats.put("activeVetsCount", activeVets);
        stats.put("inactiveVetsCount", inactiveVets);
        stats.put("totalVetsCount", activeVets + inactiveVets);
        stats.put("lowStockCount", lowStock.size());
        stats.put("lowStockProducts", lowStockList);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue() {
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        YearMonth currentYearMonth = YearMonth.now();
        DateTimeFormatter shortMonthFormatter = DateTimeFormatter.ofPattern("MMM");
        DateTimeFormatter fullMonthFormatter = DateTimeFormatter.ofPattern("MMMM yyyy");

        // Last 6 months (5 months ago up to current month)
        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentYearMonth.minusMonths(i);
            LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime end = targetMonth.plusMonths(1).atDay(1).atStartOfDay();

            List<Order> paidOrders = orderRepository.findPaidOrdersBetween(start, end);
            BigDecimal orderRev = paidOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<Appointment> completedAppts = appointmentRepository.findCompletedAppointmentsBetween(start, end);
            BigDecimal apptRev = completedAppts.stream()
                    .map(a -> BigDecimal.valueOf(a.getVet() != null && a.getVet().getConsultationFee() != null ? a.getVet().getConsultationFee() : 50.0))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRev = orderRev.add(apptRev);

            Map<String, Object> monthMap = new HashMap<>();
            monthMap.put("month", targetMonth.format(shortMonthFormatter));
            monthMap.put("fullMonth", targetMonth.format(fullMonthFormatter));
            monthMap.put("orderRevenue", orderRev);
            monthMap.put("appointmentRevenue", apptRev);
            monthMap.put("totalRevenue", totalRev);
            monthMap.put("orderCount", paidOrders.size());
            monthMap.put("appointmentCount", completedAppts.size());

            monthlyData.add(monthMap);
        }

        return ResponseEntity.ok(monthlyData);
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<?> getRecentOrders() {
        List<Map<String, Object>> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(8)
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    String itemName = "General Order";
                    if (!items.isEmpty() && items.get(0).getProduct() != null) {
                        itemName = items.get(0).getProduct().getName();
                    }
                    int totalUnits = items.stream().mapToInt(OrderItem::getQuantity).sum();

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", order.getId());
                    map.put("customerName", order.getCustomer() != null ? order.getCustomer().getName() : "Guest");
                    map.put("customerEmail", order.getCustomer() != null ? order.getCustomer().getEmail() : "");
                    map.put("totalAmount", order.getTotalAmount());
                    map.put("orderStatus", order.getOrderStatus().name());
                    map.put("paymentStatus", order.getPaymentStatus().name());
                    map.put("createdAt", order.getCreatedAt());
                    map.put("itemName", itemName);
                    map.put("itemCount", totalUnits > 0 ? totalUnits : items.size());
                    map.put("lineItemCount", items.size());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(recentOrders);
    }

    @GetMapping("/recent-appointments")
    public ResponseEntity<?> getRecentAppointments() {
        List<Map<String, Object>> recentAppointments = appointmentRepository.findAllByOrderByDateTimeDesc()
                .stream()
                .limit(8)
                .map(apt -> {
                    Double fee = apt.getVet() != null && apt.getVet().getConsultationFee() != null ? apt.getVet().getConsultationFee() : 50.0;
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", apt.getId());
                    map.put("petName", apt.getPet() != null ? apt.getPet().getName() : "Unknown");
                    map.put("petSpecies", apt.getPet() != null ? apt.getPet().getSpecies() : "Pet");
                    map.put("ownerName", apt.getPet() != null && apt.getPet().getOwner() != null ? apt.getPet().getOwner().getName() : "Unknown");
                    map.put("customerName", apt.getPet() != null && apt.getPet().getOwner() != null ? apt.getPet().getOwner().getName() : "Unknown");
                    map.put("vetName", apt.getVet() != null ? apt.getVet().getName() : "General Vet");
                    map.put("serviceName", apt.getService() != null ? apt.getService().getName() : "Consultation");
                    map.put("dateTime", apt.getDateTime());
                    map.put("status", apt.getStatus().name());
                    map.put("fee", fee);
                    map.put("amount", fee);
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(recentAppointments);
    }
}
