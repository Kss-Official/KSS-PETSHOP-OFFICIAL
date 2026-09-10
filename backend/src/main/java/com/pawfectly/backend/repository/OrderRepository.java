package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.entity.OrderStatus;
import com.pawfectly.backend.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByCustomerIdIn(List<Long> customerIds);
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.customer ORDER BY o.createdAt DESC")
    List<Order> findRecentOrdersWithCustomer(org.springframework.data.domain.Pageable pageable);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.customer WHERE " +
           "(:orderStatus IS NULL OR o.orderStatus = :orderStatus) AND " +
           "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
           "ORDER BY o.createdAt DESC")
    List<Order> findFiltered(
            @Param("orderStatus") OrderStatus orderStatus,
            @Param("paymentStatus") PaymentStatus paymentStatus
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :startDate")
    BigDecimal sumRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o FROM Order o WHERE (o.paymentStatus = 'PAID' OR o.orderStatus = 'COMPLETED') AND o.createdAt >= :startDate")
    List<Order> findPaidOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o FROM Order o WHERE (o.paymentStatus = 'PAID' OR o.orderStatus = 'COMPLETED') AND o.createdAt >= :startDate AND o.createdAt < :endDate")
    List<Order> findPaidOrdersBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
