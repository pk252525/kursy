import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funkcja wylogowania
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('❌ Brak tokena – zaloguj się!');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Błąd pobierania dashboardu');
        }

        setMessage(data.message);
        setUser(data.user);
      } catch (err) {
        setMessage('❌ ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          <p>{message}</p>
          {user && (
            <div className="user-info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          )}
          <button onClick={handleLogout}>Wyloguj</button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
