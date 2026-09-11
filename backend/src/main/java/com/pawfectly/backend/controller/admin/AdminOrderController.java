package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.entity.OrderItem;
import com.pawfectly.backend.entity.OrderStatus;
import com.pawfectly.backend.entity.PaymentStatus;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.repository.OrderItemRepository;
import com.pawfectly.backend.repository.OrderRepository;
import com.pawfectly.backend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/v1/admin/orders", "/api/admin/orders"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public AdminOrderController(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getOrders(
            @RequestParam(required = false) String orderStatus,
            @RequestParam(required = false) String paymentStatus) {

        OrderStatus os = null;
        if (orderStatus != null && !orderStatus.isBlank() && !orderStatus.equalsIgnoreCase("ALL")) {
            try { os = OrderStatus.valueOf(orderStatus.toUpperCase().replace(" ", "_").replace("-", "_")); } catch (Exception ignored) {}
        }

        PaymentStatus ps = null;
        if (paymentStatus != null && !paymentStatus.isBlank() && !paymentStatus.equalsIgnoreCase("ALL")) {
            try { ps = PaymentStatus.valueOf(paymentStatus.toUpperCase().replace(" ", "_").replace("-", "_")); } catch (Exception ignored) {}
        }

        List<Order> orders = orderRepository.findFiltered(os, ps);
        List<Long> orderIds = orders.stream().map(Order::getId).collect(Collectors.toList());

        Map<Long, Integer> itemCountByOrderId = orderIds.isEmpty()
                ? Map.of()
                : orderItemRepository.findByOrderIdIn(orderIds).stream()
                        .collect(Collectors.groupingBy(oi -> oi.getOrder().getId(), Collectors.summingInt(oi -> 1)));

        List<Map<String, Object>> response = orders.stream().map(order -> {
            boolean needsSave = false;
            if ((order.getOrderStatus() == OrderStatus.PLACED || order.getOrderStatus() == OrderStatus.READY_FOR_PICKUP)
                    && order.getPaymentStatus() != PaymentStatus.UNPAID) {
                order.setPaymentStatus(PaymentStatus.UNPAID);
                needsSave = true;
            } else if (order.getOrderStatus() == OrderStatus.COMPLETED
                    && order.getPaymentStatus() != PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.PAID);
                needsSave = true;
            }
            if (needsSave) {
                orderRepository.save(order);
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("customerId", order.getCustomer() != null ? order.getCustomer().getId() : null);
            map.put("customerName", order.getCustomer() != null ? order.getCustomer().getName() : "Guest");
            map.put("customerEmail", order.getCustomer() != null ? order.getCustomer().getEmail() : "");
            map.put("customerPhone", order.getCustomer() != null ? order.getCustomer().getPhone() : "");
            map.put("totalAmount", order.getTotalAmount());
            map.put("orderStatus", order.getOrderStatus().name());
            map.put("paymentStatus", order.getPaymentStatus().name());
            map.put("pickupCode", String.format("PICKUP-%04d", order.getId()));
            map.put("createdAt", order.getCreatedAt());
            map.put("itemCount", itemCountByOrderId.getOrDefault(order.getId(), 0));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        return orderRepository.findById(id).map(order -> {
            boolean needsSave = false;
            if ((order.getOrderStatus() == OrderStatus.PLACED || order.getOrderStatus() == OrderStatus.READY_FOR_PICKUP)
                    && order.getPaymentStatus() != PaymentStatus.UNPAID) {
                order.setPaymentStatus(PaymentStatus.UNPAID);
                needsSave = true;
            } else if (order.getOrderStatus() == OrderStatus.COMPLETED
                    && order.getPaymentStatus() != PaymentStatus.PAID) {
                order.setPaymentStatus(PaymentStatus.PAID);
                needsSave = true;
            }
            if (needsSave) {
                orderRepository.save(order);
            }

            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            List<Map<String, Object>> itemDtos = items.stream().map(item -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("productId", item.getProduct() != null ? item.getProduct().getId() : null);
                itemMap.put("productName", item.getProduct() != null ? item.getProduct().getName() : "Unknown Product");
                itemMap.put("productImage", item.getProduct() != null ? item.getProduct().getImageUrl() : "");
                itemMap.put("category", item.getProduct() != null ? item.getProduct().getCategory() : "");
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("unitPrice", item.getPriceAtPurchase());
                itemMap.put("priceAtPurchase", item.getPriceAtPurchase());
                itemMap.put("subtotal", item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())));
                return itemMap;
            }).collect(Collectors.toList());

            Map<String, Object> details = new HashMap<>();
            details.put("id", order.getId());
            details.put("customerName", order.getCustomer() != null ? order.getCustomer().getName() : "Guest");
            details.put("customerEmail", order.getCustomer() != null ? order.getCustomer().getEmail() : "");
            details.put("customerPhone", order.getCustomer() != null ? order.getCustomer().getPhone() : "");
            details.put("totalAmount", order.getTotalAmount());
            details.put("orderStatus", order.getOrderStatus().name());
            details.put("paymentStatus", order.getPaymentStatus().name());
            details.put("pickupCode", String.format("PICKUP-%04d", order.getId()));
            details.put("createdAt", order.getCreatedAt());
            details.put("items", itemDtos);

            return ResponseEntity.ok(details);
        }).orElse(ResponseEntity.notFound().build());
    }

    @RequestMapping(value = {"/{id}/order-status", "/{id}/status"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    @Transactional
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String statusStr = body.get("orderStatus");
        if (statusStr == null || statusStr.isBlank()) {
            statusStr = body.get("status");
        }
        if (statusStr == null || statusStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order status is required"));
        }

        try {
            String normalized = statusStr.trim().toUpperCase().replace(" ", "_").replace("-", "_");
            OrderStatus newStatus = OrderStatus.valueOf(normalized);
            return orderRepository.findById(id).map(order -> {
                OrderStatus oldStatus = order.getOrderStatus();
                order.setOrderStatus(newStatus);

                // Auto-sync payment status based on business rules:
                if (newStatus == OrderStatus.COMPLETED) {
                    order.setPaymentStatus(PaymentStatus.PAID);
                } else if (newStatus == OrderStatus.CANCELLED) {
                    order.setPaymentStatus(PaymentStatus.FAILED);
                } else if (newStatus == OrderStatus.READY_FOR_PICKUP || newStatus == OrderStatus.PLACED) {
                    order.setPaymentStatus(PaymentStatus.UNPAID);
                }

                Order saved = orderRepository.save(order);

                // Auto stock deduction on delivery / completion:
                if (oldStatus != OrderStatus.COMPLETED && newStatus == OrderStatus.COMPLETED) {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    for (OrderItem item : items) {
                        if (item.getProduct() != null) {
                            Product product = item.getProduct();
                            int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                            int newStock = Math.max(0, currentStock - item.getQuantity());
                            product.setStockQuantity(newStock);
                            productRepository.save(product);
                        }
                    }
                } else if (oldStatus != OrderStatus.CANCELLED && newStatus == OrderStatus.CANCELLED) {
                    // Restore stock if active order is cancelled
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    for (OrderItem item : items) {
                        if (item.getProduct() != null) {
                            Product product = item.getProduct();
                            int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                            product.setStockQuantity(currentStock + item.getQuantity());
                            productRepository.save(product);
                        }
                    }
                }

                return ResponseEntity.ok(Map.of(
                        "id", saved.getId(),
                        "orderStatus", saved.getOrderStatus().name(),
                        "paymentStatus", saved.getPaymentStatus() != null ? saved.getPaymentStatus().name() : "UNPAID",
                        "message", "Order status updated to " + saved.getOrderStatus().name()
                ));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid order status value: " + statusStr));
        }
    }

    @RequestMapping(value = {"/{id}/payment-status", "/{id}/payment"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    @Transactional
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String statusStr = body.get("paymentStatus");
        if (statusStr == null || statusStr.isBlank()) {
            statusStr = body.get("status");
        }
        if (statusStr == null || statusStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment status is required"));
        }

        try {
            String normalized = statusStr.trim().toUpperCase().replace(" ", "_").replace("-", "_");
            PaymentStatus newStatus = PaymentStatus.valueOf(normalized);
            return orderRepository.findById(id).map(order -> {
                order.setPaymentStatus(newStatus);
                Order saved = orderRepository.save(order);
                return ResponseEntity.ok(Map.of(
                        "id", saved.getId(),
                        "paymentStatus", saved.getPaymentStatus().name(),
                        "message", "Payment status updated to " + saved.getPaymentStatus().name()
                ));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid payment status value: " + statusStr));
        }
    }
}
