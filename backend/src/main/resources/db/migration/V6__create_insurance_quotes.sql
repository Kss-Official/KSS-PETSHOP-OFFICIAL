-- =============================================================================
-- Migration V6: Create Insurance Quotes Table
-- =============================================================================

CREATE TABLE insurance_quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    pet_name VARCHAR(255) NOT NULL,
    pet_species VARCHAR(100) NOT NULL,
    pet_age INT NOT NULL,
    selected_plan VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_insurance_quotes_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_insurance_quotes_customer_email ON insurance_quotes(customer_email);
CREATE INDEX idx_insurance_quotes_status ON insurance_quotes(status);
