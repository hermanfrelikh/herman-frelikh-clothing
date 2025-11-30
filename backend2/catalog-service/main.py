from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Catalog Service", description="Product catalog management", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = "catalog.db"

# === Инициализация БД ===
def init_db():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            price REAL,
            images TEXT,
            gender TEXT,
            sizes TEXT,
            rating REAL,
            category TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# === Pydantic-модель товара ===
class ProductBase(BaseModel):
    title: str
    price: float
    images: List[str]
    gender: str
    sizes: List[str]
    rating: float = 0.0
    category: str

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True  

# === Dependency для подключения к БД ===
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # чтобы можно было обращаться по имени колонки
    try:
        yield conn
    finally:
        conn.close()

# === Роуты ===

@app.get("/api/products", response_model=List[Product])
def get_products(db: sqlite3.Connection = Depends(get_db)):
    cur = db.cursor()
    cur.execute("SELECT * FROM products")
    rows = cur.fetchall()
    products = []
    for row in rows:
        products.append({
            "id": row["id"],
            "title": row["title"],
            "price": row["price"],
            "images": json.loads(row["images"]) if row["images"] else [],
            "gender": row["gender"],
            "sizes": json.loads(row["sizes"]) if row["sizes"] else [],
            "rating": row["rating"],
            "category": row["category"]
        })
    return products

@app.post("/api/products", status_code=status.HTTP_201_CREATED, response_model=Product)
def create_product(product: ProductBase, db: sqlite3.Connection = Depends(get_db)):
    cur = db.cursor()
    images_str = json.dumps(product.images)
    sizes_str = json.dumps(product.sizes)
    cur.execute(
        """
        INSERT INTO products (title, price, images, gender, sizes, rating, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (product.title, product.price, images_str, product.gender, sizes_str, product.rating, product.category)
    )
    db.commit()
    product_id = cur.lastrowid

    # Возвращаем полный объект с id
    return {
        "id": product_id,
        "title": product.title,
        "price": product.price,
        "images": product.images,
        "gender": product.gender,
        "sizes": product.sizes,
        "rating": product.rating,
        "category": product.category
    }

@app.delete("/api/products/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int, db: sqlite3.Connection = Depends(get_db)):
    cur = db.cursor()
    cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
    db.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}