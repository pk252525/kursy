# Architecture & Design - Training Platform

## Project Philosophy

**Minimalist Design**: All application logic in 2 main files
- **Backend**: `server.js` (1 file with 27 REST endpoints)
- **Frontend**: `App.jsx` (1 file with 6 components + auth context)

This approach prioritizes:
- ✅ Easy to understand codebase
- ✅ No complex folder structures
- ✅ Fast development
- ✅ Minimal dependencies
- ✅ Easy deployment

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│                  (React Application)                    │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴────────────────┐
         │                            │
    HTTP/HTTPS                   Stripe API
         │                            │
         ↓                            ↓
┌────────────────────┐        ┌──────────────┐
│   Express Server   │        │  Stripe      │
│  (Port 5000)       │        │  Checkout    │
│                    │        └──────────────┘
│  • Auth Routes     │
│  • Course API      │
│  • Cart API        │
│  • Payment API     │
│  • Admin API       │
│  • Webhooks        │
└────────┬───────────┘
         │
         │ TCP/IP
         │
         ↓
┌────────────────────┐
│   PostgreSQL DB    │
│  (Port 5432)       │
│                    │
│  • Users           │
│  • Courses         │
│  • Lessons         │
│  • Enrollments     │
│  • Transactions    │
│  • Cart Items      │
│  • Reviews         │
│  • Discounts       │
└────────────────────┘
```

---

## Data Flow

### 1. User Registration Flow

```
User Input (email, password)
    ↓
Frontend: POST /api/auth/register
    ↓
Backend: server.js → Hash password (bcrypt)
    ↓
Database: INSERT into users table
    ↓
Backend: Generate JWT token
    ↓
Frontend: Store token in localStorage
    ↓
Redirect to Dashboard
```

### 2. Course Purchase Flow

```
User clicks "Checkout"
    ↓
Frontend: POST /api/checkout
    ↓
Backend: Fetch cart items from database
    ↓
Backend: Create Stripe checkout session
    ↓
Frontend: Redirect to Stripe checkout page
    ↓
User enters card details
    ↓
Stripe: Process payment
    ↓
Stripe: Send webhook to backend
    ↓
Backend: Verify webhook signature
    ↓
Backend: Create transaction record
    ↓
Backend: Create enrollment record
    ↓
Backend: Clear user's cart
    ↓
Frontend: Show success message
    ↓
Frontend: Redirect to Dashboard
```

### 3. Admin Course Creation Flow

```
Admin fills course form
    ↓
Frontend: POST /api/courses
    ↓
Backend: Verify admin role (middleware)
    ↓
Backend: Validate input data
    ↓
Database: INSERT into courses table
    ↓
Frontend: Add to courses list
    ↓
Display success message
```

---

## Backend Architecture (server.js)

### Layers

```
┌─────────────────────────────────────┐
│      Express Middleware Layer       │
│  • CORS                             │
│  • JSON parsing                     │
│  • Request logging                  │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│    Authentication Layer             │
│  • JWT verification                 │
│  • Token decoding                   │
│  • Role checking                    │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│    Business Logic Layer             │
│  • Route handlers                   │
│  • Data validation                  │
│  • Stripe integration               │
│  • Webhook handling                 │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│    Data Access Layer                │
│  • PostgreSQL queries               │
│  • Connection pooling               │
│  • Transaction handling             │
└─────────────────────────────────────┘
```

### API Endpoint Categories

**Authentication (2)**
```
POST   /api/auth/register
POST   /api/auth/login
```

**Courses (5)**
```
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

**Cart (3)**
```
GET    /api/cart
POST   /api/cart
DELETE /api/cart/:courseId
```

**Payment (2)**
```
POST   /api/checkout
POST   /api/webhook/stripe
```

**Enrollments (1)**
```
GET    /api/enrollments
```

**Reviews (1)**
```
POST   /api/reviews
```

**Discounts (1)**
```
POST   /api/discounts/validate
```

**Admin (2)**
```
GET    /api/admin/users
DELETE /api/admin/users/:userId
```

