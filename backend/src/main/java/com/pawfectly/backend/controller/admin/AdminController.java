package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.dto.*;
import com.pawfectly.backend.entity.AppointmentStatus;
import com.pawfectly.backend.entity.MedicalRecord;
import com.pawfectly.backend.entity.NewsletterSubscriber;
import com.pawfectly.backend.entity.OrderStatus;
import com.pawfectly.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final VetService vetService;
    private final ServiceEntityService serviceEntityService;
    private final ArticleService articleService;
    private final OrderService orderService;
    private final AppointmentService appointmentService;
    private final NewsletterService newsletterService;

    // --- Dashboard Stats ---
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // --- Products ---
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsAdmin());
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto request) {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully."));
    }

    // --- Vets ---
    @GetMapping("/vets")
    public ResponseEntity<List<VetDto>> getAllVets() {
        return ResponseEntity.ok(vetService.getAllVetsAdmin());
    }

    @PostMapping("/vets")
    public ResponseEntity<VetDto> createVet(@Valid @RequestBody VetDto request) {
        return new ResponseEntity<>(vetService.createVet(request), HttpStatus.CREATED);
    }

    @PutMapping("/vets/{id}")
    public ResponseEntity<VetDto> updateVet(@PathVariable Long id, @Valid @RequestBody VetDto request) {
        return ResponseEntity.ok(vetService.updateVet(id, request));
    }

    @DeleteMapping("/vets/{id}")
    public ResponseEntity<Map<String, String>> deleteVet(@PathVariable Long id) {
        vetService.deleteVet(id);
        return ResponseEntity.ok(Map.of("message", "Vet deleted successfully."));
    }

    // --- Services ---
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllServices() {
        return ResponseEntity.ok(serviceEntityService.getAllServicesAdmin());
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceDto> createService(@Valid @RequestBody ServiceDto request) {
        return new ResponseEntity<>(serviceEntityService.createService(request), HttpStatus.CREATED);
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceDto> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDto request) {
        return ResponseEntity.ok(serviceEntityService.updateService(id, request));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Map<String, String>> deleteService(@PathVariable Long id) {
        serviceEntityService.deleteService(id);
        return ResponseEntity.ok(Map.of("message", "Service deleted successfully."));
    }

    // --- Articles ---
    @PostMapping("/articles")
    public ResponseEntity<ArticleDto> createArticle(@Valid @RequestBody ArticleDto request) {
        return new ResponseEntity<>(articleService.createArticle(request), HttpStatus.CREATED);
    }

    @PutMapping("/articles/{id}")
    public ResponseEntity<ArticleDto> updateArticle(@PathVariable Long id, @Valid @RequestBody ArticleDto request) {
        return ResponseEntity.ok(articleService.updateArticle(id, request));
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Map<String, String>> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(Map.of("message", "Article deleted successfully."));
    }

    // --- Orders ---
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersAdmin());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // --- Appointments ---
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsAdmin());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentDto> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }

    @PostMapping("/appointments/{id}/medical-record")
    public ResponseEntity<MedicalRecord> saveMedicalRecord(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String diagnosis = body.get("diagnosis");
        String prescription = body.get("prescription");
        String notes = body.get("notes");
        return ResponseEntity.ok(adminService.saveMedicalRecord(id, diagnosis, prescription, notes));
    }

    // --- Newsletter Subscribers ---
    @GetMapping("/subscribers")
    public ResponseEntity<List<NewsletterSubscriber>> getSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }
}
