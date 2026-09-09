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
            // Ensure default admin user exists
            userRepository.findByEmail("admin@pawfectly.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                },
                () -> userRepository.save(User.builder()
                    .name("Pawfectly Admin")
                    .email("admin@pawfectly.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("+91 99999 99999")
                    .build())
            );

            // Ensure default customer user exists
            userRepository.findByEmail("customer@pawfectly.com").ifPresentOrElse(
                cust -> {
                    cust.setPassword(passwordEncoder.encode("customer123"));
                    cust.setRole(Role.CUSTOMER);
                    userRepository.save(cust);
                },
                () -> userRepository.save(User.builder()
                    .name("Alex Morgan")
                    .email("customer@pawfectly.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.CUSTOMER)
                    .phone("+91 98765 43210")
                    .build())
            );
        };
    }
}

