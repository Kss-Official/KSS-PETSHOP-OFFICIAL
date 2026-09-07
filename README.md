# Pawsitive Backend

Spring Boot backend for the Pawsitive pet clinic management system, built from the
System Design Documentation. Implements both the Customer and Admin API surfaces
against a shared, role-gated (JWT) REST API.

## What's implemented

- **Auth**: register/login, BCrypt password hashing, JWT issuance (`/api/auth/**`)
- **Customer**: products (read), cart, checkout, orders, pets, appointments, vet search, health tips
- **Admin**: product CRUD, order status updates, appointment status updates,
  medical records, customer list, vet management, article (health tips) CRUD
- **Security**: stateless JWT filter, role-based access (`/api/admin/**` -> `ROLE_ADMIN`),
  public browsing for products/vets/articles, ownership checks on pets/cart/orders/appointments
  (data isolation)
- **Data**: JPA entities matching the ERD (`users`, `pets`, `vets`, `appointments`,
  `medical_records`, `products`, `cart_items`, `orders`, `order_items`), plus
  `articles` added for Health Tips (see below)

## Additions beyond the original system design doc

The frontend requirements doc (Find a Vet + Health Tips pages) needs data the
original ERD/API design didn't cover. These were added to close that gap:

- **`Vet` entity** gained `photoUrl`, `clinicName`, `address`, `rating`, `latitude`,
  `longitude` — needed for vet cards and the map. Original ERD only had `name` + `specialization`.
- **`GET /api/vets`** (public, with `?specialization=` and `?location=` query params) and
  **`GET /api/vets/{id}`** — the original doc only exposed vets via `/api/admin/vets`, with
  no customer-facing way to browse/search them.
- **`Article` entity + `/api/articles/**`** (public: search by `petType`/`category`,
  `/featured`, `/latest`; admin: full CRUD under `/api/admin/articles`) — Health Tips
  has no equivalent anywhere in the original ERD or API design; this is entirely new.
- **CORS/security**: `/api/vets/**` and `/api/articles/**` GET requests are public,
  matching how `/api/products/**` GET already worked, since customers browse
  Find a Vet and Health Tips before logging in.

## Not implemented yet (flagged, not forgotten)

- No seed data / migration tool (using `ddl-auto: update` for now — swap to
  Flyway once the schema stabilizes)
- The "Services" category grid (Vet Care, Grooming, Boarding, etc.) and the
  Pharmacy section from the mockups still have no backend model — the frontend
  doc doesn't specify their data shape either, so this is likely static/marketing
  content on the frontend for now rather than something the backend serves.
  Flag this before building those sections.
- No admin "create customer / promote to admin" endpoint — seed your first
  admin directly in the DB (see below) since registration always creates a CUSTOMER
- Appointment double-booking prevention is a listed "Future Enhancement" in the
  doc, not built here
- No pagination/infinite scroll on vets, products, or articles yet — the
  non-functional requirements call for it as data grows; all three currently
  return full lists

## Running locally

1. Install MySQL locally (or point at a managed instance - RDS, PlanetScale, etc.).
   `createDatabaseIfNotExist=true` in the JDBC URL means you don't need to manually
   create the `pawsitive` schema first for local dev.
2. Set env vars (or edit `application.yml` directly for local dev):
   ```
   DB_URL=jdbc:mysql://localhost:3306/pawsitive?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
   DB_USERNAME=root
   DB_PASSWORD=<password>
   JWT_SECRET=<a long random base64 string, e.g. `openssl rand -base64 64`>
   CORS_ORIGINS=http://localhost:3000
   ```
3. `mvn spring-boot:run`
4. API is available at `http://localhost:8080/api/...`

## Creating your first admin user

Registration (`POST /api/auth/register`) always creates a `CUSTOMER`. To get an
admin, register normally, then flip their role directly in MySQL:

```sql
update users set role = 'ADMIN' where email = 'you@example.com';
```

## Project layout

```
src/main/java/com/pawsitive/backend/
├── entity/       JPA entities + enums, matching the ERD
├── repository/   Spring Data JPA repositories
├── dto/          Request/response DTOs
├── service/      Business logic (ownership checks, stock decrement on checkout, etc.)
├── controller/   Customer-facing REST endpoints
├── controller/admin/  Admin-only REST endpoints (require ROLE_ADMIN)
├── security/     JWT util, auth filter, UserDetailsService, current-user helper
├── config/       SecurityConfig (routes, CORS, password encoder)
└── exception/    Custom exceptions + a global @RestControllerAdvice handler
```
