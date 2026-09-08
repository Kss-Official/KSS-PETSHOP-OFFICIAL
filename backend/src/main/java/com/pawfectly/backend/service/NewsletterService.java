package com.pawfectly.backend.service;

import com.pawfectly.backend.dto.NewsletterRequest;
import com.pawfectly.backend.entity.NewsletterSubscriber;
import com.pawfectly.backend.exception.BadRequestException;
import com.pawfectly.backend.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;

    @Transactional
    public void subscribe(NewsletterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (subscriberRepository.existsByEmail(email)) {
            throw new BadRequestException("This email address is already subscribed.");
        }

        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .build();

        subscriberRepository.save(subscriber);
        log.info("New newsletter subscriber registered: {}", email);
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriber> getAllSubscribers() {
        return subscriberRepository.findAll();
    }
}
