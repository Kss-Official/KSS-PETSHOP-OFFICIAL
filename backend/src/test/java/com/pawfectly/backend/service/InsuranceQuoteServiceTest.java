package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.InsuranceQuoteDto;
import com.pawfectly.backend.dto.InsuranceQuoteRequest;
import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class InsuranceQuoteServiceTest {

    @Autowired
    private InsuranceQuoteService insuranceQuoteService;

    @Autowired
    private UserRepository userRepository;

    private User testCustomer;

    @BeforeEach
    void setUp() {
        testCustomer = userRepository.save(User.builder()
                .name("Quote Customer")
                .email("quote_cust_" + System.currentTimeMillis() + "@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .phone("9876543210")
                .build());
    }

    @Test
    @DisplayName("Submit insurance quote - anonymous customer")
    void testSubmitQuoteAnonymous() {
        InsuranceQuoteRequest request = InsuranceQuoteRequest.builder()
                .customerName("John Doe")
                .customerEmail("john@example.com")
                .customerPhone("1234567890")
                .petName("Buddy")
                .petSpecies("Dog")
                .petAge(3)
                .selectedPlan("Standard")
                .build();

        InsuranceQuoteDto result = insuranceQuoteService.submitQuote(request, null);

        assertNotNull(result.getId());
        assertEquals("John Doe", result.getCustomerName());
        assertEquals("john@example.com", result.getCustomerEmail());
        assertEquals("PENDING", result.getStatus());
        assertNull(result.getCustomerId());
    }

    @Test
    @DisplayName("Submit insurance quote - logged in customer")
    void testSubmitQuoteLoggedIn() {
        InsuranceQuoteRequest request = InsuranceQuoteRequest.builder()
                .customerName(testCustomer.getName())
                .customerEmail(testCustomer.getEmail())
                .customerPhone("9876543210")
                .petName("Milo")
                .petSpecies("Cat")
                .petAge(2)
                .selectedPlan("Comprehensive")
                .build();

        InsuranceQuoteDto result = insuranceQuoteService.submitQuote(request, testCustomer.getEmail());

        assertNotNull(result.getId());
        assertEquals(testCustomer.getId(), result.getCustomerId());
        assertEquals("Comprehensive", result.getSelectedPlan());
    }

    @Test
    @DisplayName("Get all quotes with status filter and update status")
    void testGetAllQuotesAndUpdateStatus() {
        InsuranceQuoteRequest request = InsuranceQuoteRequest.builder()
                .customerName("Alice")
                .customerEmail("alice@example.com")
                .customerPhone("5551234567")
                .petName("Rex")
                .petSpecies("Dog")
                .petAge(5)
                .selectedPlan("Basic")
                .build();

        InsuranceQuoteDto quote = insuranceQuoteService.submitQuote(request, null);

        List<InsuranceQuoteDto> pendingQuotes = insuranceQuoteService.getAllQuotes("PENDING");
        assertTrue(pendingQuotes.stream().anyMatch(q -> q.getId().equals(quote.getId())));

        InsuranceQuoteDto updated = insuranceQuoteService.updateQuoteStatus(quote.getId(), "REVIEWED", "Checked pet history");
        assertEquals("REVIEWED", updated.getStatus());
        assertEquals("Checked pet history", updated.getNotes());

        List<InsuranceQuoteDto> reviewedQuotes = insuranceQuoteService.getAllQuotes("REVIEWED");
        assertTrue(reviewedQuotes.stream().anyMatch(q -> q.getId().equals(quote.getId())));
    }
}
