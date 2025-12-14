from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import DictCursor

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- DB ----------
def get_conn():
    return psycopg2.connect(
        host="localhost",
        user="postgres",
        password="admin",
        port=5432,
        dbname="todo"
    )

# ---------- MODELS ----------
class UserCreate(BaseModel):
    firstName: str
    lastName: str

# ---------- ROUTES ----------
@app.get(
    "/userinfo",
    tags=["Информация о пользователе"],
    summary="Получаем инфу о пользователях"
)
def read_user_info():
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=DictCursor)

    cursor.execute("SELECT * FROM users;")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return rows


@app.post(
    "/registration",
    tags=["Регистрация пользователя"],
    summary="Регистрация"
)
def reg_user(user: UserCreate):
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=DictCursor)

    try:
        cursor.execute(
            """
            INSERT INTO users (name, surname)
            VALUES (%s, %s)
            RETURNING user_id, name, surname;
            """,
            (user.firstName, user.lastName)
        )

        result = cursor.fetchone()
        conn.commit()

        cursor.close()
        conn.close()
        
        return {
            "status": "success", 
            "user_id": result['user_id'],
            "firstName": result['name'],
            "lastName": result['surname'],
            "fullName": f"{result['name']} {result['surname']}"
        }
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return {"status": "error", "message": str(e)}


@app.post(
    "/login",
    tags=["Логин пользователя"],
    summary="Вход по имени и фамилии"
)
def login_user(user: UserCreate):
    conn = get_conn()
    cursor = conn.cursor(cursor_factory=DictCursor)

    try:
        cursor.execute(
            """
            SELECT user_id, name, surname FROM users 
            WHERE name = %s AND surname = %s
            LIMIT 1;
            """,
            (user.firstName, user.lastName)
        )

        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result:
            return {
                "status": "success",
                "user_id": result['user_id'],
                "firstName": result['name'],
                "lastName": result['surname'],
                "fullName": f"{result['name']} {result['surname']}"
            }
        else:
            return {"status": "error", "message": "Пользователь не найден"}
    except Exception as e:
        cursor.close()
        conn.close()
        return {"status": "error", "message": str(e)}


@app.get("/", tags=["Тестирование"])
def read_root():
    return {"message": "server is working!"}
