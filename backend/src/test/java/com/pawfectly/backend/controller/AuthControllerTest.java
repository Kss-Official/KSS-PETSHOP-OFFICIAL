package com.pawfectly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfectly.backend.dto.AuthRequest;
import com.pawfectly.backend.dto.RegisterRequest;
import com.pawfectly.backend.entity.Role;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;


    @BeforeEach
    void setUp() {
        // Safe clean up of test-specific users if needed
    }

    @Test
    @DisplayName("POST /api/auth/register - Happy Path: Register Customer")
    void registerCustomer_HappyPath() throws Exception {
        String uniqueEmail = "cust_" + System.currentTimeMillis() + "@pawfectly.test";
        RegisterRequest request = RegisterRequest.builder()
                .name("Test Customer")
                .email(uniqueEmail)
                .password("testPassword123")
                .role(Role.CUSTOMER)
                .phone("9555123456")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is(uniqueEmail)))
                .andExpect(jsonPath("$.name", is("Test Customer")))
                .andExpect(jsonPath("$.role", is("CUSTOMER")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validation: Missing Required Fields")
    void register_MissingFields_Returns400() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name("")
                .email("not-an-email")
                .password("123") // too short
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/register - Duplicate Email: Rejects with 400")
    void register_DuplicateEmail_Returns400() throws Exception {
        String email = "dup_" + System.currentTimeMillis() + "@pawfectly.test";
        RegisterRequest request = RegisterRequest.builder()
                .name("First User")
                .email(email)
                .password("testPassword123")
                .role(Role.CUSTOMER)
                .build();

        // Register first time
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Attempt second registration with same email
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Happy Path: Returns JWT")
    void login_HappyPath() throws Exception {
        String email = "login_" + System.currentTimeMillis() + "@pawfectly.test";
        RegisterRequest regRequest = RegisterRequest.builder()
                .name("Login User")
                .email(email)
                .password("validPassword123")
                .role(Role.CUSTOMER)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        AuthRequest loginRequest = AuthRequest.builder()
                .email(email)
                .password("validPassword123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is(email)));
    }

    @Test
    @DisplayName("POST /api/auth/login - Anti-Enumeration: Bad Password & Non-existent Email return identical message")
    void login_InvalidCredentials_ReturnsUniform401() throws Exception {
        AuthRequest nonExistentEmail = AuthRequest.builder()
                .email("doesnotexist_" + System.currentTimeMillis() + "@pawfectly.test")
                .password("somePassword123")
                .build();

        MvcResult result1 = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nonExistentEmail)))
                .andExpect(status().isUnauthorized())
                .andReturn();

        AuthRequest wrongPassword = AuthRequest.builder()
                .email("alex@pawfectly.com") // Seeded user
                .password("wrongPasswordXYZ")
                .build();

        MvcResult result2 = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongPassword)))
                .andExpect(status().isUnauthorized())
                .andReturn();

        // Confirm both return standardized error response structure
        String content1 = result1.getResponse().getContentAsString();
        String content2 = result2.getResponse().getContentAsString();
        org.junit.jupiter.api.Assertions.assertTrue(content1.contains("Invalid email or password"));
        org.junit.jupiter.api.Assertions.assertTrue(content2.contains("Invalid email or password"));
    }

    @Test
    @DisplayName("GET /api/auth/me - Happy Path: Returns authenticated user details")
    void getMe_Authenticated_ReturnsProfile() throws Exception {
        String email = "me_" + System.currentTimeMillis() + "@pawfectly.test";
        RegisterRequest regRequest = RegisterRequest.builder()
                .name("Current User")
                .email(email)
                .password("validPassword123")
                .role(Role.CUSTOMER)
                .build();

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(email)))
                .andExpect(jsonPath("$.name", is("Current User")));
    }

    @Test
    @DisplayName("GET /api/auth/me - Unauthenticated: Returns 401")
    void getMe_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", notNullValue()));
    }
}
