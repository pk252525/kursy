require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'training_platform',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============ MIDDLEWARE ============
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, 'CUSTOMER']
    );
    
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ COURSE ROUTES ============
app.get('/api/courses', async (req, res) => {
  try {
    const { category, difficulty, sort } = req.query;
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }
    if (difficulty) {
      query += ' AND difficulty = $' + (params.length + 1);
      params.push(difficulty);
    }
    
    if (sort === 'price') query += ' ORDER BY price_cents ASC';
    else if (sort === 'rating') query += ' ORDER BY id DESC'; // placeholder
    else query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows.map(row => ({ ...row, price: row.price_cents / 100 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    const lessons = await pool.query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_order', [req.params.id]);
    const reviews = await pool.query('SELECT * FROM reviews WHERE course_id = $1', [req.params.id]);
    
    if (!course.rows[0]) return res.status(404).json({ error: 'Course not found' });
    
    res.json({
      ...course.rows[0],
      price: course.rows[0].price_cents / 100,
      lessons: lessons.rows,
      reviews: reviews.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, price, category, difficulty, instructor } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO courses (title, description, price_cents, category, difficulty, instructor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, Math.round(price * 100), category, difficulty, instructor]
    );
    
    res.status(201).json({ ...result.rows[0], price: result.rows[0].price_cents / 100 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, price, category, difficulty, instructor } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE courses SET title=$1, description=$2, price_cents=$3, category=$4, difficulty=$5, instructor=$6, updated_at=NOW() WHERE id=$7 RETURNING *',
      [title, description, Math.round(price * 100), category, difficulty, instructor, req.params.id]
    );
    
    if (!result.rows[0]) return res.status(404).json({ error: 'Course not found' });
    res.json({ ...result.rows[0], price: result.rows[0].price_cents / 100 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CART ROUTES ============
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, ci.added_at FROM courses c 
       INNER JOIN cart_items ci ON c.id = ci.course_id 
       WHERE ci.user_id = $1 ORDER BY ci.added_at DESC`,
      [req.user.userId]
    );
    
    res.json(result.rows.map(row => ({ ...row, price: row.price_cents / 100 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { courseId } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO cart_items (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.userId, courseId]
    );
    
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cart/:courseId', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND course_id = $2',
      [req.user.userId, req.params.courseId]
    );
    
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PAYMENT ROUTES ============
// Bezpośrednie przypisanie kursów do użytkownika (bez Stripe)
app.post('/api/checkout/direct', authMiddleware, async (req, res) => {
  console.log('=== CHECKOUT DIRECT ===');
  console.log('User ID:', req.user.userId);
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Pobierz kursy z koszyka
    const cartItems = await client.query(
      `SELECT c.* FROM courses c 
       INNER JOIN cart_items ci ON c.id = ci.course_id 
       WHERE ci.user_id = $1`,
      [req.user.userId]
    );
    
    console.log('Znaleziono kursów w koszyku:', cartItems.rows.length);
    
    if (cartItems.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('Koszyk jest pusty!');
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Zapisz użytkownika na każdy kurs
    for (const course of cartItems.rows) {
      console.log(`Przypisywanie kursu: ${course.title} (${course.id})`);
      
      // Dodaj enrollment
      const enrollResult = await client.query(
        'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING RETURNING *',
        [req.user.userId, course.id]
      );
      console.log('Enrollment dodany:', enrollResult.rows.length > 0 ? 'TAK' : 'Już istniał');
      
      // Zapisz transakcję jako "succeeded"
      await client.query(
        `INSERT INTO transactions (user_id, course_id, amount_cents, status)
         VALUES ($1, $2, $3, 'succeeded')`,
        [req.user.userId, course.id, course.price_cents]
      );
      console.log('Transakcja zapisana');
    }
    
    // Wyczyść koszyk
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.userId]);
    console.log('Koszyk wyczyszczony');
    
    await client.query('COMMIT');
    console.log('=== SUKCES - Przypisano', cartItems.rows.length, 'kursów ===');
    res.json({ message: 'Kursy zostały przypisane do Twojego konta', enrolledCourses: cartItems.rows.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('BŁĄD podczas checkout:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Stripe checkout (opcjonalny, zachowany dla kompatybilności)
app.post('/api/checkout', authMiddleware, async (req, res) => {
  try {
    const cartItems = await pool.query(
      `SELECT c.* FROM courses c 
       INNER JOIN cart_items ci ON c.id = ci.course_id 
       WHERE ci.user_id = $1`,
      [req.user.userId]
    );
    
    if (cartItems.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const lineItems = cartItems.rows.map(course => ({
      price_data: {
        currency: 'usd',
        product_data: { name: course.title, description: course.description },
        unit_amount: course.price_cents
      },
      quantity: 1
    }));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
      metadata: { userId: req.user.userId, courseIds: cartItems.rows.map(c => c.id).join(',') }
    });
    
    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock'
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, courseIds } = session.metadata;
      const courses = courseIds.split(',');
      
      for (const courseId of courses) {
        // Record transaction
        await pool.query(
          `INSERT INTO transactions (user_id, course_id, amount_cents, status, stripe_checkout_session_id)
           SELECT $1, $2, price_cents, 'succeeded', $3 FROM courses WHERE id = $2`,
          [userId, courseId, session.id]
        );
        
        // Enroll user in course
        await pool.query(
          'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, courseId]
        );
      }
      
      // Clear cart
      await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ ENROLLMENT ROUTES ============
app.get('/api/enrollments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, e.enrolled_at FROM courses c 
       INNER JOIN enrollments e ON c.id = e.course_id 
       WHERE e.user_id = $1 ORDER BY e.enrolled_at DESC`,
      [req.user.userId]
    );
    
    res.json(result.rows.map(row => ({ ...row, price: row.price_cents / 100 })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN ROUTES ============
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.userId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ REVIEWS ROUTES ============
app.post('/api/reviews', authMiddleware, async (req, res) => {
  const { courseId, rating, comment } = req.body;
  
  try {
    // Check if user enrolled in course
    const enrolled = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.userId, courseId]
    );
    
    if (!enrolled.rows[0]) {
      return res.status(403).json({ error: 'Must be enrolled to review' });
    }
    
    const result = await pool.query(
      'INSERT INTO reviews (user_id, course_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, course_id) DO UPDATE SET rating=$3, comment=$4 RETURNING *',
      [req.user.userId, courseId, rating, comment]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ DISCOUNT ROUTES ============
app.post('/api/discounts/validate', async (req, res) => {
  const { code, coursePrice } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM discounts WHERE code = $1 AND active = true AND (expires_at IS NULL OR expires_at > NOW()) AND (max_redemptions IS NULL OR redemptions < max_redemptions)',
      [code]
    );
    
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Invalid discount code' });
    }
    
    const discount = result.rows[0];
    let finalPrice = coursePrice;
    
    if (discount.percentage) {
      finalPrice = coursePrice * (1 - discount.percentage / 100);
    } else if (discount.amount_cents) {
      finalPrice = Math.max(0, coursePrice - discount.amount_cents / 100);
    }
    
    res.json({ discount: discount.percentage || discount.amount_cents / 100, finalPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ PROFILE ROUTES ============
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, created_at FROM users WHERE id = $1', [req.user.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
