package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.NewsletterSubscriber;
import com.pawfectly.backend.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/newsletter", "/api/admin/newsletter"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminNewsletterController {

    private final NewsletterSubscriberRepository newsletterSubscriberRepository;

    public AdminNewsletterController(NewsletterSubscriberRepository newsletterSubscriberRepository) {
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
    }

    @GetMapping
    public ResponseEntity<List<NewsletterSubscriber>> getSubscribers() {
        return ResponseEntity.ok(newsletterSubscriberRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSubscriber(@PathVariable Long id) {
        if (!newsletterSubscriberRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        newsletterSubscriberRepository.deleteById(id);
        return ResponseEntity.ok(Map.of(
            "message", "Subscriber deleted successfully.",
            "id", id
        ));
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportSubscribersCsv() {
        List<NewsletterSubscriber> list = newsletterSubscriberRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Email,SubscribedAt\n");
        for (NewsletterSubscriber sub : list) {
            csv.append(sub.getId()).append(",")
               .append("\"").append(sub.getEmail().replace("\"", "\"\"")).append("\",")
               .append(sub.getSubscribedAt() != null ? sub.getSubscribedAt().toString() : "")
               .append("\n");
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"newsletter_subscribers.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }
}
