import React, { useState } from 'react';
import API from './api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setMessage('✅ Zalogowano pomyślnie!');
      window.location.href = '/dashboard';
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { email, password });
      setMessage('✅ Konto utworzone, możesz się zalogować!');
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Logowanie / Rejestracja</h2>
      <form>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="form-buttons">
          <button onClick={handleLogin}>Zaloguj</button>
          <button onClick={handleRegister}>Zarejestruj</button>
        </div>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
