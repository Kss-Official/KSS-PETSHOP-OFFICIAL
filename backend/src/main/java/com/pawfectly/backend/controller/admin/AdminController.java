package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.dto.AdminDashboardStatsDto;
import com.pawfectly.backend.service.AdminService;
import com.pawfectly.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin", "/api/admin"})
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final NotificationService notificationService;

    // --- Dashboard Stats ---
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // --- Admin Announcements ---
    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String message = body.get("message");
        if (title == null || title.isBlank() || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title and message are required."));
        }
        int count = notificationService.createAnnouncement(title.trim(), message.trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Announcement created and sent to " + count + " customer(s).",
                "recipientCount", count
        ));
    }
}

