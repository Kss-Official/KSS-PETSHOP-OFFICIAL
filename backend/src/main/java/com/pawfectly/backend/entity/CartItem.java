package com.pawfectly.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "cart_items",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_cart_items_customer_product", columnNames = {"customer_id", "product_id"})
    },
    indexes = {
        @Index(name = "idx_cart_items_customer_id", columnList = "customer_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cart_items_customer"))
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cart_items_product"))
    private Product product;

    @NotNull
    @Min(1)
    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 1;
}
