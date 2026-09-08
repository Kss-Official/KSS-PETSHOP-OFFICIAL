package com.pawfectly.backend.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityRbacTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Security: Missing Authorization header on protected route returns standardized 401")
    void missingToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/customer/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)))
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.timestamp", notNullValue()))
                .andExpect(jsonPath("$.path", is("/api/customer/profile")));
    }

    @Test
    @DisplayName("Security: Malformed/Invalid Token returns 401 Unauthorized")
    void malformedToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/customer/profile")
                        .header("Authorization", "Bearer invalid.jwt.signature"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    @DisplayName("Error Handling: Malformed JSON payload returns standardized 400 error shape without stack trace")
    void malformedJson_ReturnsStandardizedError() throws Exception {
        String brokenJson = "{ \"name\": \"Broken\", \"email\": "; // Unterminated JSON

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(brokenJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.stackTrace").doesNotExist()) // Verify zero stack trace leakage
                .andExpect(jsonPath("$.trace").doesNotExist());
    }
}
