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
import org.springframework.data.domain.PageRequest;
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
import java.util.concurrent.CompletableFuture;
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

    @GetMapping({"", "/", "/summary"})
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        CompletableFuture<Map<String, Object>> statsFuture = CompletableFuture.supplyAsync(this::buildStatsMap);
        CompletableFuture<List<Map<String, Object>>> revenueFuture = CompletableFuture.supplyAsync(this::buildMonthlyRevenueList);
        CompletableFuture<List<Map<String, Object>>> ordersFuture = CompletableFuture.supplyAsync(this::buildRecentOrdersList);
        CompletableFuture<List<Map<String, Object>>> apptsFuture = CompletableFuture.supplyAsync(this::buildRecentAppointmentsList);

        CompletableFuture.allOf(statsFuture, revenueFuture, ordersFuture, apptsFuture).join();

        Map<String, Object> response = new HashMap<>();
        response.put("stats", statsFuture.join());
        response.put("monthlyRevenue", revenueFuture.join());
        response.put("recentOrders", ordersFuture.join());
        response.put("recentAppointments", apptsFuture.join());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(buildStatsMap());
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue() {
        return ResponseEntity.ok(buildMonthlyRevenueList());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<Map<String, Object>>> getRecentOrders() {
        return ResponseEntity.ok(buildRecentOrdersList());
    }

    @GetMapping("/recent-appointments")
    public ResponseEntity<List<Map<String, Object>>> getRecentAppointments() {
        return ResponseEntity.ok(buildRecentAppointmentsList());
    }

    private Map<String, Object> buildStatsMap() {
        LocalDateTime startOfMonth = LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);

        CompletableFuture<Long> totalOrdersFuture = CompletableFuture.supplyAsync(() -> orderRepository.countOrdersSince(startOfMonth));
        CompletableFuture<Long> pendingApptsFuture = CompletableFuture.supplyAsync(() -> appointmentRepository.countByStatus(AppointmentStatus.PENDING));
        CompletableFuture<Long> totalCustomersFuture = CompletableFuture.supplyAsync(() -> userRepository.countByRole(Role.CUSTOMER));
        CompletableFuture<BigDecimal> orderRevFuture = CompletableFuture.supplyAsync(() -> orderRepository.sumRevenueSince(startOfMonth));
        CompletableFuture<Double> apptRevFuture = CompletableFuture.supplyAsync(() -> appointmentRepository.sumCompletedAppointmentRevenueSince(startOfMonth));
        CompletableFuture<Long> activeVetsFuture = CompletableFuture.supplyAsync(() -> vetRepository.countByIsActive(true));
        CompletableFuture<Long> totalVetsFuture = CompletableFuture.supplyAsync(vetRepository::count);
        CompletableFuture<List<Product>> lowStockFuture = CompletableFuture.supplyAsync(productRepository::findLowStockProducts);

        CompletableFuture.allOf(
                totalOrdersFuture, pendingApptsFuture, totalCustomersFuture,
                orderRevFuture, apptRevFuture, activeVetsFuture, totalVetsFuture, lowStockFuture
        ).join();

        long totalOrdersThisMonth = totalOrdersFuture.join();
        long pendingAppointments = pendingApptsFuture.join();
        long totalCustomers = totalCustomersFuture.join();

        BigDecimal orderRevenueThisMonth = orderRevFuture.join();
        Double apptRevenueThisMonth = apptRevFuture.join();
        BigDecimal totalRevenueThisMonth = (orderRevenueThisMonth != null ? orderRevenueThisMonth : BigDecimal.ZERO)
                .add(BigDecimal.valueOf(apptRevenueThisMonth != null ? apptRevenueThisMonth : 0.0));

        long activeVets = activeVetsFuture.join();
        long totalVets = totalVetsFuture.join();
        long inactiveVets = Math.max(0, totalVets - activeVets);
        List<Product> lowStock = lowStockFuture.join();

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
        stats.put("totalVetsCount", totalVets);
        stats.put("lowStockCount", lowStock.size());
        stats.put("lowStockProducts", lowStockList);

        return stats;
    }

    private List<Map<String, Object>> buildMonthlyRevenueList() {
        YearMonth currentYearMonth = YearMonth.now();
        DateTimeFormatter shortMonthFormatter = DateTimeFormatter.ofPattern("MMM");
        DateTimeFormatter fullMonthFormatter = DateTimeFormatter.ofPattern("MMMM yyyy");

        LocalDateTime sixMonthsAgo = currentYearMonth.minusMonths(5).atDay(1).atStartOfDay();

        CompletableFuture<List<Order>> ordersFuture = CompletableFuture.supplyAsync(() -> orderRepository.findPaidOrdersSince(sixMonthsAgo));
        CompletableFuture<List<Appointment>> apptsFuture = CompletableFuture.supplyAsync(() -> appointmentRepository.findCompletedAppointmentsSinceWithVet(sixMonthsAgo));

        CompletableFuture.allOf(ordersFuture, apptsFuture).join();

        List<Order> allPaidOrders = ordersFuture.join();
        List<Appointment> allCompletedAppts = apptsFuture.join();

        List<Map<String, Object>> monthlyData = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth targetMonth = currentYearMonth.minusMonths(i);
            LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime end = targetMonth.plusMonths(1).atDay(1).atStartOfDay();

            List<Order> monthOrders = allPaidOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(start) && o.getCreatedAt().isBefore(end))
                    .collect(Collectors.toList());

            BigDecimal orderRev = monthOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<Appointment> monthAppts = allCompletedAppts.stream()
                    .filter(a -> a.getDateTime() != null && !a.getDateTime().isBefore(start) && a.getDateTime().isBefore(end))
                    .collect(Collectors.toList());

            BigDecimal apptRev = monthAppts.stream()
                    .map(a -> BigDecimal.valueOf(a.getVet() != null && a.getVet().getConsultationFee() != null ? a.getVet().getConsultationFee() : 50.0))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRev = orderRev.add(apptRev);

            Map<String, Object> monthMap = new HashMap<>();
            monthMap.put("month", targetMonth.format(shortMonthFormatter));
            monthMap.put("fullMonth", targetMonth.format(fullMonthFormatter));
            monthMap.put("orderRevenue", orderRev);
            monthMap.put("appointmentRevenue", apptRev);
            monthMap.put("totalRevenue", totalRev);
            monthMap.put("orderCount", monthOrders.size());
            monthMap.put("appointmentCount", monthAppts.size());
            monthlyData.add(monthMap);
        }

        return monthlyData;
    }

    private List<Map<String, Object>> buildRecentOrdersList() {
        List<Order> limitedOrders = orderRepository.findRecentOrdersWithCustomer(PageRequest.of(0, 8));
        List<Long> orderIds = limitedOrders.stream().map(Order::getId).collect(Collectors.toList());

        Map<Long, List<OrderItem>> itemsByOrderId = orderIds.isEmpty()
                ? Map.of()
                : orderItemRepository.findByOrderIdsWithProduct(orderIds).stream()
                        .collect(Collectors.groupingBy(oi -> oi.getOrder().getId()));

        return limitedOrders.stream()
                .map(order -> {
                    List<OrderItem> items = itemsByOrderId.getOrDefault(order.getId(), List.of());
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
    }

    private List<Map<String, Object>> buildRecentAppointmentsList() {
        return appointmentRepository.findRecentAppointmentsWithDetails(PageRequest.of(0, 8))
                .stream()
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
    }
}
