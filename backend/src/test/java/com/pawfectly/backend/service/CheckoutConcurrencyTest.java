package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.AddToCartRequest;
import com.pawfectly.backend.dto.OrderDto;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.repository.ProductRepository;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class CheckoutConcurrencyTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private Product limitedStockProduct;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .name("Checkout Tester")
                .email("checkout_" + System.currentTimeMillis() + "@pawfectly.test")
                .password("password123")
                .role(Role.CUSTOMER)
                .build());

        limitedStockProduct = productRepository.save(Product.builder()
                .name("Rare Prescription Vaccine " + System.currentTimeMillis())
                .price(BigDecimal.valueOf(250.00))
                .category("Pharmacy")
                .stockQuantity(1) // Only 1 unit available
                .isActive(true)
                .build());
    }

    @Test
    @DisplayName("Business Logic: Checkout successfully decrements product stock and empties cart")
    @Transactional
    void checkout_DecrementsStockAndClearsCart() {
        // Add 1 unit to cart
        cartService.addToCart(testUser.getId(), AddToCartRequest.builder()
                .productId(limitedStockProduct.getId())
                .quantity(1)
                .build());

        // Checkout
        OrderDto order = orderService.createOrderFromCart(testUser.getId());
        assertNotNull(order);
        assertNotNull(order.getId());
        assertEquals(0, BigDecimal.valueOf(250.00).compareTo(order.getTotalAmount()));

        // Verify stock is now 0
        Product updatedProduct = productRepository.findById(limitedStockProduct.getId()).orElseThrow();
        assertEquals(0, updatedProduct.getStockQuantity());

        // Verify cart is empty
        assertTrue(cartService.getCustomerCart(testUser.getId()).isEmpty());
    }

    @Test
    @DisplayName("Business Logic: Checkout fails if requested quantity exceeds available stock")
    @Transactional
    void checkout_InsufficientStock_ThrowsBadRequestException() {
        // User had item in cart before stock ran out
        cartService.addToCart(testUser.getId(), AddToCartRequest.builder()
                .productId(limitedStockProduct.getId())
                .quantity(1)
                .build());

        // Manually simulate stock exhausted by another customer
        limitedStockProduct.setStockQuantity(0);
        productRepository.save(limitedStockProduct);

        // Attempt checkout
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.createOrderFromCart(testUser.getId())
        );

        assertTrue(ex.getMessage().toLowerCase().contains("stock") || ex.getMessage().toLowerCase().contains("available"));
    }
}
