import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getUserDataFromToken } from '../../../utils/auth';
import BackButton from '../../UI/BackButton';

export default function Profile() {
  const [userData, setUserData] = useState<{
    username?: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем данные пользователя из JWT-токена
    const data = getUserDataFromToken();
    if (!data) {
      // Если токена нет, перенаправляем на страницу входа
      navigate('/login');
    } else {
      setUserData(data);
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <BackButton />
      <h2>Профиль</h2>

      {userData ? (
        <div>
          {/* Аватар */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://picsum.photos/150"
              alt="Avatar"
              style={{ borderRadius: '50%', width: '150px', height: '150px' }}
            />
            <button style={{ marginTop: '10px' }}>Загрузить аватар</button>
          </div>

          {/* Имя пользователя */}
          <p>
            <strong>Имя пользователя:</strong>{' '}
            {userData.username || 'Не указано'}
          </p>

          {/* Email */}
          <p>
            <strong>Email:</strong> {userData.email}
          </p>

          {/* Кнопки для перехода */}
          <div style={{ marginTop: '20px' }}>
            <Link
              to="/cart"
              style={{
                display: 'block',
                marginBottom: '10px',
                color: 'blue',
                textDecoration: 'underline',
              }}
            >
              Перейти в корзину
            </Link>
            <Link
              to="/favorites"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              Перейти в избранные товары
            </Link>
          </div>
        </div>
      ) : (
        <p>Данные пользователя не найдены.</p>
      )}
    </div>
  );
}
