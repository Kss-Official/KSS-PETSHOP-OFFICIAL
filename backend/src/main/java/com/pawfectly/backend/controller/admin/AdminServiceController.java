package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.ServiceEntity;
import com.pawfectly.backend.repository.ServiceRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/services", "/api/admin/services"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminServiceController {

    private final ServiceRepository serviceRepository;

    public AdminServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<List<ServiceEntity>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntity> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceEntity> createService(@Valid @RequestBody ServiceEntity service) {
        service.setId(null);
        if (service.getIsActive() == null) service.setIsActive(true);
        ServiceEntity saved = serviceRepository.save(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @Valid @RequestBody ServiceEntity serviceDetails) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setName(serviceDetails.getName());
                    service.setDescription(serviceDetails.getDescription());
                    service.setIconUrl(serviceDetails.getIconUrl());
                    if (serviceDetails.getIsActive() != null) service.setIsActive(serviceDetails.getIsActive());
                    ServiceEntity updated = serviceRepository.save(service);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> {
                    try {
                        serviceRepository.delete(service);
                        return ResponseEntity.ok(Map.of(
                                "message", "Service \"" + service.getName() + "\" deleted successfully.",
                                "id", id
                        ));
                    } catch (Exception ex) {
                        service.setIsActive(false);
                        serviceRepository.save(service);
                        return ResponseEntity.ok(Map.of(
                                "message", "Service \"" + service.getName() + "\" has associated historical bookings and was marked Inactive.",
                                "id", id
                        ));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleServiceStatus(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setIsActive(!Boolean.TRUE.equals(service.getIsActive()));
                    ServiceEntity updated = serviceRepository.save(service);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isActive", updated.getIsActive(),
                            "message", "Service status updated to " + (updated.getIsActive() ? "Active" : "Inactive")
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
