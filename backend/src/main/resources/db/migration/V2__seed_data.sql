-- =============================================================================
-- Pawfectly Pet Clinic Management System - Database Seed Migration
-- =============================================================================

-- 1. SEED DEFAULT USERS (Passwords are BCrypt hashed: 'admin123' and 'customer123')
INSERT INTO users (id, name, email, password, role, phone, created_at, updated_at) VALUES
(1, 'Admin Staff', 'admin@pawfectly.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiI11u9o4zC.b3D3G6bWv/Rz7Y8x4Y6', 'ADMIN', '+1 (555) 019-2834', NOW(), NOW()),
(2, 'Alex Morgan', 'customer@pawfectly.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiI11u9o4zC.b3D3G6bWv/Rz7Y8x4Y6', 'CUSTOMER', '+91 98765 43210', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 2. SEED DEFAULT PETS FOR ALEX MORGAN
INSERT INTO pets (id, owner_id, name, species, breed, age, created_at) VALUES
(1, 2, 'Buddy', 'Dog', 'Golden Retriever', 3, NOW()),
(2, 2, 'Luna', 'Cat', 'Persian Longhair', 2, NOW())
ON DUPLICATE KEY UPDATE age = VALUES(age);

-- 3. SEED VETERINARIANS
INSERT INTO vets (id, name, specialization, photo_url, rating, address, is_active, created_at, updated_at) VALUES
(1, 'Dr. Sarah Mitchell', 'Veterinary Surgeon', 'vet_dr_sarah_mitchell', 4.9, 'Pawfect Care Clinic, New York, USA', TRUE, NOW(), NOW()),
(2, 'Dr. James Carter', 'Veterinary Surgeon', 'vet_dr_james_carter', 4.9, 'City Animal Hospital, Chicago, USA', TRUE, NOW(), NOW()),
(3, 'Dr. Rahul Sharma', 'General Veterinarian', 'avatar_user_1', 4.8, 'Pawfect Care Clinic, Brigade Road, Bangalore', TRUE, NOW(), NOW()),
(4, 'Dr. Priya Mehta', 'Veterinary Surgeon', 'avatar_user_2', 4.9, 'City Pet Surgical Center, Residency Rd, Bangalore', TRUE, NOW(), NOW()),
(5, 'Dr. Arjun Verma', 'Exotic Pet Specialist', 'avatar_user_3', 4.7, 'Fauna Animal Hospital, Indiranagar, Bangalore', TRUE, NOW(), NOW()),
(6, 'Dr. Neha Kapoor', 'Avian & Exotic Veterinarian', 'avatar_user_4', 4.6, 'Feather & Fur Clinic, Ulsoor, Bangalore', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE rating = VALUES(rating);

-- 4. SEED SERVICES
INSERT INTO services (id, name, description, icon_url, is_active, created_at) VALUES
(1, 'Veterinary Care', 'Comprehensive health exams, diagnostic checkups, vaccinations, and preventive healthcare by licensed veterinary doctors.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896182/c52497e6-b462-42af-8257-69b80c7369c7_1.png', TRUE, NOW()),
(2, 'Pet Food & Nutrition', 'Tailored dietary guidance, prescription diets, and balanced wellness food for every stage of your pet’s life.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896176/f2cf2664-43f8-4d4b-8189-53b787d9813f_1.png', TRUE, NOW()),
(3, 'Professional Grooming', 'Baths, nail trimming, styling, ear cleaning, and coat conditioning from gentle, certified grooming experts.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896181/f911c486-badb-4db4-9d87-471e79ad0437_1.png', TRUE, NOW()),
(4, 'Pet Pharmacy & Meds', 'Genuine prescription medicines, flea/tick preventatives, supplements, and skin treatments delivered with care.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896180/56e92693-e2f2-4587-9e7c-83e25d7b523f_1.png', TRUE, NOW()),
(5, 'Toys & Enrichment', 'Durable, safe play toys, agility essentials, and mental stimulation games designed for active, happy companions.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896179/46d5d20e-fe06-4b2f-afd0-c5fb7d7e10a3_1.png', TRUE, NOW()),
(6, 'Boarding & Daycare', 'Safe, temperature-controlled, playful suites with round-the-clock supervision while you are traveling.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896177/5041fe2b-47be-4fa0-b556-8d2c5926e54b_1.png', TRUE, NOW()),
(7, 'Pet Training & Behaviour', 'Positive-reinforcement puppy manners, obedience classes, and behavioural modification by accredited trainers.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896174/c1b76666-8097-4311-911e-8b51d62c4739_1.png', TRUE, NOW()),
(8, 'Pet Transport & Ambulance', 'Safe, climate-controlled door-to-door pet transport and emergency transit for appointments and relocations.', 'https://res.cloudinary.com/vphylrop/image/upload/v1788896169/8e9541cf-3bdc-4ed9-8979-e137acb9e77b_1.png', TRUE, NOW())
ON DUPLICATE KEY UPDATE icon_url = VALUES(icon_url), name = VALUES(name);

-- 5. SEED PHARMACY PRODUCTS
INSERT INTO products (id, name, description, price, category, stock_quantity, image_url, is_active, version, created_at, updated_at) VALUES
(1, 'Hill\'s Science Diet Adult Dry Dog Food', 'Clinically proven nutrition for optimal health and shiny coat. Formulated for adult canines with natural, high-grade chicken.', 2499.00, 'FOOD & NUTRITION', 45, 'https://res.cloudinary.com/vphylrop/image/upload/v1788895703/7e3d7c1c-875e-4c8b-aec1-305c49fc646b_1.png', TRUE, 0, NOW(), NOW()),
(2, 'Frontline Plus Flea & Tick Treatment', 'Fast-acting, long-lasting flea, tick, and chewing lice control for medium dogs (23-44 lbs). Waterproof and vet recommended.', 1299.00, 'FLEA & TICK', 80, 'https://res.cloudinary.com/vphylrop/image/upload/v1788895698/00b4a02b-168d-4be6-a4b4-29daad1e6881_1.png', TRUE, 0, NOW(), NOW()),
(3, 'Royal Canin Kitten Food', 'Supports natural immune defense and digestive development for young kittens between 4 to 12 months.', 1899.00, 'FOOD & NUTRITION', 35, 'https://res.cloudinary.com/vphylrop/image/upload/v1788895662/e17e6de5-60ad-4ad5-be39-9be97c37f09e_1.png', TRUE, 0, NOW(), NOW()),
(4, 'VetPlus Joint Care Supplement', 'Advanced joint support with Glucosamine, Chondroitin, and Omega-3 fatty acids for active and senior pets.', 1599.00, 'SUPPLEMENTS', 60, 'https://res.cloudinary.com/vphylrop/image/upload/v1788895661/2448c43e-adb1-4b95-8e66-6667e0f7c993_1.png', TRUE, 0, NOW(), NOW()),
(5, 'Virbac Epi-Otic Ear Cleaner', 'Non-irritating, soothing ear cleanser formulated to remove debris and excessive wax while inhibiting bacterial growth.', 799.00, 'GROOMING', 50, 'https://res.cloudinary.com/vphylrop/image/upload/v1788895659/68817e23-cd56-4e36-b8db-9acbdfa5545d_1.png', TRUE, 0, NOW(), NOW()),
(6, 'NexGard Spectra Flea & Tick Chews', 'Monthly beef-flavored chew that protects against fleas, ticks, heartworms, and intestinal worms in dogs.', 2199.00, 'MEDICATIONS', 40, 'https://res.cloudinary.com/vphylrop/image/upload/v1788896036/Screenshot_2026-09-09_010242.png', TRUE, 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), price = VALUES(price);

-- 6. SEED HEALTH TIPS ARTICLES
INSERT INTO articles (id, title, content, image_url, pet_type, is_featured, published_at) VALUES
(1, 'The Right Nutrition for a Healthier, Happier Pet', 'Proper nutrition forms the foundation of lifelong pet wellness. A balanced diet rich in clean proteins, essential fatty acids, vitamins, and minerals ensures healthy organ function, strong joints, and a lustrous coat. Avoid giving human table scraps that may contain toxic seasonings such as onion, garlic, or excessive sodium. Consult your vet to adjust caloric intake based on your pet’s age, breed, and daily activity level.', 'service_02_pet_food_rabbit_bowl', 'Dogs', TRUE, NOW()),
(2, 'Essential Vaccinations for Dogs and Cats', 'Core vaccinations shield your pet from severe, life-threatening viral infections like Parvovirus, Rabies, Distemper, and Feline Panleukopenia. Puppies and kittens require an initial booster series starting at 6-8 weeks of age, followed by annual or triennial revaccinations. Never skip scheduled boosters, especially if your pet socializes in public parks or daycare.', 'service_01_vet_care', 'Cats', TRUE, NOW()),
(3, 'Grooming Tips for a Cleaner and Healthier Pet', 'Regular grooming is far more than an aesthetic routine; it allows early detection of skin allergies, ticks, lumps, and ear infections. Daily brushing prevents painful matting, while regular nail trimming prevents musculoskeletal strain. Always use pet-formulated pH-balanced shampoos, and remember to dry your pet thoroughly after baths.', 'service_03_grooming_puppy_tub', 'Dogs', TRUE, NOW()),
(4, 'Common Signs Your Pet Might Be Sick', 'Animals frequently conceal pain or distress. Watch for subtle behavioural shifts such as loss of appetite, lethargy, sudden changes in water intake, coughing, vomiting, or reluctance to jump. If symptoms persist for over 24 hours, contact your veterinarian immediately.', 'service_04_pharmacy_cat_med', 'Dogs', FALSE, NOW()),
(5, 'How to Keep Your Indoor Cat Active and Engaged', 'Indoor felines need daily environmental enrichment to ward off boredom and obesity. Introduce interactive laser pointers, feather wands, cat trees with high perches, and puzzle treat dispensers. Just fifteen minutes of active play twice daily will keep your cat mentally stimulated and physically fit.', 'service_05_toys_kittens_play', 'Cats', FALSE, NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title);
