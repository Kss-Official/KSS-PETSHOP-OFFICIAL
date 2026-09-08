package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.NewsletterRequest;
import com.pawfectly.backend.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class PublicNewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody NewsletterRequest request) {
        newsletterService.subscribe(request);
        return ResponseEntity.ok(Map.of("message", "Successfully subscribed to pet wellness newsletter!"));
    }
}
