import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api';

// ========== AUTH CONTEXT ==========
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ========== COMPONENTS ==========
function Home() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ category: '', difficulty: '', sort: '' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const { token } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams(filters);
      const { data } = await axios.get(`${API}/courses?${params}`);
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const addToCart = async (courseId) => {
    if (!token) return alert('Please login first');
    try {
      await axios.post(`${API}/cart`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  const paginatedCourses = courses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  return (
    <div className="home">
      <div className="filters">
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Mobile">Mobile</option>
        </select>
        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
          <option value="">Newest</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="courses-grid">
        {paginatedCourses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p className="description">{course.description}</p>
            <p className="meta">{course.category} • {course.difficulty}</p>
            <p className="instructor">by {course.instructor}</p>
            <p className="price">${course.price}</p>
            <div className="actions">
              <Link to={`/course/${course.id}`} className="btn btn-primary">View Details</Link>
              <button onClick={() => addToCart(course.id)} className="btn btn-secondary">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)} className={p === page ? 'active' : ''}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${API}/courses/${id}`);
      setCourse(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!token) return alert('Please login first');
    try {
      await axios.post(`${API}/cart`, { courseId: id }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="meta">{course.category} • {course.difficulty} • by {course.instructor}</p>
      </div>
      <div className="course-body">
        <div className="course-main">
          <h3>Description</h3>
          <p>{course.description}</p>
          <h3>Lessons ({course.lessons?.length || 0})</h3>
          <ul>
            {course.lessons?.map((lesson, i) => (
              <li key={lesson.id}>{i + 1}. {lesson.title}</li>
            ))}
          </ul>
          <h3>Reviews ({course.reviews?.length || 0})</h3>
          {course.reviews?.map(review => (
            <div key={review.id} className="review">
              <p><strong>Rating: {review.rating}/5</strong></p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="course-sidebar">
          <p className="price">${course.price}</p>
          <button onClick={addToCart} className="btn btn-primary btn-large">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await axios.post(`${API}${endpoint}`, { email, password });
      setToken(data.token);
      setUser(data.user);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={loading}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="link-btn">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await axios.get(`${API}/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
      setEnrollments(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h2>My Courses</h2>
      {enrollments.length === 0 ? (
        <p>No courses yet. <Link to="/">Browse courses</Link></p>
      ) : (
        <div className="courses-grid">
          {enrollments.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to={`/course/${course.id}`} className="btn btn-primary">Access Course</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await axios.delete(`${API}/cart/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(cartItems.filter(c => c.id !== courseId));
    } catch (err) {
      alert('Error removing from cart');
    }
  };

  const validateDiscount = async () => {
    try {
      const total = cartItems.reduce((sum, c) => sum + c.price, 0);
      const { data } = await axios.post(`${API}/discounts/validate`, { code: discountCode, coursePrice: total });
      setDiscount(data);
    } catch (err) {
      alert('Invalid discount code');
    }
  };

  const handleCheckout = async () => {
    try {
      const { data } = await axios.post(`${API}/checkout`, {}, { headers: { Authorization: `Bearer ${token}` } });
      window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
    } catch (err) {
      alert('Error processing checkout');
    }
  };

  const total = cartItems.reduce((sum, c) => sum + c.price, 0);
  const finalTotal = discount ? discount.finalPrice : total;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty. <Link to="/">Continue shopping</Link></p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(course => (
              <div key={course.id} className="cart-item">
                <div>
                  <h4>{course.title}</h4>
                  <p>${course.price}</p>
                </div>
                <button onClick={() => removeFromCart(course.id)} className="btn btn-small">Remove</button>
              </div>
            ))}
          </div>
          <div className="discount-section">
            <input type="text" placeholder="Discount code" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            <button onClick={validateDiscount} className="btn btn-secondary">Apply</button>
            {discount && <p>Discount applied! Save ${discount.discount}</p>}
          </div>
          <div className="cart-summary">
            <p>Subtotal: ${total.toFixed(2)}</p>
            {discount && <p>Final Total: ${finalTotal.toFixed(2)}</p>}
            <button onClick={handleCheckout} className="btn btn-primary btn-large">Checkout with Stripe</button>
          </div>
        </>
      )}
    </div>
  );
}

function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('courses');
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '', difficulty: '', instructor: '' });
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (tab === 'courses') fetchCourses();
    else fetchUsers();
  }, [tab]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${API}/courses`);
      setCourses(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/courses/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/courses`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setFormData({ title: '', description: '', price: '', category: '', difficulty: '', instructor: '' });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      alert('Error saving course');
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Delete this course?')) {
      try {
        await axios.delete(`${API}/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchCourses();
      } catch (err) {
        alert('Error deleting course');
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`${API}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button onClick={() => setTab('courses')} className={tab === 'courses' ? 'active' : ''}>Courses</button>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>Users</button>
      </div>

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleSubmit} className="admin-form">
            <h3>{editingId ? 'Edit Course' : 'Create Course'}</h3>
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
            <input type="number" placeholder="Price" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
            <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
              <option value="">Select Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <input type="text" placeholder="Instructor" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} />
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', price: '', category: '', difficulty: '', instructor: '' }); }} className="btn btn-secondary">Cancel</button>}
          </form>

          <table className="courses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>${course.price}</td>
                  <td>{course.category}</td>
                  <td>{course.difficulty}</td>
                  <td>
                    <button onClick={() => { setEditingId(course.id); setFormData(course); }} className="btn btn-small">Edit</button>
                    <button onClick={() => deleteCourse(course.id)} className="btn btn-small btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)} className="btn btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ProtectedRoute({ component, requiredRole }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;
  return component;
}

// ========== MAIN APP ==========
function AppContent() {
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="logo">Training Platform</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {token ? (
            <>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="btn btn-logout">Logout</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<ProtectedRoute component={<Cart />} />} />
          <Route path="/dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
          <Route path="/admin" element={<ProtectedRoute component={<AdminPanel />} requiredRole="ADMIN" />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2025 Training Platform</p>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
