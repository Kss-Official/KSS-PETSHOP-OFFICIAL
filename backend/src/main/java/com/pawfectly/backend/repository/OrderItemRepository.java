package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByProductId(Long productId);

    @org.springframework.data.jpa.repository.Query("SELECT oi FROM OrderItem oi LEFT JOIN FETCH oi.product WHERE oi.order.id IN :orderIds")
    List<OrderItem> findByOrderIdsWithProduct(@org.springframework.data.repository.query.Param("orderIds") List<Long> orderIds);

    List<OrderItem> findByOrderIdIn(List<Long> orderIds);
}
