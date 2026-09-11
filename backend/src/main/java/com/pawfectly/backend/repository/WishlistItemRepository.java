package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.WishlistItem;
import com.pawfectly.backend.entity.WishlistItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Optional<WishlistItem> findByCustomerIdAndItemTypeAndItemId(Long customerId, WishlistItemType itemType, Long itemId);
    boolean existsByCustomerIdAndItemTypeAndItemId(Long customerId, WishlistItemType itemType, Long itemId);
    void deleteByCustomerIdAndItemTypeAndItemId(Long customerId, WishlistItemType itemType, Long itemId);
}
