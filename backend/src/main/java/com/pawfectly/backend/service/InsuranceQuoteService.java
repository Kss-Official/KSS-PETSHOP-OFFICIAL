package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.InsuranceQuoteDto;
import com.pawfectly.backend.dto.InsuranceQuoteRequest;
import com.pawfectly.backend.entity.InsuranceQuote;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.InsuranceQuoteRepository;
import com.pawfectly.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsuranceQuoteService {

    private final InsuranceQuoteRepository insuranceQuoteRepository;
    private final UserRepository userRepository;

    @Transactional
    public InsuranceQuoteDto submitQuote(InsuranceQuoteRequest request, String currentUserEmail) {
        User customer = null;
        if (currentUserEmail != null && !currentUserEmail.isBlank()) {
            customer = userRepository.findByEmail(currentUserEmail).orElse(null);
        }

        InsuranceQuote quote = InsuranceQuote.builder()
                .customer(customer)
                .customerName(request.getCustomerName().trim())
                .customerEmail(request.getCustomerEmail().trim().toLowerCase())
                .customerPhone(request.getCustomerPhone().trim())
                .petName(request.getPetName().trim())
                .petSpecies(request.getPetSpecies().trim())
                .petAge(request.getPetAge())
                .selectedPlan(request.getSelectedPlan().trim())
                .status("PENDING")
                .build();

        InsuranceQuote saved = insuranceQuoteRepository.save(quote);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<InsuranceQuoteDto> getAllQuotes(String status) {
        List<InsuranceQuote> quotes;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            quotes = insuranceQuoteRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim());
        } else {
            quotes = insuranceQuoteRepository.findAllByOrderByCreatedAtDesc();
        }
        return quotes.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public InsuranceQuoteDto updateQuoteStatus(Long id, String newStatus, String notes) {
        InsuranceQuote quote = insuranceQuoteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Insurance quote not found with ID: " + id));

        if (newStatus != null && !newStatus.isBlank()) {
            quote.setStatus(newStatus.toUpperCase().trim());
        }
        if (notes != null) {
            quote.setNotes(notes.trim());
        }

        InsuranceQuote updated = insuranceQuoteRepository.save(quote);
        return mapToDto(updated);
    }

    private InsuranceQuoteDto mapToDto(InsuranceQuote quote) {
        return InsuranceQuoteDto.builder()
                .id(quote.getId())
                .customerId(quote.getCustomer() != null ? quote.getCustomer().getId() : null)
                .customerName(quote.getCustomerName())
                .customerEmail(quote.getCustomerEmail())
                .customerPhone(quote.getCustomerPhone())
                .petName(quote.getPetName())
                .petSpecies(quote.getPetSpecies())
                .petAge(quote.getPetAge())
                .selectedPlan(quote.getSelectedPlan())
                .status(quote.getStatus())
                .notes(quote.getNotes())
                .createdAt(quote.getCreatedAt())
                .updatedAt(quote.getUpdatedAt())
                .build();
    }
}
