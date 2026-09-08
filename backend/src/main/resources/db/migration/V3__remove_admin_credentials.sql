-- =============================================================================
-- Migration V3: Remove Admin Credentials from Database
-- =============================================================================

DELETE FROM users WHERE email = 'admin@pawfectly.com' OR role = 'ADMIN';
