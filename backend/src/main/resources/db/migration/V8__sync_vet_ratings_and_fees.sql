-- Migration V8: Sync vet ratings with real vet_reviews and set fees to 500-700 INR based on experience

-- 1. Sync reviews_count and rating from vet_reviews table
UPDATE vets v SET
  v.reviews_count = (SELECT COUNT(*) FROM vet_reviews vr WHERE vr.vet_id = v.id),
  v.rating = (SELECT ROUND(AVG(vr.rating), 1) FROM vet_reviews vr WHERE vr.vet_id = v.id);

-- 2. Clear rating for vets with 0 reviews so they correctly display "No reviews yet"
UPDATE vets SET rating = NULL WHERE reviews_count = 0 OR reviews_count IS NULL;

-- 3. Set consultation fees in the range of ₹500 to ₹700 based on experience
UPDATE vets SET consultation_fee = 700.0 WHERE experience_years >= 8;
UPDATE vets SET consultation_fee = 600.0 WHERE experience_years >= 4 AND experience_years < 8;
UPDATE vets SET consultation_fee = 500.0 WHERE experience_years < 4 OR experience_years IS NULL;
