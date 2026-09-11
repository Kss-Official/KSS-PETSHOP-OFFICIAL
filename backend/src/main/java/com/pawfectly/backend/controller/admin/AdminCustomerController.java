package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.*;
import com.pawfectly.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/api/v1/admin/customers", "/api/admin/customers"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminCustomerController {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final VetReviewRepository vetReviewRepository;
    private final NotificationRepository notificationRepository;
    private final CartItemRepository cartItemRepository;
    private final InsuranceQuoteRepository insuranceQuoteRepository;
    private final VetRepository vetRepository;

    public AdminCustomerController(
            UserRepository userRepository,
            PetRepository petRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            VetReviewRepository vetReviewRepository,
            NotificationRepository notificationRepository,
            CartItemRepository cartItemRepository,
            InsuranceQuoteRepository insuranceQuoteRepository,
            VetRepository vetRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.vetReviewRepository = vetReviewRepository;
        this.notificationRepository = notificationRepository;
        this.cartItemRepository = cartItemRepository;
        this.insuranceQuoteRepository = insuranceQuoteRepository;
        this.vetRepository = vetRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCustomers() {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        List<Long> customerIds = customers.stream().map(User::getId).collect(Collectors.toList());

        if (customerIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        CompletableFuture<Map<Long, Integer>> petsFuture = CompletableFuture.supplyAsync(() ->
                petRepository.findByOwnerIdIn(customerIds).stream()
                        .collect(Collectors.groupingBy(p -> p.getOwner().getId(), Collectors.summingInt(p -> 1)))
        );

        CompletableFuture<Map<Long, Integer>> ordersFuture = CompletableFuture.supplyAsync(() ->
                orderRepository.findByCustomerIdIn(customerIds).stream()
                        .collect(Collectors.groupingBy(o -> o.getCustomer().getId(), Collectors.summingInt(o -> 1)))
        );

        CompletableFuture.allOf(petsFuture, ordersFuture).join();

        Map<Long, Integer> petsCountByCust = petsFuture.join();
        Map<Long, Integer> ordersCountByCust = ordersFuture.join();

        List<Map<String, Object>> list = customers.stream().map(cust -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", cust.getId());
            map.put("name", cust.getName());
            map.put("email", cust.getEmail());
            map.put("phone", cust.getPhone() != null ? cust.getPhone() : "");
            map.put("isActive", cust.getIsActive() != null ? cust.getIsActive() : true);
            map.put("createdAt", cust.getCreatedAt());
            map.put("petsCount", petsCountByCust.getOrDefault(cust.getId(), 0));
            map.put("ordersCount", ordersCountByCust.getOrDefault(cust.getId(), 0));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable Long id) {
        return userRepository.findById(id).map(cust -> {
            CompletableFuture<List<Pet>> petsFuture = CompletableFuture.supplyAsync(() -> petRepository.findByOwnerId(cust.getId()));
            CompletableFuture<List<Order>> ordersFuture = CompletableFuture.supplyAsync(() -> orderRepository.findByCustomerIdOrderByCreatedAtDesc(cust.getId()));
            CompletableFuture<List<Appointment>> apptsFuture = CompletableFuture.supplyAsync(() -> appointmentRepository.findByCustomerId(cust.getId()));

            CompletableFuture.allOf(petsFuture, ordersFuture, apptsFuture).join();

            List<Pet> pets = petsFuture.join();
            List<Order> orders = ordersFuture.join();
            List<Appointment> appointments = apptsFuture.join();

            Map<String, Object> details = new HashMap<>();
            details.put("id", cust.getId());
            details.put("name", cust.getName());
            details.put("email", cust.getEmail());
            details.put("phone", cust.getPhone());
            details.put("isActive", cust.getIsActive() != null ? cust.getIsActive() : true);
            details.put("createdAt", cust.getCreatedAt());

            details.put("pets", pets.stream().map(pet -> Map.of(
                    "id", pet.getId(),
                    "name", pet.getName(),
                    "species", pet.getSpecies(),
                    "breed", pet.getBreed() != null ? pet.getBreed() : "",
                    "age", pet.getAge() != null ? pet.getAge() : 0
            )).collect(Collectors.toList()));

            details.put("orders", orders.stream().map(ord -> Map.of(
                    "id", ord.getId(),
                    "totalAmount", ord.getTotalAmount(),
                    "orderStatus", ord.getOrderStatus().name(),
                    "paymentStatus", ord.getPaymentStatus().name(),
                    "createdAt", ord.getCreatedAt()
            )).collect(Collectors.toList()));

            details.put("appointments", appointments.stream().map(apt -> Map.of(
                    "id", apt.getId(),
                    "petName", apt.getPet() != null ? apt.getPet().getName() : "Pet",
                    "vetName", apt.getVet() != null ? apt.getVet().getName() : "Vet",
                    "serviceName", apt.getService() != null ? apt.getService().getName() : "Service",
                    "dateTime", apt.getDateTime(),
                    "status", apt.getStatus().name()
            )).collect(Collectors.toList()));

            return ResponseEntity.ok(details);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleCustomerStatus(@PathVariable Long id) {
        return userRepository.findById(id).map(cust -> {
            boolean current = cust.getIsActive() != null ? cust.getIsActive() : true;
            cust.setIsActive(!current);
            User saved = userRepository.save(cust);
            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "isActive", saved.getIsActive(),
                    "message", "Customer account " + (saved.getIsActive() ? "activated" : "deactivated") + " successfully"
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "id", id,
                    "message", "Customer account has already been deleted."
            ));
        }
        User cust = userOpt.get();

        // 1. Delete cart items
        List<CartItem> cartItems = cartItemRepository.findByCustomerId(id);
        if (cartItems != null && !cartItems.isEmpty()) {
            cartItemRepository.deleteAll(cartItems);
            cartItemRepository.flush();
        }

        // 2. Delete notifications
        List<Notification> notifications = notificationRepository.findByCustomerIdOrderByCreatedAtDesc(id);
        if (notifications != null && !notifications.isEmpty()) {
            notificationRepository.deleteAll(notifications);
            notificationRepository.flush();
        }

        // 3. Clear customer reference on insurance quotes
        List<InsuranceQuote> quotes = insuranceQuoteRepository.findByCustomerId(id);
        if (quotes != null && !quotes.isEmpty()) {
            for (InsuranceQuote quote : quotes) {
                quote.setCustomer(null);
            }
            insuranceQuoteRepository.saveAll(quotes);
            insuranceQuoteRepository.flush();
        }

        // 4. Collect all appointments for customer's pets + any appointments referencing customer
        List<Pet> pets = petRepository.findByOwnerId(id);
        Set<Long> appointmentIds = new HashSet<>();
        List<Appointment> customerAppointments = appointmentRepository.findByCustomerId(id);
        for (Appointment a : customerAppointments) {
            appointmentIds.add(a.getId());
        }
        for (Pet pet : pets) {
            List<Appointment> petAppointments = appointmentRepository.findByPetId(pet.getId());
            for (Appointment a : petAppointments) {
                appointmentIds.add(a.getId());
            }
        }

        // 5. Delete VetReviews and update affected Vets
        List<VetReview> customerReviews = vetReviewRepository.findByCustomerId(id);
        Set<VetReview> reviewsToDelete = new HashSet<>(customerReviews);
        if (!appointmentIds.isEmpty()) {
            for (Long apptId : appointmentIds) {
                vetReviewRepository.findByAppointmentId(apptId).ifPresent(reviewsToDelete::add);
            }
        }

        Set<Long> affectedVetIds = new HashSet<>();
        for (VetReview review : reviewsToDelete) {
            if (review.getVet() != null) {
                affectedVetIds.add(review.getVet().getId());
            }
        }

        if (!reviewsToDelete.isEmpty()) {
            vetReviewRepository.deleteAll(reviewsToDelete);
            vetReviewRepository.flush();
            for (Long vetId : affectedVetIds) {
                vetRepository.findById(vetId).ifPresent(vet -> {
                    Double avgRating = vetReviewRepository.getAverageRatingForVet(vetId);
                    Long reviewCount = vetReviewRepository.getReviewCountForVet(vetId);
                    vet.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : null);
                    vet.setReviewsCount(reviewCount != null ? reviewCount.intValue() : 0);
                    vetRepository.save(vet);
                });
            }
        }

        // 6. Delete MedicalRecords for all appointments
        for (Long apptId : appointmentIds) {
            medicalRecordRepository.findByAppointmentId(apptId).ifPresent(medicalRecordRepository::delete);
        }
        medicalRecordRepository.flush();

        // 7. Delete all Appointments
        if (!appointmentIds.isEmpty()) {
            List<Appointment> apptsToDelete = appointmentRepository.findAllById(appointmentIds);
            appointmentRepository.deleteAll(apptsToDelete);
            appointmentRepository.flush();
        }

        // 8. Delete all Pets
        if (!pets.isEmpty()) {
            petRepository.deleteAll(pets);
            petRepository.flush();
        }

        // 9. Delete all OrderItems & Orders
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(id);
        for (Order order : orders) {
            var items = orderItemRepository.findByOrderId(order.getId());
            if (items != null && !items.isEmpty()) {
                orderItemRepository.deleteAll(items);
            }
        }
        if (!orders.isEmpty()) {
            orderItemRepository.flush();
            orderRepository.deleteAll(orders);
            orderRepository.flush();
        }

        // 10. Delete User record
        userRepository.delete(cust);

        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Customer \"" + cust.getName() + "\" and all associated records deleted successfully."
        ));
    }
}
