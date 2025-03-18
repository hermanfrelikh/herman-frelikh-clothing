const express = require('express');
const router = express.Router();
const Joi = require('joi'); // Валидация данных
const db = require('../db');

// Схема валидации для товара
const productSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string()).default([]),
  gender: Joi.string().required(),
  sizes: Joi.array().items(Joi.string()).default([]),
  rating: Joi.number().min(0).max(5).default(0),
  category: Joi.string().required(), // Новое поле
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: err.message });
    }
    const products = rows.map(row => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      sizes: row.sizes ? JSON.parse(row.sizes) : [],
    }));
    res.json(products);
  });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               gender:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, price, images, gender, sizes, rating, category } = req.body; // Добавлено category
  const imagesStr = JSON.stringify(images);
  const sizesStr = JSON.stringify(sizes);

  db.run(
    'INSERT INTO products (title, price, images, gender, sizes, rating, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, price, imagesStr, gender, sizesStr, rating, category], // Добавлено category
    function (err) {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        price,
        images,
        gender,
        sizes,
        rating,
        category, // Добавлено category
      });
    },
  );
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', (req, res) => {
  const productId = req.params.id;
  db.run('DELETE FROM products WHERE id = ?', productId, function (err) {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;
