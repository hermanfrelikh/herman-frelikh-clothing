const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const SECRET_KEY = 'your_secret_key_here'; // Убедитесь, что этот ключ совпадает с auth.js

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
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный ID товара в корзине.
 *         product_id:
 *           type: integer
 *           description: ID товара.
 *         size:
 *           type: string
 *           description: Размер товара.
 *         quantity:
 *           type: integer
 *           description: Количество товара.
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
 * /api/cart:
 *   post:
 *     summary: Добавить товар в корзину.
 *     tags: [Cart]
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
 *               size:
 *                 type: string
 *                 description: Размер товара.
 *               quantity:
 *                 type: integer
 *                 description: Количество товара.
 *             required:
 *               - product_id
 *               - size
 *               - quantity
 *     responses:
 *       200:
 *         description: Товар успешно добавлен в корзину.
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
  const { product_id, size, quantity } = req.body;

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

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
        [userId, product_id, size],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        },
      );
    });

    if (existingItem) {
      // Обновляем количество
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
          [quantity, existingItem.id],
          err => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    } else {
      // Добавляем новый товар в корзину
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO cart (user_id, product_id, size, quantity) VALUES (?, ?, ?, ?)',
          [userId, product_id, size, quantity],
          err => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    }

    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Получить все товары в корзине текущего пользователя.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров в корзине.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Неавторизованный доступ.
 *       500:
 *         description: Ошибка сервера.
 */
router.get('/', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const cartItems = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT c.id, c.product_id, c.size, c.quantity, p.title, p.price, p.images, p.rating, p.gender, p.category
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        `,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(
            rows.map(row => ({
              ...row,
              images: JSON.parse(row.images),
            })),
          );
        },
      );
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Удалить товар из корзины по его ID.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID товара в корзине.
 *     responses:
 *       200:
 *         description: Товар успешно удален из корзины.
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
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        },
      );
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