**Profile (1)**
```
GET    /api/profile
```

---

## Frontend Architecture (App.jsx)

### Component Structure

```
AppWrapper (Router + AuthProvider)
    ├── AuthProvider (Context)
    │   └── AppContent
    │       ├── Navbar
    │       ├── Main Routes
    │       │   ├── Home (public)
    │       │   ├── CourseDetail (public)
    │       │   ├── Login (public)
    │       │   ├── Cart (protected)
    │       │   ├── Dashboard (protected)
    │       │   └── AdminPanel (protected + admin)
    │       └── Footer
    └── Error handling
```

### Component Details

| Component | Lines | Purpose | Protected |
|-----------|-------|---------|-----------|
| **Home** | ~80 | List courses with filters/pagination | No |
| **CourseDetail** | ~60 | Show single course + lessons + reviews | No |
| **Login** | ~60 | Auth form + register toggle | No |
| **Dashboard** | ~50 | User's enrolled courses | Yes |
| **Cart** | ~100 | Shopping cart + checkout + discounts | Yes |
| **AdminPanel** | ~150 | Course & user management | Admin |

### State Management

```
AuthContext
├── user (object)
│   ├── id
│   ├── email
│   ├── role (CUSTOMER/ADMIN)
│   └── token
├── token (string - JWT)
├── setUser (function)
└── setToken (function)

Component State (useState)
├── Home: courses, filters, page
├── CourseDetail: course, loading
├── Login: email, password, isLogin, loading
├── Dashboard: enrollments, loading
├── Cart: cartItems, discount, loading
└── AdminPanel: courses, users, tab, formData
```

---

## Database Schema

### Relationships Diagram

```
users (1) ─────────┬─────── (M) enrollments ───────┬─────── (1) courses
          ─────────├─────── (M) cart_items ────────┤
          ─────────├─────── (M) transactions ──────┤
          ─────────└─────── (M) reviews ──────────┘
                                          │
                                          └─(1)─ lessons

discounts (many) → (referenced in checkout logic)
```

### Table Statistics

| Table | Rows Purpose | Key Fields | Relations |
|-------|---|---|---|
| **users** | Authentication | id, email, password_hash, role | 1:M with enrollments, transactions, reviews |
| **courses** | Course catalog | id, title, price_cents, category | 1:M with lessons, enrollments, reviews |
| **lessons** | Course content | id, course_id, title, lesson_order | M:1 with courses |
| **enrollments** | User purchases | id, user_id, course_id | M:1 with users and courses |
| **transactions** | Payment history | id, user_id, course_id, amount | M:1 with users and courses |
| **cart_items** | Shopping cart | id, user_id, course_id | M:1 with users and courses |
| **reviews** | User feedback | id, user_id, course_id, rating | M:1 with users and courses |
| **discounts** | Promotions | id, code, percentage/amount | Referenced in logic |

---

## Security Architecture

### Authentication Flow

```
┌─ Request ──┐
│            │
├─ Check token?
│   │
│   ├─ YES: Verify signature
│   │   ├─ Valid: Decode payload → attach to req.user
│   │   └─ Invalid: Return 401
│   │
│   └─ NO: Return 401 (for protected routes)
│
├─ Check role?
│   │
│   ├─ ADMIN required: Check req.user.role
│   │   ├─ ADMIN: Continue
│   │   └─ Other: Return 403
│   │
│   └─ Continue
│
└─ Execute handler
```

### Password Security

```
User Registration:
  Input: plaintext password
    ↓
  bcrypt.hash(password, 10)
    ↓
  Store hashed password (never store plaintext)

User Login:
  Input: plaintext password
    ↓
  bcrypt.compare(input, stored_hash)
    ↓
  Match? → Generate JWT
  No match? → Return 401
```

### Token Format

```
JWT Token Structure:
header.payload.signature

Payload (decoded):
{
  userId: "uuid",
  email: "user@example.com",
  role: "CUSTOMER" or "ADMIN",
  iat: 1234567890,
  exp: 1234567890
}

Expiry: 7 days (604,800 seconds)
```

