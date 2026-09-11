
package com.pawfectly.backend.controller.admin;

import com.pawfectly.backend.entity.Article;
import com.pawfectly.backend.repository.ArticleRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin/articles", "/api/admin/articles"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminArticleController {

    private final ArticleRepository articleRepository;

    public AdminArticleController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@Valid @RequestBody Article article) {
        article.setId(null);
        if (article.getIsFeatured() == null)
            article.setIsFeatured(false);
        if (article.getIsActive() == null)
            article.setIsActive(true);
        if (article.getCategory() == null)
            article.setCategory("Preventive Care");
        if (article.getPublishedAt() == null)
            article.setPublishedAt(LocalDateTime.now());
        if (article.getImageUrl() != null) {
            String trimmed = article.getImageUrl().trim();
            article.setImageUrl(trimmed.isEmpty() ? null : trimmed);
        }
        Article saved = articleRepository.save(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @Valid @RequestBody Article articleDetails) {
        return articleRepository.findById(id)
                .map(article -> {
                    article.setTitle(articleDetails.getTitle());
                    article.setContent(articleDetails.getContent());
                    if (articleDetails.getImageUrl() != null) {
                        String trimmed = articleDetails.getImageUrl().trim();
                        article.setImageUrl(trimmed.isEmpty() ? null : trimmed);
                    }
                    article.setPetType(articleDetails.getPetType());
                    if (articleDetails.getCategory() != null)
                        article.setCategory(articleDetails.getCategory());
                    if (articleDetails.getExcerpt() != null)
                        article.setExcerpt(articleDetails.getExcerpt());
                    if (articleDetails.getIsFeatured() != null)
                        article.setIsFeatured(articleDetails.getIsFeatured());
                    if (articleDetails.getIsActive() != null)
                        article.setIsActive(articleDetails.getIsActive());
                    Article updated = articleRepository.save(article);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-featured")
    public ResponseEntity<?> toggleArticleFeatured(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(article -> {
                    article.setIsFeatured(!Boolean.TRUE.equals(article.getIsFeatured()));
                    Article updated = articleRepository.save(article);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isFeatured", updated.getIsFeatured(),
                            "message", "Article featured flag updated"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleArticleStatus(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(article -> {
                    boolean newStatus = !Boolean.TRUE.equals(article.getIsActive());
                    article.setIsActive(newStatus);
                    Article updated = articleRepository.save(article);
                    return ResponseEntity.ok(Map.of(
                            "id", updated.getId(),
                            "isActive", updated.getIsActive(),
                            "message", "Article status updated to " + (newStatus ? "Active" : "Inactive")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        var articleOpt = articleRepository.findById(id);
        if (articleOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "id", id,
                    "message", "Article has already been deleted."
            ));
        }
        articleRepository.delete(articleOpt.get());
        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "Article \"" + articleOpt.get().getTitle() + "\" deleted successfully."
        ));
    }
}
