const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const SECRET_KEY = 'your_secret_key_here'; // Убедитесь, что этот ключ совпадает с auth.js

const router = express.Router();

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/**
 * @swagger
 * components:
 *   schemas:
 *     FavoriteItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID избранного товара.
 *         product_id:
 *           type: integer
 *           description: ID товара.
 *         title:
 *           type: string
 *           description: Название товара.
 *         price:
 *           type: number
 *           description: Цена товара.
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Список изображений товара.
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Доступные размеры товара.
 *         rating:
 *           type: number
 *           description: Рейтинг товара.
 *         gender:
 *           type: string
 *           description: Пол (например, "man" или "woman").
 *         category:
 *           type: string
 *           description: Категория товара.
 */

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Добавить товар в избранное.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: ID товара.
 *             required:
 *               - product_id
 *     responses:
 *       200:
 *         description: Товар успешно добавлен в избранное.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном добавлении.
 *       400:
 *         description: Неверные данные запроса.
 *       401:
 *         description: Неавторизованный доступ.
 *       500:
 *         description: Ошибка сервера.
 */
router.post('/', authenticateToken, async (req, res) => {
  const { userId } = req.user; // Используем userId из токена
  const { product_id } = req.body;

  try {
    // Проверяем, существует ли товар с таким ID
    const productExists = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE id = ?',
        [product_id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        },
      );
    });

    if (!productExists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Проверяем, есть ли уже такой товар в избранном
    const existingItem = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?',
        [userId, product_id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        },
      );
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    // Добавляем новый товар в избранное
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [userId, product_id],
        err => {
          if (err) return reject(err);
          resolve();
        },
      );
    });

    res.status(200).json({ message: 'Product added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Получить все товары в избранном текущего пользователя.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров в избранном.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavoriteItem'
 *       401:
 *         description: Неавторизованный доступ.
 *       500:
 *         description: Ошибка сервера.
 */
router.get('/', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const favoriteItems = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT p.*
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        WHERE f.user_id = ?
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(
            rows.map(row => ({
              ...row,
              images: JSON.parse(row.images),
              sizes: JSON.parse(row.sizes),
            })),
          );
        },
      );
    });

    res.status(200).json(favoriteItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Удалить товар из избранного по его ID.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара в избранном.
 *     responses:
 *       200:
 *         description: Товар успешно удален из избранного.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном удалении.
 *       401:
 *         description: Неавторизованный доступ.
 *       404:
 *         description: Товар не найден.
 *       500:
 *         description: Ошибка сервера.
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM favorites WHERE product_id = ? AND user_id = ?',
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        },
      );
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Favorite item not found' });
    }

    res.status(200).json({ message: 'Favorite item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
