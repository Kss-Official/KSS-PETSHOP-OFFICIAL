package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.OrderDto;
import com.pawfectly.backend.dto.OrderItemDto;
import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<OrderDto> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long customerId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isAdmin && !order.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not have permission to view this order.");
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderDto createOrderFromCart(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty.");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (!product.getIsActive()) {
                throw new BadRequestException("Product " + product.getName() + " is no longer available.");
            }
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Not enough stock for " + product.getName() + ". Available: " + product.getStockQuantity());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);
        }

        Order order = Order.builder()
                .customer(customer)
                .totalAmount(total)
                .orderStatus(OrderStatus.PLACED)
                .paymentStatus(PaymentStatus.PAID)
                .build();

        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(item.getProduct())
                    .quantity(item.getQuantity())
                    .priceAtPurchase(item.getProduct().getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartItemRepository.deleteByCustomerId(customerId);
        log.info("Created order {} for customer id {} total {}", savedOrder.getId(), customerId, total);

        return mapToDto(savedOrder);
    }

    @Transactional
    public OrderDto cancelCustomerOrder(Long orderId, Long customerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not have permission to cancel this order.");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            return mapToDto(order);
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Completed orders cannot be cancelled.");
        }

        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);

        // Restore stock for all order items since stock was deducted at placement
        if (oldStatus != OrderStatus.CANCELLED) {
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

        log.info("Customer {} directly cancelled order {}", customerId, orderId);
        return mapToDto(updated);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setOrderStatus(newStatus);
        Order updated = orderRepository.save(order);
        log.info("Updated order {} status to {}", orderId, newStatus);
        return mapToDto(updated);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, Long customerId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!isAdmin && !order.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not have permission to cancel this order.");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            return mapToDto(order);
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Completed orders cannot be cancelled.");
        }

        // Restore stock for items
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        log.info("Cancelled order {} for customer id {}", orderId, customerId);

        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersAdmin() {
        return orderRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> items = orderItemRepository.findByOrderId(order.getId()).stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .build())
                .collect(Collectors.toList());

        String dateStr = order.getCreatedAt() != null
                ? order.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"))
                : "20260909";
        String orderNum = String.format("ORD-%s-%04d", dateStr, order.getId());

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(orderNum)
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
