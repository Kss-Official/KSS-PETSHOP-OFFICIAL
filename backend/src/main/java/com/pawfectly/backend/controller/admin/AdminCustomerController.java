package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Appointment;
import com.pawfectly.backend.entity.Order;
import com.pawfectly.backend.entity.Pet;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.AppointmentRepository;
import com.pawfectly.backend.repository.OrderItemRepository;
import com.pawfectly.backend.repository.OrderRepository;
import com.pawfectly.backend.repository.PetRepository;
import com.pawfectly.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public AdminCustomerController(UserRepository userRepository, PetRepository petRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCustomers() {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);

        List<Map<String, Object>> list = customers.stream().map(cust -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", cust.getId());
            map.put("name", cust.getName());
            map.put("email", cust.getEmail());
            map.put("phone", cust.getPhone() != null ? cust.getPhone() : "");
            map.put("isActive", true);
            map.put("createdAt", cust.getCreatedAt());
            map.put("petsCount", petRepository.findByOwnerId(cust.getId()).size());
            map.put("ordersCount", orderRepository.findByCustomerId(cust.getId()).size());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerDetails(@PathVariable Long id) {
        return userRepository.findById(id).map(cust -> {
            List<Pet> pets = petRepository.findByOwnerId(cust.getId());
            List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(cust.getId());
            List<Appointment> appointments = appointmentRepository.findByCustomerId(cust.getId());

            Map<String, Object> details = new HashMap<>();
            details.put("id", cust.getId());
            details.put("name", cust.getName());
            details.put("email", cust.getEmail());
            details.put("phone", cust.getPhone());
            details.put("isActive", true);
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
            return ResponseEntity.ok(Map.of(
                    "id", cust.getId(),
                    "isActive", true,
                    "message", "Customer account is active"
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

        // 1. Delete all appointments for customer's pets
        List<Pet> pets = petRepository.findByOwnerId(id);
        for (Pet pet : pets) {
            var appointments = appointmentRepository.findByPetId(pet.getId());
            if (appointments != null && !appointments.isEmpty()) {
                appointmentRepository.deleteAll(appointments);
            }
        }

        // 2. Delete all pets
        if (!pets.isEmpty()) {
            petRepository.deleteAll(pets);
        }

        // 3. Delete all order items & orders
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(id);
        for (Order order : orders) {
            var items = orderItemRepository.findByOrderId(order.getId());
            if (items != null && !items.isEmpty()) {
                orderItemRepository.deleteAll(items);
            }
        }
        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }

        // 4. Delete user record
        userRepository.delete(cust);

        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Customer \"" + cust.getName() + "\" and all associated records deleted successfully."
        ));
    }
}
