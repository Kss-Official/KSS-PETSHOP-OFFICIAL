package com.pawfectly.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfectly.backend.dto.*;
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

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String userAToken;
    private String userBToken;

    @BeforeEach
    void setUp() throws Exception {
        userAToken = createTestUserAndGetToken("userA_" + System.currentTimeMillis() + "@pawfectly.test", "User A");
        userBToken = createTestUserAndGetToken("userB_" + System.currentTimeMillis() + "@pawfectly.test", "User B");
    }

    private String createTestUserAndGetToken(String email, String name) throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .name(name)
                .email(email)
                .password("testPassword123")
                .role(Role.CUSTOMER)
                .phone("955" + (int)(Math.random() * 8999999 + 1000000))
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    // --- Profile ---

    @Test
    @DisplayName("GET & PUT /api/customer/profile - Happy Path")
    void profile_GetAndUpdate() throws Exception {
        mockMvc.perform(get("/api/customer/profile")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("User A")));

        UserProfileDto updateDto = UserProfileDto.builder()
                .name("User A Updated")
                .email("userA_updated_" + System.currentTimeMillis() + "@pawfectly.test")
                .phone("9999988888")
                .build();

        mockMvc.perform(put("/api/customer/profile")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("User A Updated")))
                .andExpect(jsonPath("$.phone", is("9999988888")));
    }

    // --- Pets CRUD & Anti-IDOR ---

    @Test
    @DisplayName("Pets CRUD - Add, Update, List, Delete & Anti-IDOR")
    void pets_CrudAndAntiIdor() throws Exception {
        // 1. User A creates a pet
        PetDto newPet = PetDto.builder()
                .name("Max")
                .species("Dog")
                .breed("Golden Retriever")
                .age(2)
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/customer/pets")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newPet)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Max")))
                .andReturn();

        Long petId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // 2. User A can view their pet in list
        mockMvc.perform(get("/api/customer/pets")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].name", hasItem("Max")));

        // 3. User B CANNOT see User A's pet in their list
        mockMvc.perform(get("/api/customer/pets")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].name", not(hasItem("Max"))));

        // 4. User B CANNOT update or delete User A's pet (Anti-IDOR)
        PetDto maliciousUpdate = PetDto.builder()
                .name("Hijacked Name")
                .species("Dog")
                .age(5)
                .build();

        mockMvc.perform(put("/api/customer/pets/" + petId)
                        .header("Authorization", "Bearer " + userBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maliciousUpdate)))
                .andExpect(status().isForbidden()); // Scoped query returns 403 for other user's resource

        mockMvc.perform(delete("/api/customer/pets/" + petId)
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());

        // 5. User A can update and delete their pet
        PetDto validUpdate = PetDto.builder()
                .name("Maximus")
                .species("Dog")
                .breed("Golden Retriever")
                .age(3)
                .build();

        mockMvc.perform(put("/api/customer/pets/" + petId)
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Maximus")));

        mockMvc.perform(delete("/api/customer/pets/" + petId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk());
    }

    // --- Cart Management ---

    @Test
    @DisplayName("Cart - Add, Upsert quantity, Update quantity, and Clear")
    void cart_Operations() throws Exception {
        AddToCartRequest addReq1 = AddToCartRequest.builder()
                .productId(1L)
                .quantity(1)
                .build();

        // 1. Add product 1 with quantity 1
        mockMvc.perform(post("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(1)));

        // 2. Add product 1 AGAIN -> Quantity must increment to 2 without duplicating rows
        mockMvc.perform(post("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(2)));

        // 3. Verify cart has only 1 row with quantity 2
        MvcResult cartResult = mockMvc.perform(get("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].quantity", is(2)))
                .andReturn();

        Long cartItemId = objectMapper.readTree(cartResult.getResponse().getContentAsString()).get(0).get("id").asLong();

        // 4. Update quantity
        mockMvc.perform(put("/api/customer/cart/" + cartItemId)
                        .header("Authorization", "Bearer " + userAToken)
                        .param("quantity", "4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(4)));

        // 5. Clear cart
        mockMvc.perform(delete("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // --- Checkout & Orders Anti-IDOR ---

    @Test
    @DisplayName("Checkout & Orders - Create Order and verify Anti-IDOR on order details")
    void checkout_AndOrdersAntiIdor() throws Exception {
        // Add item to cart
        AddToCartRequest addReq = AddToCartRequest.builder()
                .productId(1L)
                .quantity(1)
                .build();

        mockMvc.perform(post("/api/customer/cart")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk());

        // Checkout
        MvcResult checkoutResult = mockMvc.perform(post("/api/customer/orders/checkout")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andReturn();

        Long orderId = objectMapper.readTree(checkoutResult.getResponse().getContentAsString()).get("id").asLong();

        // User A can access their order
        mockMvc.perform(get("/api/customer/orders/" + orderId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(orderId.intValue())));

        // User B CANNOT access User A's order (Anti-IDOR)
        mockMvc.perform(get("/api/customer/orders/" + orderId)
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());
    }

    // --- Appointments ---

    @Test
    @DisplayName("Appointments - Book, View, and Cancel")
    void appointments_Workflow() throws Exception {
        // Create a pet first
        PetDto newPet = PetDto.builder()
                .name("Milo")
                .species("Dog")
                .breed("Beagle")
                .age(2)
                .build();

        MvcResult petRes = mockMvc.perform(post("/api/customer/pets")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newPet)))
                .andExpect(status().isCreated())
                .andReturn();

        Long petId = objectMapper.readTree(petRes.getResponse().getContentAsString()).get("id").asLong();

        BookAppointmentRequest bookReq = BookAppointmentRequest.builder()
                .petId(petId)
                .vetId(1L)
                .serviceId(1L)
                .dateTime(LocalDateTime.now().plusDays(10 + (long)(Math.random() * 500)).withHour(11).withMinute(30).withSecond(0).withNano(0))
                .build();

        MvcResult bookResult = mockMvc.perform(post("/api/customer/appointments")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andReturn();

        Long aptId = objectMapper.readTree(bookResult.getResponse().getContentAsString()).get("id").asLong();

        // User B CANNOT cancel User A's appointment
        mockMvc.perform(put("/api/customer/appointments/" + aptId + "/cancel")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());

        // User A cancels appointment
        mockMvc.perform(put("/api/customer/appointments/" + aptId + "/cancel")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELLED")));
    }
}
