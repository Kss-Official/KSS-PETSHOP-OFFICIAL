package com.pawfectly.backend.repository;

import com.pawfectly.backend.entity.InsuranceQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceQuoteRepository extends JpaRepository<InsuranceQuote, Long> {

    List<InsuranceQuote> findAllByOrderByCreatedAtDesc();

    List<InsuranceQuote> findByStatusOrderByCreatedAtDesc(String status);

    List<InsuranceQuote> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
}
