import { jwtDecode } from 'jwt-decode';

// Функция для получения данных пользователя из JWT-токена
export const getUserDataFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Декодируем токен
    const decoded: { userId: number; email: string; username?: string } =
      jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    return null;
  }
};

// Функция для проверки, авторизован ли пользователь
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Возвращает true, если токен существует
};
