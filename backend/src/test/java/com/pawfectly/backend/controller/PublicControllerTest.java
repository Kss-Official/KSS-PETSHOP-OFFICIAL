package com.pawfectly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfectly.backend.dto.NewsletterRequest;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.Vet;
import com.pawfectly.backend.repository.ProductRepository;
import com.pawfectly.backend.repository.VetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PublicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VetRepository vetRepository;

    // --- Vets ---

    @Test
    @DisplayName("GET /api/vets - Happy Path: Returns active veterinarians list")
    void getVets_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/vets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].name", notNullValue()))
                .andExpect(jsonPath("$[0].specialization", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/vets/{id} - Happy Path & 404 for invalid ID")
    void getVetById_Scenarios() throws Exception {
        // Query existing seeded vet
        mockMvc.perform(get("/api/vets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", notNullValue()));

        // Query non-existent vet
        mockMvc.perform(get("/api/vets/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("not found")));
    }

    @Test
    @DisplayName("GET /api/vets - Soft-Delete Exclusion: Inactive vets are excluded from public list")
    void getVets_SoftDeletedExcluded() throws Exception {
        Vet inactiveVet = Vet.builder()
                .name("Inactive Test Vet " + System.currentTimeMillis())
                .specialization("General")
                .isActive(false)
                .build();
        Vet saved = vetRepository.save(inactiveVet);

        mockMvc.perform(get("/api/vets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", not(hasItem(saved.getId().intValue()))));

        // Direct lookup of inactive vet should return 404
        mockMvc.perform(get("/api/vets/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    // --- Services ---

    @Test
    @DisplayName("GET /api/services - Happy Path: Returns active services")
    void getServices_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].name", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/services/{id} - Happy Path & 404")
    void getServiceById_Scenarios() throws Exception {
        mockMvc.perform(get("/api/services/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        mockMvc.perform(get("/api/services/999999"))
                .andExpect(status().isNotFound());
    }

    // --- Products ---

    @Test
    @DisplayName("GET /api/products - Happy Path: Returns products with optional category and search")
    void getProducts_FiltersAndSearch() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));

        mockMvc.perform(get("/api/products").param("category", "Food"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products").param("search", "Science"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/products - Soft-Delete Exclusion: Inactive products are not returned")
    void getProducts_SoftDeletedExcluded() throws Exception {
        Product inactiveProduct = Product.builder()
                .name("Discontinued Item " + System.currentTimeMillis())
                .price(BigDecimal.valueOf(999.00))
                .category("Pharmacy")
                .stockQuantity(10)
                .isActive(false)
                .build();
        Product saved = productRepository.save(inactiveProduct);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", not(hasItem(saved.getId().intValue()))));

        mockMvc.perform(get("/api/products/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    // --- Articles ---

    @Test
    @DisplayName("GET /api/articles - Happy Path: Returns articles list")
    void getArticles_HappyPath() throws Exception {
        mockMvc.perform(get("/api/articles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    @DisplayName("GET /api/articles/{id} - Returns article details or 404")
    void getArticleById_Scenarios() throws Exception {
        mockMvc.perform(get("/api/articles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        mockMvc.perform(get("/api/articles/999999"))
                .andExpect(status().isNotFound());
    }

    // --- Newsletter ---

    @Test
    @DisplayName("POST /api/newsletter/subscribe - Happy Path & Validation")
    void subscribeNewsletter_Scenarios() throws Exception {
        String uniqueEmail = "sub_" + System.currentTimeMillis() + "@pawfectly.test";
        NewsletterRequest validRequest = NewsletterRequest.builder()
                .email(uniqueEmail)
                .build();

        // Happy path
        mockMvc.perform(post("/api/newsletter/subscribe")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsStringIgnoringCase("subscribed")));

        // Invalid email format
        NewsletterRequest invalidRequest = NewsletterRequest.builder()
                .email("bad-email-format")
                .build();

        mockMvc.perform(post("/api/newsletter/subscribe")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
}
