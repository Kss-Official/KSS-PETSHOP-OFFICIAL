package com.pawfectly.backend.controller;

import com.pawfectly.backend.dto.ArticleDto;
import com.pawfectly.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class PublicArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleDto>> getArticles(
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(articleService.getArticles(petType, featured, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }
}
