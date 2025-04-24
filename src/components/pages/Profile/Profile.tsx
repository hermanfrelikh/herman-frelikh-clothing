import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getUserDataFromToken } from '../../../utils/auth';
import BackButton from '../../UI/BackButton';
import styles from './Profile.module.scss';

export default function Profile() {
  const [userData, setUserData] = useState<{
    username?: string;
    email: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserDataFromToken();
    if (!data) {
      navigate('/login');
    } else {
      setUserData(data);
    }
  }, [navigate]);

  return (
    <div className={styles.profilePage}>
      {/* Шапка с кнопкой "Назад" и заголовком */}
      <div className={styles.header}>
        <BackButton className={styles.backButton} />
        <h2 className={styles.title}>Профиль</h2>
      </div>

      {/* Основное содержимое */}
      <div className={styles.content}>
        {userData ? (
          <>
            <p>
              <strong>Имя пользователя:</strong>{' '}
              {userData.username || 'Не указано'}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <div className={styles.links}>
              <Link to="/cart" className={styles.link}>
                Перейти в корзину
              </Link>
              <Link to="/favorites" className={styles.link}>
                Перейти в избранные товары
              </Link>
            </div>
          </>
        ) : (
          <p className={styles.noData}>Данные пользователя не найдены.</p>
        )}
      </div>
    </div>
  );
}
