import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const API = 'http://172.31.109.159:5000/api';

// ========== AUTH CONTEXT ==========
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Przywróć dane użytkownika z tokenu (dekoduj JWT)
  useEffect(() => {
    if (token) {
      try {
        // Dekoduj JWT token (bez weryfikacji na froncie, backend zweryfikuje)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(jsonPayload);
        setUser({
          userId: decodedToken.userId,
          email: decodedToken.email,
          role: decodedToken.role
        });
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading }}>
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
    if (!token) return alert('Najpierw zaloguj się');
    try {
      await axios.post(`${API}/cart`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Dodano do koszyka!');
    } catch (err) {
      alert('Błąd podczas dodawania do koszyka');
    }
  };

  const paginatedCourses = courses.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  return (
    <div className="home">
      <div className="filters">
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Wszystkie kategorie</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Mobile">Mobile</option>
        </select>
        <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">Wszystkie poziomy</option>
          <option value="Beginner">Początkujący</option>
          <option value="Intermediate">Średniozaawansowany</option>
          <option value="Advanced">Zaawansowany</option>
        </select>
        <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
          <option value="">Najnowsze</option>
          <option value="price">Cena (od najniższej)</option>
          <option value="rating">Najwyżej ocenione</option>
        </select>
      </div>

      <div className="courses-grid">
        {paginatedCourses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p className="description">{course.description}</p>
            <p className="meta">{course.category} • {course.difficulty}</p>
            <p className="instructor">by {course.instructor}</p>
            <p className="price">{course.price} zł</p>
            <div className="actions">
              <Link to={`/course/${course.id}`} className="btn btn-primary">Zobacz szczegóły</Link>
              <button onClick={() => addToCart(course.id)} className="btn btn-secondary">Dodaj do koszyka</button>
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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchCourse();
    if (token) checkEnrollment();
  }, [id, token]);

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

  const checkEnrollment = async () => {
    try {
      const { data } = await axios.get(`${API}/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Enrollments:', data);
      console.log('Current course ID:', id);
      const enrolled = data.some(c => String(c.id) === String(id));
      console.log('Is enrolled:', enrolled);
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error('Error checking enrollment:', err);
    }
  };

  const addToCart = async () => {
    if (!token) return alert('Najpierw zaloguj się');
    try {
      await axios.post(`${API}/cart`, { courseId: id }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Dodano do koszyka!');
    } catch (err) {
      alert('Błąd podczas dodawania do koszyka');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert('Najpierw zaloguj się');
    if (!isEnrolled) return alert('Musisz kupić ten kurs, aby dodać recenzję');
    
    setSubmittingReview(true);
    try {
      await axios.post(`${API}/courses/${id}/reviews`, reviewForm, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      alert('Recenzja została dodana!');
      setReviewForm({ rating: 5, comment: '' });
      fetchCourse(); // Reload course to show new review
    } catch (err) {
      alert(err.response?.data?.error || 'Błąd podczas dodawania recenzji');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!course) return <div>Nie znaleziono kursu</div>;

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="meta">{course.category} • {course.difficulty} • by {course.instructor}</p>
      </div>
      <div className="course-body">
        <div className="course-main">
          <h3>Opis</h3>
          <p>{course.description}</p>
          <h3>Lekcje ({course.lessons?.length || 0})</h3>
          <ul>
            {course.lessons?.map((lesson, i) => (
              <li key={lesson.id}>{i + 1}. {lesson.title}</li>
            ))}
          </ul>
          <h3>Recenzje ({course.reviews?.length || 0})</h3>
          {token && isEnrolled && (
            <div className="review-form">
              <h4>Napisz recenzję</h4>
              <form onSubmit={submitReview}>
                <div>
                  <label>Ocena: </label>
                  <select 
                    value={reviewForm.rating} 
                    onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  >
                    <option value="5">5 - Doskonały</option>
                    <option value="4">4 - Bardzo dobry</option>
                    <option value="3">3 - Dobry</option>
                    <option value="2">2 - Średni</option>
                    <option value="1">1 - Słaby</option>
                  </select>
                </div>
                <div>
                  <textarea 
                    placeholder="Podziel się swoją opinią o kursie..." 
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                    rows="4"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Wysyłanie...' : 'Wyślij recenzję'}
                </button>
              </form>
            </div>
          )}
          {token && !isEnrolled && (
            <div className="review-info">
              <p>Musisz kupić ten kurs, aby dodać recenzję.</p>
            </div>
          )}
          {!token && (
            <div className="review-info">
              <p>Zaloguj się, aby dodać recenzję.</p>
            </div>
          )}
          {course.reviews?.map(review => (
            <div key={review.id} className="review">
              <p><strong>Ocena: {review.rating}/5</strong></p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
        <div className="course-sidebar">
          <p className="price">{course.price} zł</p>
          <button onClick={addToCart} className="btn btn-primary btn-large">Dodaj do koszyka</button>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grypsuje, setGrypsuje] = useState(false);
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
        <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} required />
          {!isLogin && (
            <div className="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={grypsuje} 
                  onChange={e => setGrypsuje(e.target.checked)} 
                />
                <span>Grypsuje</span>
              </label>
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading || (!isLogin && !grypsuje)}>
            {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>
        <p>
          {isLogin ? 'Nie masz konta? ' : 'Masz już konto? '}
          <button onClick={() => { setIsLogin(!isLogin); setGrypsuje(false); }} className="link-btn">
            {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
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

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="dashboard">
      <h2>Moje kursy</h2>
      {enrollments.length === 0 ? (
        <p>Nie masz jeszcze żadnych kursów. <Link to="/">Przeglądaj kursy</Link></p>
      ) : (
        <div className="courses-grid">
          {enrollments.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to={`/learn/${course.id}`} className="btn btn-primary">Przejdź do kursu</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseLessons() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${API}/courses/${id}`);
      setCourse(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Błąd podczas ładowania kursu');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!course) return <div>Nie znaleziono kursu</div>;

  return (
    <div className="course-lessons">
      <div className="course-lessons-header">
        <Link to="/dashboard" className="back-link">← Powrót do moich kursów</Link>
        <h1>{course.title}</h1>
        <p className="course-meta">{course.category} • {course.difficulty}</p>
      </div>
      
      <div className="lessons-list">
        <h2>Lekcje kursu</h2>
        {!course.lessons || course.lessons.length === 0 ? (
          <p>Ten kurs nie ma jeszcze żadnych lekcji.</p>
        ) : (
          <div className="lessons-grid">
            {course.lessons.map((lesson, index) => (
              <Link 
                key={lesson.id} 
                to={`/learn/${id}/lesson/${lesson.id}`}
                className="lesson-card"
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  {lesson.content?.duration && (
                    <p className="lesson-duration">⏱ {lesson.content.duration}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LessonView() {
  const { id, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseAndLesson();
  }, [id, lessonId]);

  const fetchCourseAndLesson = async () => {
    try {
      const { data } = await axios.get(`${API}/courses/${id}`);
      setCourse(data);
      
      const foundLesson = data.lessons?.find(l => String(l.id) === String(lessonId));
      if (foundLesson) {
        setLesson(foundLesson);
      } else {
        alert('Nie znaleziono lekcji');
        navigate(`/learn/${id}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Błąd podczas ładowania lekcji');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLessonIndex = () => {
    return course?.lessons?.findIndex(l => String(l.id) === String(lessonId)) || 0;
  };

  const goToNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      navigate(`/learn/${id}/lesson/${nextLesson.id}`);
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1];
      navigate(`/learn/${id}/lesson/${prevLesson.id}`);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!lesson) return <div>Nie znaleziono lekcji</div>;

  const currentIndex = getCurrentLessonIndex();
  const hasNext = currentIndex < course.lessons.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="lesson-view">
      <div className="lesson-header">
        <Link to={`/learn/${id}`} className="back-link">← Powrót do listy lekcji</Link>
        <div className="lesson-title-section">
          <p className="lesson-meta">Lekcja {currentIndex + 1} z {course.lessons.length}</p>
          <h1>{lesson.title}</h1>
          {lesson.content?.duration && (
            <p className="lesson-duration">⏱ Czas trwania: {lesson.content.duration}</p>
          )}
        </div>
      </div>

      <div className="lesson-content">
        {lesson.content?.markdown ? (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content.markdown}</ReactMarkdown>
          </div>
        ) : (
          <p>Brak treści lekcji</p>
        )}
      </div>

      <div className="lesson-navigation">
        <button 
          onClick={goToPreviousLesson} 
          disabled={!hasPrev}
          className="btn btn-secondary"
        >
          ← Poprzednia lekcja
        </button>
        <button 
          onClick={goToNextLesson} 
          disabled={!hasNext}
          className="btn btn-primary"
        >
          Następna lekcja →
        </button>
      </div>
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
      alert('Błąd podczas usuwania z koszyka');
    }
  };

  const validateDiscount = async () => {
    try {
      const total = cartItems.reduce((sum, c) => sum + c.price, 0);
      const { data } = await axios.post(`${API}/discounts/validate`, { code: discountCode, coursePrice: total });
      setDiscount(data);
    } catch (err) {
      alert('Nieprawidłowy kod rabatowy');
    }
  };

  const handleCheckout = async () => {
    try {
      console.log('Wysyłanie żądania do:', `${API}/checkout/direct`);
      console.log('Token:', token ? 'Obecny' : 'Brak');
      console.log('Koszyk zawiera:', cartItems.length, 'kursów');
      
      const response = await axios.post(`${API}/checkout/direct`, { discountCode }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      console.log('Odpowiedź serwera:', response.data);
      alert('Kursy zostały przypisane do Twojego konta!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Szczegóły błędu:', err);
      console.error('Odpowiedź błędu:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.message || 'Nieznany błąd';
      alert('Błąd podczas przypisywania kursów: ' + errorMsg);
    }
  };

  const total = cartItems.reduce((sum, c) => sum + c.price, 0);
  const finalTotal = discount ? discount.finalPrice : total;

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="cart">
      <h2>Koszyk</h2>
      {cartItems.length === 0 ? (
        <p>Koszyk jest pusty. <Link to="/">Kontynuuj zakupy</Link></p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(course => (
              <div key={course.id} className="cart-item">
                <div>
                  <h4>{course.title}</h4>
                  <p>{course.price} zł</p>
                </div>
                <button onClick={() => removeFromCart(course.id)} className="btn btn-small">Usuń</button>
              </div>
            ))}
          </div>
          <div className="discount-section">
            <input type="text" placeholder="Kod rabatowy" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            <button onClick={validateDiscount} className="btn btn-secondary">Zastosuj</button>
            {discount && <p>Kod rabatowy zastosowany! Oszczędzasz {discount.discount} zł</p>}
          </div>
          <div className="cart-summary">
            <p>Suma częściowa: {total.toFixed(2)} zł</p>
            {discount && <p>Suma końcowa: {finalTotal.toFixed(2)} zł</p>}
            <button onClick={handleCheckout} className="btn btn-primary btn-large">Zapisz się na kursy</button>
          </div>
        </>
      )}
    </div>
  );
}

function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tab, setTab] = useState('courses');
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '', difficulty: '', instructor: '' });
  const [lessonFormData, setLessonFormData] = useState({ title: '', course_id: '', lesson_order: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (tab === 'courses') fetchCourses();
    else if (tab === 'users') fetchUsers();
    else if (tab === 'lessons') fetchLessons();
  }, [tab]);

  useEffect(() => {
    if (tab === 'lessons' && selectedCourseId) {
      fetchLessons();
    }
  }, [selectedCourseId]);

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

  const fetchLessons = async () => {
    try {
      if (selectedCourseId) {
        const { data } = await axios.get(`${API}/courses/${selectedCourseId}`);
        setLessons(data.lessons || []);
      }
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
      alert('Błąd podczas zapisywania kursu');
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return alert('Wybierz kurs');
    
    try {
      const payload = {
        title: lessonFormData.title,
        course_id: selectedCourseId,
        lesson_order: parseInt(lessonFormData.lesson_order) || 1,
        content: {
          duration: '',
          markdown: lessonFormData.content
        }
      };

      if (editingLessonId) {
        await axios.put(`${API}/lessons/${editingLessonId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API}/lessons`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setLessonFormData({ title: '', course_id: '', lesson_order: '', content: '' });
      setEditingLessonId(null);
      fetchLessons();
    } catch (err) {
      alert('Błąd podczas zapisywania lekcji: ' + (err.response?.data?.error || err.message));
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Usunąć ten kurs?')) {
      try {
        await axios.delete(`${API}/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchCourses();
      } catch (err) {
        alert('Błąd podczas usuwania kursu');
      }
    }
  };

  const deleteLesson = async (id) => {
    if (window.confirm('Usunąć tę lekcję?')) {
      try {
        await axios.delete(`${API}/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchLessons();
      } catch (err) {
        alert('Błąd podczas usuwania lekcji');
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Usunąć tego użytkownika?')) {
      try {
        await axios.delete(`${API}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers();
      } catch (err) {
        alert('Błąd podczas usuwania użytkownika');
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button onClick={() => setTab('courses')} className={tab === 'courses' ? 'active' : ''}>Kursy</button>
        <button onClick={() => setTab('lessons')} className={tab === 'lessons' ? 'active' : ''}>Lekcje</button>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>Użytkownicy</button>
      </div>

      {tab === 'courses' && (
        <div>
          <form onSubmit={handleSubmit} className="admin-form">
            <h3>{editingId ? 'Edytuj kurs' : 'Utwórz kurs'}</h3>
            <input type="text" placeholder="Tytuł" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            <textarea placeholder="Opis" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
            <input type="number" placeholder="Cena" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
            <input type="text" placeholder="Kategoria" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
              <option value="">Wybierz poziom</option>
              <option value="Beginner">Początkujący</option>
              <option value="Intermediate">Średniozaawansowany</option>
              <option value="Advanced">Zaawansowany</option>
            </select>
            <input type="text" placeholder="Instruktor" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} />
            <button type="submit" className="btn btn-primary">{editingId ? 'Zaktualizuj' : 'Utwórz'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', price: '', category: '', difficulty: '', instructor: '' }); }} className="btn btn-secondary">Anuluj</button>}
          </form>

          <table className="courses-table">
            <thead>
              <tr>
                <th>Tytuł</th>
                <th>Cena</th>
                <th>Kategoria</th>
                <th>Poziom</th>
                <th>Akcje</th>
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
                    <button onClick={() => { setEditingId(course.id); setFormData(course); }} className="btn btn-small">Edytuj</button>
                    <button onClick={() => deleteCourse(course.id)} className="btn btn-small btn-danger">Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'lessons' && (
        <div>
          <div className="lesson-section">
            <h3>Wybierz kurs</h3>
            <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="course-selector">
              <option value="">-- Wybierz kurs --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {selectedCourseId && (
            <>
              <form onSubmit={handleLessonSubmit} className="admin-form lesson-form">
                <h3>{editingLessonId ? 'Edytuj lekcję' : 'Utwórz nową lekcję'}</h3>
                <input 
                  type="text" 
                  placeholder="Tytuł lekcji" 
                  value={lessonFormData.title} 
                  onChange={e => setLessonFormData({ ...lessonFormData, title: e.target.value })} 
                  required 
                />
                <input 
                  type="number" 
                  placeholder="Kolejność lekcji" 
                  value={lessonFormData.lesson_order} 
                  onChange={e => setLessonFormData({ ...lessonFormData, lesson_order: e.target.value })} 
                  min="1"
                  required 
                />
                <textarea 
                  placeholder="Zawartość lekcji (markdown)" 
                  value={lessonFormData.content} 
                  onChange={e => setLessonFormData({ ...lessonFormData, content: e.target.value })} 
                  required 
                  rows="15"
                  style={{ fontFamily: 'monospace' }}
                ></textarea>
                <button type="submit" className="btn btn-primary">{editingLessonId ? 'Zaktualizuj lekcję' : 'Utwórz lekcję'}</button>
                {editingLessonId && (
                  <button 
                    type="button" 
                    onClick={() => { 
                      setEditingLessonId(null); 
                      setLessonFormData({ title: '', course_id: '', lesson_order: '', content: '' }); 
                    }} 
                    className="btn btn-secondary"
                  >
                    Anuluj
                  </button>
                )}
              </form>

              <div className="lessons-management">
                <h3>Lekcje w tym kursie ({lessons.length})</h3>
                {lessons.length === 0 ? (
                  <p>Brak lekcji w tym kursie</p>
                ) : (
                  <table className="lessons-table">
                    <thead>
                      <tr>
                        <th>Lp.</th>
                        <th>Tytuł</th>
                        <th>Zawartość</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.sort((a, b) => (a.lesson_order || 0) - (b.lesson_order || 0)).map((lesson, idx) => (
                        <tr key={lesson.id}>
                          <td>{lesson.lesson_order || idx + 1}</td>
                          <td>{lesson.title}</td>
                          <td>
                            <div style={{ maxHeight: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {lesson.content?.markdown?.substring(0, 50) || 'Brak zawartości'}...
                            </div>
                          </td>
                          <td>
                            <button 
                              onClick={() => {
                                setEditingLessonId(lesson.id);
                                setLessonFormData({
                                  title: lesson.title,
                                  course_id: selectedCourseId,
                                  lesson_order: lesson.lesson_order || 1,
                                  content: lesson.content?.markdown || ''
                                });
                              }}
                              className="btn btn-small"
                            >
                              Edytuj
                            </button>
                            <button 
                              onClick={() => deleteLesson(lesson.id)} 
                              className="btn btn-small btn-danger"
                            >
                              Usuń
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'users' && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Rola</th>
              <th>Data utworzenia</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)} className="btn btn-small btn-danger">Usuń</button>
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
  const { token, setToken, user, loading } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (loading) {
    return <div className="app-container"><div className="loading">Ładowanie...</div></div>;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="logo">Kursy Velo</Link>
        <ul className="nav-links">
          <li><Link to="/">Strona główna</Link></li>
          {token ? (
            <>
              <li><Link to="/cart">Koszyk</Link></li>
              <li><Link to="/dashboard">Moje kursy</Link></li>
              {user?.role === 'ADMIN' && <li><Link to="/admin">Panel admina</Link></li>}
              <li><button onClick={handleLogout} className="btn btn-logout">Wyloguj</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Zaloguj</Link></li>
            </>
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
          <Route path="/learn/:id" element={<ProtectedRoute component={<CourseLessons />} />} />
          <Route path="/learn/:id/lesson/:lessonId" element={<ProtectedRoute component={<LessonView />} />} />
          <Route path="/admin" element={<ProtectedRoute component={<AdminPanel />} requiredRole="ADMIN" />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2025 Kursy Velo</p>
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
