package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.AddToCartRequest;
import com.pawfectly.backend.dto.CartItemDto;
import com.pawfectly.backend.entity.CartItem;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.CartItemRepository;
import com.pawfectly.backend.repository.ProductRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CartItemDto> getCustomerCart(Long customerId) {
        return cartItemRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(Long customerId, AddToCartRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.getIsActive()) {
            throw new BadRequestException("This product is currently unavailable.");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock available. Remaining stock: " + product.getStockQuantity());
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCustomerIdAndProductId(customerId, product.getId());
        CartItem cartItem;

        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more. Available stock: " + product.getStockQuantity());
            }
            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = CartItem.builder()
                    .customer(customer)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        CartItem saved = cartItemRepository.save(cartItem);
        log.info("Saved cart item for customer id {}: product id {}", customerId, product.getId());
        return mapToDto(saved);
    }

    @Transactional
    public CartItemDto updateCartItemQuantity(Long customerId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not own this cart item.");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }

        if (item.getProduct().getStockQuantity() < quantity) {
            throw new BadRequestException("Available stock is only " + item.getProduct().getStockQuantity());
        }

        item.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(item);
        return mapToDto(saved);
    }

    @Transactional
    public void removeFromCart(Long customerId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCustomer().getId().equals(customerId)) {
            throw new AccessDeniedException("You do not own this cart item.");
        }

        cartItemRepository.delete(item);
        log.info("Removed cart item id {} for customer id {}", cartItemId, customerId);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomerId(customerId);
        log.info("Cleared cart for customer id {}", customerId);
    }

    private CartItemDto mapToDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .price(item.getProduct().getPrice())
                .imageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .stockQuantity(item.getProduct().getStockQuantity())
                .build();
    }
}
