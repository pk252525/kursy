# Quick Start Guide - Training Platform

## 5-Minute Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Step 1: Database Setup (2 minutes)

```bash
# Start PostgreSQL service
# Windows: Services app or 'net start PostgreSQL15'
# macOS: 'brew services start postgresql'
# Linux: 'sudo systemctl start postgresql'

# Create database and tables
psql -U postgres -d postgres -a -f script.sql
```

### Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your config
# Copy these values:
cat > .env << EOF
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=training_platform
JWT_SECRET=dev-secret-key-12345
PORT=5000
STRIPE_SECRET_KEY=sk_test_123456
STRIPE_WEBHOOK_SECRET=whsec_test_123456
FRONTEND_URL=http://localhost:5173
EOF

# Start server
npm start

# You should see: "Server running on port 5000"
```

### Step 3: Frontend Setup (1 minute)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Browser opens automatically to http://localhost:5173
```

---

## First Test

### 1. Register Account
- Go to http://localhost:5173/login
- Click "Register"
- Enter email: `test@example.com`
- Enter password: `test123`
- Click "Register"

### 2. Add a Course (if Admin)
- You should be redirected to Dashboard
- For admin: manually update user role in database:
  ```sql
  UPDATE users SET role='ADMIN' WHERE email='test@example.com';
  ```
- Then visit http://localhost:5173/admin
- Click "Courses" tab
- Create a test course with:
  - Title: "React Basics"
  - Description: "Learn React"
  - Price: 29.99
  - Category: "Web Development"
  - Difficulty: "Beginner"
  - Instructor: "Test"

### 3. Purchase Course
- Go to Home page
- Click on the course
- Click "Add to Cart"
- Go to Cart
- Click "Checkout with Stripe"
- Use test card: `4242 4242 4242 4242`
- Exp: `12/25`, CVC: `123`

### 4. View Purchased Course
- Go to Dashboard
- Should see the course you purchased

---

## Useful Commands

### Backend

```bash
# Start dev server
npm start

# If port 5000 is in use (Windows):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# If port 5000 is in use (Mac/Linux):
lsof -i :5000
kill -9 <PID>
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Connect to database
psql -U postgres -d training_platform

# Useful queries:
SELECT * FROM users;
SELECT * FROM courses;
SELECT * FROM enrollments;

# Make user an admin:
UPDATE users SET role='ADMIN' WHERE id='<user-id>';

# Delete all data (reset):
DELETE FROM reviews;
DELETE FROM transactions;
DELETE FROM enrollments;
DELETE FROM cart_items;
DELETE FROM lessons;
DELETE FROM courses;
DELETE FROM discounts;
DELETE FROM users;
```

---

## File Structure

```
kursy/
├── backend/
│   ├── server.js          ← ALL backend logic here
│   ├── package.json
│   ├── .env               ← Your secrets (don't commit)
│   └── .env.example       ← Template for .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        ← ALL components here
│   │   ├── App.css        ← ALL styles here
│   │   ├── main.jsx
│   │   └── index.html
│   ├── package.json
│   ├── .env               ← Environment config (optional)
│   └── .env.example
│
├── script.sql             ← Database schema
├── readme.md              ← Setup instructions
├── API_DOCUMENTATION.md   ← API endpoint reference
└── DEPLOYMENT.md          ← Production deployment
```

---

## Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
# Windows: Services app → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Try connecting manually:
psql -U postgres -d training_platform
```

### "Port 5000 already in use"
```bash
# Windows:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# Or change PORT in backend/.env to 5001
```

### "Port 5173 already in use"
```bash
# Windows:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### "Stripe errors"
- Make sure `STRIPE_SECRET_KEY` starts with `sk_test_`
- Don't use fake keys, use real test keys from Stripe dashboard
- Test card must be `4242 4242 4242 4242` for success

### "CORS errors in browser"
- Backend: Check `FRONTEND_URL` in .env matches your frontend URL
- Frontend: Check `VITE_API_URL` in .env matches your backend URL (should be `http://localhost:5000/api`)

### "Token errors when logging in"
- Backend restart might be needed: `npm start`
- Clear browser localStorage: DevTools → Application → Clear All

---

## Next Steps

1. **Explore API**: Visit http://localhost:5000/api/courses
2. **Add Stripe**: Get real keys from https://stripe.com
3. **Customize**: Edit colors in `frontend/src/App.css`
4. **Deploy**: See DEPLOYMENT.md
5. **Database**: Add real courses in `script.sql`

---

## Support

- **API Reference**: See API_DOCUMENTATION.md
- **Deployment**: See DEPLOYMENT.md
- **Backend Code**: backend/server.js
- **Frontend Code**: frontend/src/App.jsx
- **Database Schema**: script.sql
