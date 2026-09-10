package com.pawfectly.backend.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfectly.backend.dto.ProductDto;
import com.pawfectly.backend.dto.RegisterRequest;
import com.pawfectly.backend.entity.Product;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    private String adminToken;
    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        adminToken = createTestUserAndGetToken("admin_" + System.currentTimeMillis() + "@pawfectly.test", Role.ADMIN);
        customerToken = createTestUserAndGetToken("cust_admincheck_" + System.currentTimeMillis() + "@pawfectly.test", Role.CUSTOMER);
    }

    private String createTestUserAndGetToken(String email, Role role) throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("Test " + role.name())
                .email(email)
                .password("testPassword123")
                .role(role)
                .phone("9" + String.format("%09d", (int)(Math.random() * 900000000L)))
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    // --- RBAC 403 Forbidden Checks ---

    @Test
    @DisplayName("RBAC: Customer Token on Admin Endpoints returns 403 Forbidden")
    void customerToken_AccessingAdmin_Returns403() throws Exception {
        // 1. Stats
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 2. Products List
        mockMvc.perform(get("/api/admin/products")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 3. Create Product
        ProductDto newProd = ProductDto.builder()
                .name("Malicious Product")
                .price(BigDecimal.valueOf(100))
                .category("Food")
                .stockQuantity(10)
                .build();

        mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProd)))
                .andExpect(status().isForbidden());
    }

    // --- Admin Stats ---

    @Test
    @DisplayName("GET /api/admin/stats - Happy Path with Admin Token")
    void getStats_HappyPath() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.totalProducts", greaterThanOrEqualTo(1)));
    }

    // --- Admin Products & Soft-Delete ---

    @Test
    @DisplayName("Admin Products - Create, Update, and Soft-Delete verification")
    void adminProducts_CrudAndSoftDelete() throws Exception {
        // 1. Create product
        ProductDto createDto = ProductDto.builder()
                .name("Admin Created Food " + System.currentTimeMillis())
                .description("Nutritious pet formula")
                .price(BigDecimal.valueOf(1499.50))
                .category("Food")
                .stockQuantity(50)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.isActive", is(true)))
                .andReturn();

        Long prodId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // 2. Soft-delete product
        mockMvc.perform(delete("/api/admin/products/" + prodId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsStringIgnoringCase("deleted")));

        // 3. Confirm row still exists in database with isActive=false
        Product dbProduct = productRepository.findById(prodId).orElseThrow();
        org.junit.jupiter.api.Assertions.assertFalse(dbProduct.getIsActive());

        // 4. Confirm public endpoint no longer returns it
        mockMvc.perform(get("/api/products/" + prodId))
                .andExpect(status().isNotFound());

        // 5. Confirm admin endpoint STILL sees it in all products list
        mockMvc.perform(get("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id", hasItem(prodId.intValue())));
    }

    // --- Validation on Product Creation ---

    @Test
    @DisplayName("POST /api/admin/products - Validation: Negative price and stock rejected with 400")
    void createProduct_InvalidData_Returns400() throws Exception {
        ProductDto invalidDto = ProductDto.builder()
                .name("") // blank name
                .price(BigDecimal.valueOf(-50.00)) // negative price
                .category("Food")
                .stockQuantity(-5) // negative stock
                .build();

        mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", notNullValue()));
    }
}
