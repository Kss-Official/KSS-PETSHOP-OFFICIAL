-- Add bio column to vets table
ALTER TABLE vets ADD COLUMN bio TEXT;

-- Seed bio descriptions for existing vets without touching consultation_fee or other columns
UPDATE vets SET bio = 'Dr. Sarah Mitchell is a dedicated Veterinary Surgeon with over 12 years of experience specializing in orthopedic surgery, soft tissue procedures, and emergency trauma care.' WHERE id = 1 AND bio IS NULL;
UPDATE vets SET bio = 'Dr. James Carter is an experienced Veterinary Surgeon with 10+ years specializing in complex orthopedic cases and joint replacements.' WHERE id = 2 AND bio IS NULL;
UPDATE vets SET bio = 'Dr. Rahul Sharma is a compassionate General Veterinarian with 8+ years focusing on preventive care, wellness checks, and internal medicine.' WHERE id = 3 AND bio IS NULL;
UPDATE vets SET bio = 'Dr. Priya Patel specializes in dermatology and allergy management for pets with 7+ years of clinical experience.' WHERE id = 4 AND bio IS NULL;
UPDATE vets SET bio = 'Dr. Michael Chen is a senior feline specialist with 15 years of clinical practice in cat health and geriatric care.' WHERE id = 5 AND bio IS NULL;
UPDATE vets SET bio = 'Dr. Ananya Roy is an exotic pet and avian medicine specialist with 6 years of clinical expertise.' WHERE id = 6 AND bio IS NULL;
