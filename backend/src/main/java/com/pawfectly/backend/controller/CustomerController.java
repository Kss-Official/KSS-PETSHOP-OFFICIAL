package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.*;
import com.pawfectly.backend.security.CustomUserDetails;
import com.pawfectly.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
@RequiredArgsConstructor
public class CustomerController {

    private final UserService userService;
    private final PetService petService;
    private final CartService cartService;
    private final OrderService orderService;
    private final AppointmentService appointmentService;

    // --- Profile ---
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserProfileDto request) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getId(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    // --- Pets ---
    @GetMapping("/pets")
    public ResponseEntity<List<PetDto>> getPets(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(petService.getCustomerPets(userDetails.getId()));
    }

    @GetMapping("/pets/{id}")
    public ResponseEntity<PetDto> getPet(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(petService.getPetById(id, userDetails.getId()));
    }

    @PostMapping("/pets")
    public ResponseEntity<PetDto> createPet(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PetDto request) {
        return new ResponseEntity<>(petService.createPet(userDetails.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/pets/{id}")
    public ResponseEntity<PetDto> updatePet(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PetDto request) {
        return ResponseEntity.ok(petService.updatePet(id, userDetails.getId(), request));
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Map<String, String>> deletePet(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        petService.deletePet(id, userDetails.getId());
        return ResponseEntity.ok(Map.of("message", "Pet deleted successfully."));
    }

    // --- Cart ---
    @GetMapping("/cart")
    public ResponseEntity<List<CartItemDto>> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCustomerCart(userDetails.getId()));
    }

    @PostMapping("/cart")
    public ResponseEntity<CartItemDto> addToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userDetails.getId(), request));
    }

    @PutMapping("/cart/{itemId}")
    public ResponseEntity<CartItemDto> updateCartQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(userDetails.getId(), itemId, quantity));
    }

    @DeleteMapping("/cart/{itemId}")
    public ResponseEntity<Map<String, String>> removeCartItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        cartService.removeFromCart(userDetails.getId(), itemId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart."));
    }

    @DeleteMapping("/cart")
    public ResponseEntity<Map<String, String>> clearCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(Map.of("message", "Cart cleared."));
    }

    // --- Orders ---
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getCustomerOrders(userDetails.getId()));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrderById(id, userDetails.getId(), false));
    }

    @PostMapping("/orders/checkout")
    public ResponseEntity<OrderDto> checkout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return new ResponseEntity<>(orderService.createOrderFromCart(userDetails.getId()), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/orders/{id}/cancel", method = {RequestMethod.PATCH, RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<OrderDto> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(orderService.cancelCustomerOrder(id, userDetails.getId()));
    }

    private final VetReviewService vetReviewService;
    private final NotificationService notificationService;

    // --- Notifications ---
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getCustomerNotifications(userDetails.getId()));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<NotificationDto> markNotificationAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(notificationService.markAsRead(userDetails.getId(), id));
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.deleteNotification(userDetails.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully.", "id", id));
    }

    // --- Reviews ---
    @PostMapping("/reviews")
    public ResponseEntity<VetReviewDto> createReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody VetReviewDto request) {
        return new ResponseEntity<>(vetReviewService.createReview(userDetails.getId(), request), HttpStatus.CREATED);
    }

    @GetMapping("/appointments/{id}/review")
    public ResponseEntity<VetReviewDto> getReviewForAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(vetReviewService.getReviewForAppointment(id));
    }

    // --- Appointments ---
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getCustomerAppointments(userDetails.getId()));
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDto> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody BookAppointmentRequest request) {
        return new ResponseEntity<>(appointmentService.bookAppointment(userDetails.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentDto> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userDetails.getId(), false));
    }
}
