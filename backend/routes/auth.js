const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./database.sqlite');

// Секретный ключ для JWT
const SECRET_KEY = 'your_secret_key_here';

// Маршрут для регистрации пользователя
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Проверяем, существует ли пользователь с таким email
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (user) {
          return res
            .status(400)
            .json({ error: 'User with this email already exists' });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавляем пользователя в базу данных
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function (err) {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            // Генерируем JWT-токен
            const token = jwt.sign(
              { userId: this.lastID, email, username },
              SECRET_KEY,
              { expiresIn: '1h' },
            );

            res
              .status(201)
              .json({ message: 'User registered successfully', token });
          },
        );
      },
    );
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Маршрут для авторизации пользователя
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя в базе данных
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
          return res.status(400).json({ error: 'User not found' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid password' });
        }

        // Генерация JWT-токена
        const token = jwt.sign(
          { userId: user.id, email: user.email, username: user.username },
          SECRET_KEY,
          { expiresIn: '1h' },
        );

        res.json({ token });
      },
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
