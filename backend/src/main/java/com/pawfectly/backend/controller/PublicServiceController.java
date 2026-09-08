package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.ServiceDto;
import com.pawfectly.backend.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class PublicServiceController {

    private final ServiceEntityService serviceEntityService;

    @GetMapping
    public ResponseEntity<List<ServiceDto>> getServices() {
        return ResponseEntity.ok(serviceEntityService.getActiveServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceEntityService.getServiceById(id));
    }
}
