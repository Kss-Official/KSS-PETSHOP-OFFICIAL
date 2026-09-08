package com.pawfectly.backend;

import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Strictly delete any admin accounts from the database
            userRepository.findByEmail("admin@pawfectly.com").ifPresent(userRepository::delete);
            userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .forEach(userRepository::delete);

            // Ensure default customer user exists if not already present
            if (!userRepository.existsByEmail("customer@pawfectly.com")) {
                userRepository.save(User.builder()
                    .name("Alex Morgan")
                    .email("customer@pawfectly.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.CUSTOMER)
                    .phone("+91 98765 43210")
                    .build());
            }
        };
    }
}

