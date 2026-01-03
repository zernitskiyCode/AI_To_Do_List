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
            tag TEXT NOT NULL)
        """)
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


