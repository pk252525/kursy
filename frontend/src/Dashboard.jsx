import React, { useEffect, useState } from 'react';
import API from './api';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await API.get('/dashboard');
        setMessage(data.message);
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
      {loading ? <p>Ładowanie...</p> : <p>{message}</p>}
    </div>
  );
}

export default Dashboard;
