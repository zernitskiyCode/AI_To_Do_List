# from     database.db import get_db_connection
from backend.database.db_connection import get_db_connection 

def init_db():
    db = None
    cursor = None
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
        # id, title, description, deadline, priority, created_at, completed, completed_at, tag
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
        cursor.execute(""" 
        CREATE TABLE IF NOT EXISTS task_users(
            id SERIAL PRIMARY KEY,
            task_id INTEGER NOT NULL REFERENCES task(id),
            user_id INTEGER NOT NULL REFERENCES users(id))
        """)
        db.commit()
        print("База данных успешно инициализирована.")
    except Exception as e:
        print(f"Ошибка при инициализации базы данных: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

class User:
    def __init__(self, id: int, name: str, surname: str, email: str, password: str, created_at: str, is_active: bool):
        self.id = id
        self.name = name
        self.surname = surname
        self.email = email
        self.password = password
        self.created_at = created_at
        self.is_active = is_active




def migrate_add_completed_at():
    """
    Миграция: добавляет поле completed_at в таблицу task, если его нет
    """
    db = None
    cursor = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # Проверяем, существует ли уже колонка completed_at
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='task' AND column_name='completed_at'
        """)
        
        if not cursor.fetchone():
            # Колонки нет - добавляем
            cursor.execute("ALTER TABLE task ADD COLUMN completed_at TIMESTAMP DEFAULT NULL")
            db.commit()
            print("✅ Поле completed_at успешно добавлено в таблицу task")
        else:
            print("ℹ️  Поле completed_at уже существует в таблице task")
            
    except Exception as e:
        print(f"❌ Ошибка при миграции: {e}")
        if db:
            db.rollback()
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
