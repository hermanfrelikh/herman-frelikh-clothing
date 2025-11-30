from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import sqlite3
import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auth Service", description="User registration and login", version="1.0.0")
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
ACCESS_TOKEN_EXPIRE_MINUTES = 60

DATABASE = "auth.db"

# Создание таблицы при старте
def init_db():
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# === Модели ===
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    token: str

# === Вспомогательные функции ===
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# === Роуты ===

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED, response_model=dict)
def register(user: UserRegister, db: sqlite3.Connection = Depends(get_db)):
    cur = db.cursor()

    # Проверка существования email
    cur.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Хэширование пароля
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Вставка
    cur.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        (user.username, user.email, hashed)
    )
    db.commit()
    user_id = cur.lastrowid

    # Токен
    token = create_access_token({
        "userId": user_id,
        "email": user.email,
        "username": user.username
    })

    return {"message": "User registered successfully", "token": token}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: sqlite3.Connection = Depends(get_db)):
    cur = db.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="User not found")

    if not bcrypt.checkpw(user.password.encode('utf-8'), row["password_hash"].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({
        "userId": row["id"],
        "email": row["email"],
        "username": row["username"]
    })

    return {"token": token}