package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<Notification> findByIdAndCustomerId(Long id, Long customerId);

    boolean existsByCustomerIdAndTypeAndRelatedEntityId(Long customerId, String type, Long relatedEntityId);

    boolean existsByCustomerIdAndRelatedEntityId(Long customerId, Long relatedEntityId);
}
