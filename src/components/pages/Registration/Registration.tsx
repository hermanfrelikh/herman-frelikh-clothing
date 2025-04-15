import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Регистрация</h2>

      {error && (
        <div
          style={{ display: 'inline-block', marginBottom: '1rem' }}
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="form-control"
            id="floatingUsername"
            placeholder="Имя пользователя"
            required
          />
          <label htmlFor="floatingUsername">Имя пользователя</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="form-control"
            id="floatingEmail"
            placeholder="name@example.com"
            required
          />
          <label htmlFor="floatingEmail">Email адрес</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="form-control"
            id="floatingPassword"
            placeholder="Пароль"
            required
          />
          <label htmlFor="floatingPassword">Пароль</label>
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Зарегистрироваться
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Уже есть аккаунт?{' '}
        <Link
          to="/login"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Войти
        </Link>
      </p>
    </div>
  );
};

export default Registration;
