package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.ArticleDto;
import com.pawfectly.backend.entity.Article;
import com.pawfectly.backend.exception.ResourceNotFoundException;
import com.pawfectly.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional(readOnly = true)
    public List<ArticleDto> getArticles(String petType, String category, Boolean featured, String search) {
        List<Article> articles = articleRepository.findAll();

        if (featured != null && featured) {
            articles = articles.stream().filter(a -> Boolean.TRUE.equals(a.getIsFeatured())).collect(Collectors.toList());
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All") && !category.equalsIgnoreCase("All Tips")) {
            articles = articles.stream()
                    .filter(a -> a.getCategory() != null && a.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }

        if (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All") && !petType.equalsIgnoreCase("All Tips")) {
            articles = articles.stream()
                    .filter(a -> a.getPetType() != null && a.getPetType().equalsIgnoreCase(petType.trim()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            articles = articles.stream()
                    .filter(a -> (a.getTitle() != null && a.getTitle().toLowerCase().contains(lower)) ||
                            (a.getContent() != null && a.getContent().toLowerCase().contains(lower)) ||
                            (a.getCategory() != null && a.getCategory().toLowerCase().contains(lower)))
                    .collect(Collectors.toList());
        }

        return articles.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ArticleDto getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));
        return mapToDto(article);
    }

    @Transactional
    public ArticleDto createArticle(ArticleDto dto) {
        Article article = Article.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imageUrl(dto.getImageUrl())
                .petType(dto.getPetType())
                .category(dto.getCategory() != null ? dto.getCategory() : "Preventive Care")
                .excerpt(dto.getExcerpt())
                .isFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false)
                .publishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now())
                .build();

        Article saved = articleRepository.save(article);
        log.info("Created article: {}", saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public ArticleDto updateArticle(Long id, ArticleDto dto) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));

        if (dto.getTitle() != null) article.setTitle(dto.getTitle());
        if (dto.getContent() != null) article.setContent(dto.getContent());
        if (dto.getImageUrl() != null) article.setImageUrl(dto.getImageUrl());
        if (dto.getPetType() != null) article.setPetType(dto.getPetType());
        if (dto.getCategory() != null) article.setCategory(dto.getCategory());
        if (dto.getExcerpt() != null) article.setExcerpt(dto.getExcerpt());
        if (dto.getIsFeatured() != null) article.setIsFeatured(dto.getIsFeatured());
        if (dto.getPublishedAt() != null) article.setPublishedAt(dto.getPublishedAt());

        Article updated = articleRepository.save(article);
        log.info("Updated article id: {}", id);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));
        articleRepository.delete(article);
        log.info("Deleted article id: {}", id);
    }

    private ArticleDto mapToDto(Article article) {
        return ArticleDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .imageUrl(article.getImageUrl())
                .petType(article.getPetType())
                .category(article.getCategory() != null ? article.getCategory() : "Preventive Care")
                .excerpt(article.getExcerpt())
                .isFeatured(article.getIsFeatured())
                .publishedAt(article.getPublishedAt())
                .build();
    }
}
