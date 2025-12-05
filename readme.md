# Training Platform

Kompletna platforma do zarzdzania kursami online z autentykacj JWT i patnociami Stripe.

## Technologie

- **Frontend**: React 19 + React Router + Axios
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API

## Struktura

```
kursy/
+¦¦ backend/
-   +¦¦ server.js         # Wszystkie API endpoints
-   +¦¦ package.json
-   L¦¦ .env
+¦¦ frontend/
-   +¦¦ src/
-   -   +¦¦ App.jsx      # Wszystkie komponenty
-   -   +¦¦ App.css
-   -   L¦¦ main.jsx
-   +¦¦ package.json
-   L¦¦ .env
+¦¦ script.sql           # Inicjalizacja bazy
L¦¦ README.md
```

## Setup

### 1. Baza danych

```bash
psql -U postgres -d postgres -a -f script.sql
```

### 2. Backend

```bash
cd backend
npm install
# Utwórz .env z zmiennymi (patrz niej)
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Zmienne .env (Backend)

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=training_platform
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Auth
- POST /api/auth/register - Rejestracja
- POST /api/auth/login - Logowanie

### Courses
- GET /api/courses - Lista kursów
- GET /api/courses/:id - Szczegóy
- POST /api/courses - Tworzenie (admin)
- PUT /api/courses/:id - Edycja (admin)
- DELETE /api/courses/:id - Usuwanie (admin)

### Cart
- GET /api/cart - Zawarto
- POST /api/cart - Dodaj
- DELETE /api/cart/:courseId - Usu

### Payment
- POST /api/checkout - Sesja Stripe
- POST /api/webhook/stripe - Webhook

### Enrollments
- GET /api/enrollments - Moje kursy

### Reviews
- POST /api/reviews - Dodaj recenzj

### Discounts
- POST /api/discounts/validate - Sprawd kod

### Admin
- GET /api/admin/users - Lista uytkowników
- DELETE /api/admin/users/:userId - Usu uytkownika

### Profile
- GET /api/profile - Moje dane

## Funkcjonalnoci

? Autentykacja JWT
? Zarzdzanie kursami (CRUD)
? Koszyk i checkout
? Patnoci Stripe
? Role-based access (CUSTOMER/ADMIN)
? Recenzje kursów
? Kody rabatowe
? Paginacja i filtry
? Responsive design

## Testowanie

**Admin:**
- Email: admin@example.com
- Password: password123

**Stripe Test Card:**
- 4242 4242 4242 4242 (sukces)
- 4000 0000 0000 0002 (bd)
- Exp: 12/25, CVC: 123

## Deployment

**Backend** › Heroku
**Frontend** › Vercel/Netlify

## Notes

- Minimalna liczba plików
- Jeden plik: server.js (backend), App.jsx (frontend)
- PostgreSQL z penym schematem
- JWT tokens: 7 dni

