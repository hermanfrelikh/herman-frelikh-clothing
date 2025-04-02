import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем Link

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем JWT-токен в localStorage
        localStorage.setItem('token', data.token);

        // Перенаправляем на главную страницу
        navigate('/');
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Авторизация</h2>

      {/* Отображение ошибок */}
      {error && (
        <div
          style={{ display: 'inline-block', marginBottom: '1rem' }}
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Форма авторизации */}
      <form onSubmit={handleSubmit}>
        {/* Поле для email */}
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

        {/* Поле для пароля */}
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

        {/* Кнопка отправки формы */}
        <button type="submit" className="btn btn-dark w-100">
          Войти
        </button>
      </form>

      {/* Ссылка на страницу регистрации */}
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Нет аккаунта?{' '}
        <Link
          to="/registration"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};

export default Login;
