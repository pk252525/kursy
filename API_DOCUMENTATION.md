# Training Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CUSTOMER"
  },
  "token": "jwt_token"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CUSTOMER"
  },
  "token": "jwt_token"
}
```

---

## Course Endpoints

### Get All Courses
```http
GET /courses?category=Web%20Development&difficulty=Beginner&sort=price
```

**Query Parameters:**
- `category` - Filter by category
- `difficulty` - Filter by difficulty (Beginner, Intermediate, Advanced)
- `sort` - Sort by: price, rating

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "React Basics",
    "description": "Learn React fundamentals...",
    "price": 49.99,
    "category": "Web Development",
    "difficulty": "Beginner",
    "instructor": "John Doe",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

### Get Course Details
```http
GET /courses/{courseId}
```

**Response (200):**
```json
{
  "id": "uuid",
  "title": "React Basics",
  "description": "Learn React fundamentals...",
  "price": 49.99,
  "category": "Web Development",
  "difficulty": "Beginner",
  "instructor": "John Doe",
  "lessons": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "title": "Introduction to React",
      "content_url": "https://...",
      "lesson_order": 1,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "reviews": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "course_id": "uuid",
      "rating": 5,
      "comment": "Great course!",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Create Course (Admin only)
```http
POST /courses
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "React Basics",
  "description": "Learn React fundamentals...",
  "price": 49.99,
  "category": "Web Development",
  "difficulty": "Beginner",
  "instructor": "John Doe"
}
```

**Response (201):** Course object

### Update Course (Admin only)
```http
PUT /courses/{courseId}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "React Basics",
  "description": "Updated description...",
  "price": 59.99,
  "category": "Web Development",
  "difficulty": "Intermediate",
  "instructor": "John Doe"
}
```

**Response (200):** Updated course object

### Delete Course (Admin only)
```http
DELETE /courses/{courseId}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "message": "Course deleted"
}
```

---

## Shopping Cart Endpoints

### Get Cart Items
```http
GET /cart
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "React Basics",
    "price": 49.99,
    "description": "...",
    "added_at": "2025-01-01T00:00:00Z"
  }
]
```

### Add to Cart
```http
POST /cart
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "courseId": "uuid"
}
```

**Response (201):**
```json
{
  "message": "Added to cart"
}
```

### Remove from Cart
```http
DELETE /cart/{courseId}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "message": "Removed from cart"
}
```

---

## Payment Endpoints

### Create Checkout Session
```http
POST /checkout
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (200):**
```json
{
  "sessionId": "cs_test_..."
}
```

*Use this sessionId with Stripe.redirectToCheckout()*

### Stripe Webhook
```http
POST /webhook/stripe
Content-Type: application/json
Stripe-Signature: <signature>

{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": {
        "userId": "uuid",
        "courseIds": "uuid,uuid"
      }
    }
  }
}
```

**Response (200):**
```json
{
  "received": true
}
```

---

## Enrollment Endpoints

### Get My Courses
```http
GET /enrollments
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "React Basics",
    "description": "...",
    "price": 49.99,
    "enrolled_at": "2025-01-01T00:00:00Z"
  }
]
```

---

## Review Endpoints

### Add/Update Course Review
```http
POST /reviews
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "courseId": "uuid",
  "rating": 5,
  "comment": "Great course!"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "course_id": "uuid",
  "rating": 5,
  "comment": "Great course!",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## Discount Endpoints

### Validate Discount Code
```http
POST /discounts/validate
Content-Type: application/json

{
  "code": "SAVE20",
  "coursePrice": 49.99
}
```

**Response (200):**
```json
{
  "discount": 10.00,
  "finalPrice": 39.99
}
```

**Response (404):**
```json
{
  "error": "Invalid discount code"
}
```

---

## Admin Endpoints

### Get All Users
```http
GET /admin/users
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CUSTOMER",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### Delete User
```http
DELETE /admin/users/{userId}
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200):**
```json
{
  "message": "User deleted"
}
```

---

## Profile Endpoints

### Get My Profile
```http
GET /profile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

## Error Handling

All errors follow this format:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "No token" or "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "error": "Admin access required" or "Must be enrolled to review"
}
```

**404 Not Found:**
```json
{
  "error": "Course not found" or "Invalid discount code"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Courses
```bash
curl http://localhost:5000/api/courses
```

### Get Courses with Filters
```bash
curl "http://localhost:5000/api/courses?category=Web%20Development&difficulty=Beginner&sort=price"
```

### Add to Cart (replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"uuid"}'
```

### Create Course (Admin only)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"React Basics",
    "description":"Learn React",
    "price":49.99,
    "category":"Web Development",
    "difficulty":"Beginner",
    "instructor":"John Doe"
  }'
```
