# from     database.db import get_db_connection
from backend.database.db_connection import get_db_connection 

def init_db():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute(""" 
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            NAME TEXT NOT NULL,
            SURNAME TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT True)
        """)
        # id, title, description, deadline, priority, created_at, completed, tag
        cursor.execute(""" 
        CREATE TABLE IF NOT EXISTS task(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            deadline TIMESTAMP,
            priority INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed BOOLEAN DEFAULT False,
            completed_at TIMESTAMP DEFAULT NULL,
            tag TEXT NOT NULL)
        """)
        # Если база уже существовала без колонки completed_at, добавляем её безопасно
        try:
            cursor.execute("ALTER TABLE task ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP DEFAULT NULL;")
        except Exception:
            # на некоторых старых версиях PostgreSQL может не поддерживаться IF NOT EXISTS — игнорируем ошибки
            try:
                cursor.execute("ALTER TABLE task ADD COLUMN completed_at TIMESTAMP DEFAULT NULL;")
            except Exception:
                pass
        cursor.execute(""" 
        CREATE TABLE IF NOT EXISTS task_users(
            id SERIAL PRIMARY KEY,
            task_id INTEGER NOT NULL REFERENCES task(id),
            user_id INTEGER NOT NULL REFERENCES users(id))
        """)
        db.commit()
        cursor.close()
        db.close()
        print("База данных успешно инициализирована.")
    except Exception as e:
        cursor.close()
        db.close()
        print(f"Ошибка при инициализации базы данных: {e}")

class User:
    def __init__(self, id: int, name: str, surname: str, email: str, password: str, created_at: str, is_active: bool):
        self.id = id
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.created_at = created_at
        self.is_active = is_active


