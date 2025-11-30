from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import jwt
import json
from functools import lru_cache
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cart & Favorites Service",
    description="Manage user cart and favorites",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Конфигурация ===
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
DATABASE = "cart.db"

# === Инициализация БД ===
def init_db():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            size TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            UNIQUE(user_id, product_id, size)
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            UNIQUE(user_id, product_id)
        )
    """)
    conn.commit()
    conn.close()

init_db()

# === Модели запросов и ответов ===
class AddToCartRequest(BaseModel):
    product_id: int
    size: str
    quantity: int

class AddToFavoritesRequest(BaseModel):
    product_id: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    size: str
    quantity: int
    title: str
    price: float
    images: List[str]
    rating: float
    gender: str
    category: str

class FavoriteItemResponse(BaseModel):
    id: int
    product_id: int
    title: str
    price: float
    images: List[str]
    sizes: List[str]
    rating: float
    gender: str
    category: str

# === Утилиты ===
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# === Роуты ===

@app.post("/api/cart", status_code=status.HTTP_200_OK)
def add_to_cart(
    request: AddToCartRequest,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]

    product_id = request.product_id
    size = request.size
    quantity = request.quantity

    if not product_id or not size or not quantity:
        raise HTTPException(status_code=400, detail="Missing required fields")

    cur = db.cursor()
    cur.execute("SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?", (user_id, product_id, size))
    existing = cur.fetchone()

    if existing:
        cur.execute("UPDATE cart SET quantity = quantity + ? WHERE id = ?", (quantity, existing["id"]))
        message = "Product quantity updated in cart"
    else:
        cur.execute(
            "INSERT INTO cart (user_id, product_id, size, quantity) VALUES (?, ?, ?, ?)",
            (user_id, product_id, size, quantity)
        )
        message = "Product added to cart"

    db.commit()
    return {"message": message}

@app.get("/api/cart", response_model=List[CartItemResponse])
def get_cart(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]

    cur = db.cursor()
    cur.execute("SELECT * FROM cart WHERE user_id = ?", (user_id,))
    rows = cur.fetchall()
    items = []
    for row in rows:
        items.append({
            "id": row["id"],
            "product_id": row["product_id"],
            "size": row["size"],
            "quantity": row["quantity"],
            "title": "",        
            "price": 0.0,       
            "images": [],
            "rating": 0.0,
            "gender": "",
            "category": ""
        })
    return items

@app.delete("/api/cart/{item_id}", status_code=status.HTTP_200_OK)
def delete_from_cart(
    item_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]

    cur = db.cursor()
    cur.execute("DELETE FROM cart WHERE id = ? AND user_id = ?", (item_id, user_id))
    db.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted"}

@app.post("/api/favorites", status_code=status.HTTP_200_OK)
def add_to_favorites(
    request: AddToFavoritesRequest,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]
    product_id = request.product_id

    cur = db.cursor()
    cur.execute("SELECT * FROM favorites WHERE user_id = ? AND product_id = ?", (user_id, product_id))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="Product already in favorites")

    cur.execute("INSERT INTO favorites (user_id, product_id) VALUES (?, ?)", (user_id, product_id))
    db.commit()
    return {"message": "Product added to favorites"}

@app.get("/api/favorites", response_model=List[FavoriteItemResponse])
def get_favorites(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]

    cur = db.cursor()
    cur.execute("SELECT * FROM favorites WHERE user_id = ?", (user_id,))
    rows = cur.fetchall()
    items = []
    for row in rows:
        items.append({
            "id": row["id"],
            "product_id": row["product_id"],
            "title": "",        
            "price": 0.0,
            "images": [],
            "sizes": [],
            "rating": 0.0,
            "gender": "",
            "category": ""
        })
    return items

@app.delete("/api/favorites/{product_id}", status_code=status.HTTP_200_OK)
def delete_from_favorites(
    product_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: sqlite3.Connection = Depends(get_db)
):
    token = credentials.credentials
    user = verify_token(token)
    user_id = user["userId"]

    cur = db.cursor()
    cur.execute("DELETE FROM favorites WHERE product_id = ? AND user_id = ?", (product_id, user_id))
    db.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Favorite item not found")
    return {"message": "Favorite item deleted"}