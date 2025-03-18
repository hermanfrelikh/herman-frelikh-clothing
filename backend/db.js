const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  // Создание таблицы products, если она не существует
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    price REAL,
    images TEXT,
    gender TEXT,
    sizes TEXT,
    rating REAL,
    category TEXT
  )`);

  // Проверка существующих столбцов
  db.all('PRAGMA table_info(products)', (err, rows) => {
    if (err) {
      console.error('Error checking table info:', err);
      return;
    }

    // Отладочный вывод
    console.log('Table columns:', rows);

    // Извлечение имен столбцов
    const columnNames = rows.map(row => row.name);

    // Добавление новых столбцов, если они отсутствуют
    if (!columnNames.includes('images')) {
      db.run(`ALTER TABLE products ADD COLUMN images TEXT`);
    }
    if (!columnNames.includes('gender')) {
      db.run(`ALTER TABLE products ADD COLUMN gender TEXT`);
    }
    if (!columnNames.includes('sizes')) {
      db.run(`ALTER TABLE products ADD COLUMN sizes TEXT`);
    }
    if (!columnNames.includes('rating')) {
      db.run(`ALTER TABLE products ADD COLUMN rating REAL`);
    }
    if (!columnNames.includes('category')) {
      db.run(`ALTER TABLE products ADD COLUMN category TEXT`);
    }
  });
});

module.exports = db;
