from backend.database.db_connection import get_db_connection
from backend.schemas import UserCreate, UserLogin, TaskCreate
from fastapi import HTTPException


# Добавление пользователя
def create_user(user : UserCreate):
    db = get_db_connection()
    cursor = db.cursor()
    # 1. Проверяем существует ли такой пользователь
    cursor.execute("""
    SELECT id FROM users WHERE email = %s""", (user.email))
    if cursor.fetchone:
        db.close
        cursor.close
        raise HTTPException(status_code=400, detail="Пользовател с таким email уже зарегестрирован.")
    # 2. Если пользователя нет, добавляем в бд
    cursor.execute("""
    INSERT INTO users(username, email, password) VALUES (%s, %s, %s) RETURNING id""", (user.username, user.email, user.password))
    user_id = cursor.fetchone()[0]
    db.close
    cursor.close
    return user_id

# Авторизация
def authenticate_user(user: UserLogin):
    db = get_db_connection()
    cursor = db.cursor()
    # 1. Проверяем существует ли такой пользователь 
    cursor.execute("""
        SELECT id FROM users WHERE email = %s AND password = %s""", (user.email, user.password))
    db_user = cursor.fetchone()
    db.commit()
    cursor.close()
    db.close()
    return db_user[0]

# Получение информации о пользователе по id
def get_info(user_id : int):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        SELECT * FROM users WHERE id = %s""", (user_id))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    return dict(user)


# создание задачи
def create_task(task: TaskCreate, id: int):
    db = get_db_connection()
    cursor = db.cursor()
    # 1. Проверяем существует ли такой пользователь
    cursor.execute("""SELECT id FROM users WHERE id = %s""", (id,))
    if not cursor.fetchone:
        db.close
        cursor.close
        raise HTTPException(status_code=400, detail="Пользователь не найден")
    # 2. Вставляем задачу в бд
    cursor.execute("""
        INSERT INTO task(title, description, deadline, priority, tag) 
        VALUES(%s, %s, %s, %s, %s) 
        RETURNING id  
        """, (id, task.title, task.description, task.deadline, task.priority, task.tag))
    task_id = cursor.fetchone()[0]
    cursor.execute("""
        INSERT INTO task_users (task_id, user_id)
        VALUES (%s, %s)
        """, (task_id, task.user_id))
    db.close()
    cursor.close()
    return task_id


# Получение задачи
# Переписать с join
def get_user_tasks(user_id: int):
        db = get_db_connection()
        cursor = db.cursor()
        # id, title, description, deadline, priority, created_at, completed, tag
        cursor.execute("""
            SELECT task_id FROM task_users WHERE user_id = %s""", user_id)
        task_id = cursor.fetchall
        cursor.execute("""        
            SELECT id, title, description, deadline, priority, created_at, completed, tag FROM task WHERE id = %s
        """, (task_id,))

        tasks = cursor.fetchall()
        cursor.close()
        db.close()
        return tasks