---

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (npm run dev)
│   └── http://localhost:5173
├── Backend (npm start)
│   └── http://localhost:5000
└── Database (PostgreSQL)
    └── localhost:5432
```

### Production (Heroku + Vercel)
```
┌────────────────────────────────────────┐
│         Vercel CDN Network             │
│  Frontend: https://app.vercel.app      │
└─────────────┬──────────────────────────┘
              │ API calls
              ↓
┌────────────────────────────────────────┐
│         Heroku Dyno                    │
│  Backend: https://api.herokuapp.com    │
└─────────────┬──────────────────────────┘
              │ Database queries
              ↓
┌────────────────────────────────────────┐
│    Heroku PostgreSQL Database          │
│  Managed database service              │
└────────────────────────────────────────┘
```

---

## Performance Considerations

### Frontend Optimization
- ✅ Single-page application (SPA)
- ✅ Client-side routing (no full page reloads)
- ✅ Lazy component rendering
- ✅ React hooks for state management
- ⚠️ Consider: Code splitting for large bundles

### Backend Optimization
- ✅ Connection pooling (pg library)
- ✅ JWT caching in middleware
- ✅ Database indexes on UUIDs (primary keys)
- ⚠️ Consider: Redis caching for course listings
- ⚠️ Consider: Rate limiting on auth endpoints

### Database Optimization
- ✅ UUID primary keys
- ✅ UNIQUE constraints for performance
- ✅ Foreign key indexes
- ✅ Cascading deletes
- ⚠️ Consider: Indexing on frequently filtered columns

---

## Scalability Path

### Current (Monolithic)
- Single server instance
- Single database instance
- Good for: MVP, learning, < 1000 concurrent users

### Scale Step 1: Separate Database
- Move PostgreSQL to managed service (RDS/Heroku PostgreSQL)
- Keep single server

### Scale Step 2: Multiple Servers
- Load balance API across multiple Heroku dynos
- Use sticky sessions for JWT

### Scale Step 3: Microservices
- Course service (separate API)
- Payment service (separate handling)
- User service (separate API)
- Shared database or service-specific databases

### Scale Step 4: Distributed Architecture
- GraphQL API instead of REST
- Message queues (Redis/RabbitMQ)
- Caching layer (Redis)
- CDN for static assets
- Search optimization (Elasticsearch)

---

## Code Quality

### Backend (server.js)
- ~600 lines
- Error handling on all endpoints
- Input validation
- JWT middleware
- Role-based access control
- Database transaction safety

### Frontend (App.jsx)
- ~570 lines
- Component composition
- Context API for state
- Conditional rendering
- Error boundaries ready
- Responsive design

### Database (script.sql)
- 8 normalized tables
- Proper constraints
- Cascading deletes
- Unique constraints
- Foreign key relationships

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.x | UI framework |
| | React Router | 7.x | Navigation |
| | Axios | 1.x | HTTP client |
| **Backend** | Node.js | 18+ | Runtime |
| | Express | 5.x | Web framework |
| | bcrypt | 6.x | Password hashing |
| | jsonwebtoken | 9.x | JWT tokens |
| **Database** | PostgreSQL | 12+ | Relational DB |
| | pg | 8.x | DB driver |
| **Payment** | Stripe | 15.x | Payment processing |
| **Build** | Vite | 7.x | Frontend build tool |
| **Dev** | npm | 8+ | Package manager |

---

## Next Steps for Enhancement

1. **Testing**: Add Jest + RTL for frontend, Supertest for backend
2. **Monitoring**: Add Sentry for error tracking
3. **Analytics**: Track user behavior
4. **Caching**: Redis for frequently accessed data
5. **Search**: Full-text search for courses
6. **Notifications**: Email/SMS for purchases
7. **Mobile App**: React Native version
8. **GraphQL**: Consider GraphQL instead of REST
9. **WebSockets**: Real-time updates
10. **Internationalization**: Multi-language support
