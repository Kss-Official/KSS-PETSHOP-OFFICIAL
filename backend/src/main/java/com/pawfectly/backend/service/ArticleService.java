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
    public List<ArticleDto> getArticles(String petType, Boolean featured, String search) {
        List<Article> articles = articleRepository.findAll();

        if (featured != null && featured) {
            articles = articles.stream().filter(Article::getIsFeatured).collect(Collectors.toList());
        }

        if (petType != null && !petType.isBlank() && !petType.equalsIgnoreCase("All") && !petType.equalsIgnoreCase("All Tips")) {
            articles = articles.stream()
                    .filter(a -> a.getPetType() != null && a.getPetType().equalsIgnoreCase(petType))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase().trim();
            articles = articles.stream()
                    .filter(a -> a.getTitle().toLowerCase().contains(lower) ||
                            a.getContent().toLowerCase().contains(lower))
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

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        if (dto.getImageUrl() != null) article.setImageUrl(dto.getImageUrl());
        if (dto.getPetType() != null) article.setPetType(dto.getPetType());
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
                .isFeatured(article.getIsFeatured())
                .publishedAt(article.getPublishedAt())
                .build();
    }
}
