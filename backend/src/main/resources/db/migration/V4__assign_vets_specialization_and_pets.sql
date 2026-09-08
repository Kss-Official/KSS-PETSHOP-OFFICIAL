-- =============================================================================
-- Migration V4: Assign Doctors to Specializations and Pet Types
-- =============================================================================

ALTER TABLE vets
ADD COLUMN secondary_specialization VARCHAR(255),
ADD COLUMN pet_types VARCHAR(255),
ADD COLUMN experience_years INT DEFAULT 5,
ADD COLUMN reviews_count INT DEFAULT 45,
ADD COLUMN city VARCHAR(255) DEFAULT 'New York, USA',
ADD COLUMN consultation_fee DOUBLE DEFAULT 50.0;

-- Update existing 6 vets with rich details
UPDATE vets SET 
    specialization = 'Surgery',
    secondary_specialization = 'Veterinary Surgeon',
    pet_types = 'Dogs, Cats',
    experience_years = 12,
    reviews_count = 128,
    city = 'New York, USA',
    consultation_fee = 60.0,
    photo_url = 'vet_dr_sarah_mitchell',
    rating = 4.9
WHERE id = 1;

UPDATE vets SET 
    specialization = 'Surgery',
    secondary_specialization = 'Orthopaedic Surgeon',
    pet_types = 'Dogs, Cats, Rabbits',
    experience_years = 10,
    reviews_count = 94,
    city = 'Chicago, USA',
    consultation_fee = 55.0,
    photo_url = 'vet_dr_james_carter',
    rating = 4.9
WHERE id = 2;

UPDATE vets SET 
    specialization = 'General Veterinarian',
    secondary_specialization = 'Preventive & Wellness Care',
    pet_types = 'Dogs, Cats',
    experience_years = 8,
    reviews_count = 76,
    city = 'Bangalore, India',
    consultation_fee = 45.0,
    photo_url = 'avatar_user_1',
    rating = 4.8
WHERE id = 3;

UPDATE vets SET 
    specialization = 'Dental Care',
    secondary_specialization = 'Oral Surgery & Prophylaxis',
    pet_types = 'Dogs, Cats',
    experience_years = 9,
    reviews_count = 82,
    city = 'Bangalore, India',
    consultation_fee = 50.0,
    photo_url = 'avatar_user_2',
    rating = 4.9
WHERE id = 4;

UPDATE vets SET 
    specialization = 'Exotic Pet Care',
    secondary_specialization = 'Small Mammal & Reptile Specialist',
    pet_types = 'Rabbits, Exotic Pets',
    experience_years = 7,
    reviews_count = 58,
    city = 'Bangalore, India',
    consultation_fee = 40.0,
    photo_url = 'avatar_user_3',
    rating = 4.7
WHERE id = 5;

UPDATE vets SET 
    specialization = 'Exotic Pet Care',
    secondary_specialization = 'Avian & Bird Medicine',
    pet_types = 'Birds, Exotic Pets',
    experience_years = 6,
    reviews_count = 64,
    city = 'Bangalore, India',
    consultation_fee = 40.0,
    photo_url = 'avatar_user_4',
    rating = 4.6
WHERE id = 6;

-- Insert doctors for remaining specializations (Dermatology, Emergency Care, Cardiology, Oncology)
INSERT INTO vets (id, name, specialization, secondary_specialization, pet_types, experience_years, reviews_count, city, consultation_fee, photo_url, rating, address, is_active, created_at, updated_at) VALUES
(7, 'Dr. David Chen', 'Dermatology', 'Allergy & Skin Therapeutics', 'Dogs, Cats, Rabbits', 11, 110, 'San Francisco, USA', 65.0, 'vet_dr_sarah_mitchell', 4.9, 'Bay Area Animal Dermatology, San Francisco, USA', TRUE, NOW(), NOW()),
(8, 'Dr. Emily Watson', 'Emergency Care', 'Critical Care & Triage', 'Dogs, Cats, Birds, Rabbits, Exotic Pets', 14, 195, 'New York, USA', 75.0, 'vet_dr_james_carter', 5.0, 'Metro Emergency Vet Hospital, New York, USA', TRUE, NOW(), NOW()),
(9, 'Dr. Michael Roberts', 'Cardiology', 'Cardiovascular Diagnostics', 'Dogs, Cats', 15, 87, 'Boston, USA', 70.0, 'avatar_user_1', 4.9, 'New England Pet Heart Center, Boston, USA', TRUE, NOW(), NOW()),
(10, 'Dr. Sophia Martinez', 'Oncology', 'Medical Oncology & Chemotherapy', 'Dogs, Cats', 13, 92, 'Los Angeles, USA', 65.0, 'avatar_user_2', 4.8, 'Pacific Animal Cancer Care, Los Angeles, USA', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE specialization = VALUES(specialization);
