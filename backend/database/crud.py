from backend.database.db_connection import get_db_connection
from backend.schemas import UserCreate, UserLogin, TaskCreate
from fastapi import HTTPException


# Добавление пользователя
def create_user(user : UserCreate):
    db = get_db_connection()
    cursor = db.cursor()
    # 1. Проверяем существует ли такой пользователь
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
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
    cursor.execute("SELECT id FROM users WHERE email = %s AND password = %s", (user.email, user.password))
    db_user = cursor.fetchone()
    db.commit()
    cursor.close()
    db.close()
    if db_user:
        return db_user[0]
    else:
        raise ValueError("Пользователь не найден.")

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
    cursor.execute("INSERT INTO task(title, description, deadline, priority, tag) VALUES(%s, %s, %s, %s, %s) RETURNING id", (task.title, task.description, task.deadline, task.priority, task.tag))
    task_id = cursor.fetchone()[0]
    cursor.execute("""
        INSERT INTO task_users (task_id, user_id)
        VALUES (%s, %s)
        """, (task_id, task.user_id))
    db.close()
    cursor.close()
    return task_id


# Переписать с join
# Готово
# Получение задачи
def get_user_tasks(user_id: int):
        db = get_db_connection()
        cursor = db.cursor()
        # id, title, description, deadline, priority, created_at, completed, tag
        cursor.execute("SELECT task_id FROM task_users WHERE user_id = %s", (user_id,))
        task_id = cursor.fetchall
        cursor.execute("""
        SELECT t.id, t.title, t.description, t.deadline, t.priority, t.created_at, t.completed, t.tag
        FROM task AS t
        JOIN task_users AS tu ON t.id = tu.task_id
        WHERE tu.user_id = %s
    """, (user_id,))

        tasks = cursor.fetchall()
        cursor.close()
        db.close()
        return tasks

#   Удаление задачи по id
def delete_task_id(task_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        # Проверяем, существует ли задача с указанным ID
        cursor.execute("SELECT id FROM task WHERE id = %s", (task_id,))
        task = cursor.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Задача не найдена")

        # Удаляем задачу из таблицы task_users
        cursor.execute("DELETE FROM task_users WHERE task_id = %s", (task_id,))

        # Удаляем задачу из таблицы task
        cursor.execute("DELETE FROM task WHERE id = %s", (task_id,))

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении задачи: {e}")
    finally:
        cursor.close()
        db.close()