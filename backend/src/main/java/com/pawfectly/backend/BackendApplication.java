package com.pawfectly.backend;

import com.pawfectly.backend.entity.Role;
import com.pawfectly.backend.entity.User;
import com.pawfectly.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }

    @Bean
    public CommandLineRunner seedDefaultUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            com.pawfectly.backend.repository.ServiceRepository serviceRepository) {
        return args -> {
            // Ensure default admin user exists
            userRepository.findByEmail("admin@pawfectly.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(Role.ADMIN);
                    admin.setIsActive(true);
                    userRepository.save(admin);
                },
                () -> userRepository.save(User.builder()
                    .name("Pawfectly Admin")
                    .email("admin@pawfectly.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("+91 99999 99999")
                    .isActive(true)
                    .build())
            );

            // Ensure default customer user exists
            userRepository.findByEmail("customer@pawfectly.com").ifPresentOrElse(
                cust -> {
                    cust.setPassword(passwordEncoder.encode("customer123"));
                    cust.setRole(Role.CUSTOMER);
                    cust.setIsActive(true);
                    userRepository.save(cust);
                },
                () -> userRepository.save(User.builder()
                    .name("Alex Morgan")
                    .email("customer@pawfectly.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.CUSTOMER)
                    .phone("+91 98765 43210")
                    .isActive(true)
                    .build())
            );

            // Sync service action photos in database
            serviceRepository.findByNameIgnoreCase("Veterinary Care").ifPresent(s -> {
                s.setIconUrl("https://res.cloudinary.com/vphylrop/image/upload/v1788797640/service_01_vet_care.jpg");
                serviceRepository.save(s);
            });
            serviceRepository.findByNameIgnoreCase("Pet Food & Nutrition").ifPresent(s -> {
                s.setIconUrl("https://res.cloudinary.com/vphylrop/image/upload/v1788802670/service_02_pet_food_rabbit_bowl.jpg");
                serviceRepository.save(s);
            });
            serviceRepository.findByNameIgnoreCase("Professional Grooming").ifPresent(s -> {
                s.setIconUrl("https://res.cloudinary.com/vphylrop/image/upload/v1788802830/service_03_grooming_puppy_tub.jpg");
                serviceRepository.save(s);
            });
            serviceRepository.findByNameIgnoreCase("Pet Pharmacy & Meds").ifPresent(s -> {
                s.setIconUrl("https://res.cloudinary.com/vphylrop/image/upload/v1788802595/service_04_pharmacy_cat_med.jpg");
                serviceRepository.save(s);
            });
            serviceRepository.findByNameIgnoreCase("Toys & Enrichment").ifPresent(s -> {
                s.setIconUrl("https://res.cloudinary.com/vphylrop/image/upload/v1788802179/service_05_toys_kittens_play.jpg");
                serviceRepository.save(s);
            });
        };
    }
}

