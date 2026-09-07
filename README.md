# Pawsitive Pet Shop & Clinic Management System

Full-stack pet clinic management system containing both the Spring Boot backend and React + Vite frontend.

## Project Structure

```text
.
├── backend/    # Spring Boot 3.x REST API Backend (Java 17, JPA, Spring Security, JWT)
└── frontend/   # React + TypeScript + Vite Frontend
```

---

## Backend (`backend`)

### Technology Stack
- **Language & Framework:** Java 17, Spring Boot 3
- **Security:** Spring Security, JWT Authentication, BCrypt Password Hashing
- **Database / Data:** Spring Data JPA, H2 / MySQL
- **Build Tool:** Maven

### Core Modules & API Surfaces
- **Auth (`/api/auth/**`):** User registration, login, JWT issuance
- **Customer Features:** Browse products, cart & checkout, order history, pet management, appointments, vet search, health tips
- **Admin Features (`/api/admin/**`):** Product CRUD, order status updates, appointment management, medical records, vet management, health tip article CRUD

---

## Frontend (`frontend`)

### Technology Stack
- **Framework:** React, TypeScript, Vite
- **Styling:** CSS
- **Routing & State:** React Router, React Query / Axios

---

## Getting Started

### 1. Running the Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
