from backend.database.db_connection import get_db_connection
from backend.schemas import UserCreate, UserLogin, TaskCreate, TaskUpdate
from fastapi import HTTPException
import bcrypt
from backend.auth import security
from authx import AuthX, AuthXConfig

# Добавление пользователя
def create_user(user: UserCreate):
    # db = get_db_connection()
    with get_db_connection() as db:
        # cursor = db.cursor()
        with db.cursor() as cursor:
            try:
                # Проверка существующего пользователя
                cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
                if cursor.fetchone():  # <- обязательно скобки!
                    raise HTTPException(status_code=400, detail="Пользователь с таким email уже зарегистрирован.")

                # хеширование пароля
                hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

                # Добавляем пользователя
                cursor.execute(
                    "INSERT INTO users(name, surname, email, password) VALUES (%s, %s, %s, %s) RETURNING id",
                    (user.name, user.surname, user.email, hashed_password)
                )
                user_id = cursor.fetchone()[0]
                db.commit()
                token = security.create_access_token(uid=str(user_id))
                # return {"access_token": token}
                return token

            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=500, detail=str(e))


# Авторизация
def authenticate_user(user: UserLogin):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            # 1. Получаем пользователя по email
            cursor.execute("SELECT password, id FROM users WHERE email = %s", (user.email,))
            row = cursor.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Пользователь не найден")

            db_hashed_password, user_id = row

            # 2. Проверяем пароль
            if bcrypt.checkpw(user.password.encode('utf-8'), db_hashed_password.encode('utf-8')):
                # Пароль верный → возвращаем token
                token = security.create_access_token(uid=str(user_id))
                # return {"access_token": token}
                return token
            else:
                raise HTTPException(status_code=401, detail="Неверный пароль")
            
def get_user_by_id(user_id: int):
    """Берет пользователя из БД по id"""
    with get_db_connection() as db:
        with db.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, surname, email FROM users WHERE id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            if not user:
                return None
            return {
                "id": user[0],
                "name": user[1],
                "surname": user[2],
                "email": user[3]
            }

# Получение информации о пользователе по id
def get_info(user_id : int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            # db = get_db_connection()
            # cursor = db.cursor()
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")
            return dict(user)
# передаешь id пользователя, получаешь name, surname, email
def get_info_profile(user_id : int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            cursor.execute("""SELECT name, surname, email FROM users WHERE ID =%s""", (user_id, )) 
            data = cursor.fetchall()
            if data:
                return data
            else:
                raise HTTPException(status_code=404, detail="Пользователь не найден")
            # создание задачи
def create_task(task: TaskCreate, user_id: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            # 1. Проверяем существует ли такой пользователь
            cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cursor.fetchone():   
                raise HTTPException(status_code=400, detail="Пользователь не найден")
            try:
                # 2. Вставляем задачу
                cursor.execute(
                    "INSERT INTO task(title, description, deadline, priority, tag) "
                    "VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (task.title, task.description, task.deadline, task.priority, task.tag)
                )
                task_id = cursor.fetchone()[0]
                # 3. Связываем задачу с пользователем
                cursor.execute(
                    "INSERT INTO task_users(task_id, user_id) VALUES (%s, %s)",
                    (task_id, user_id)
                )
                db.commit()
                return task_id

            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Ошибка создания задачи: {e}")


# Получение задачи
def get_user_tasks(user_id: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            # id, title, description, deadline, priority, created_at, completed, tag
            cursor.execute("SELECT task_id FROM task_users WHERE user_id = %s", (user_id,))
            task_ids = cursor.fetchall()

            cursor.execute("""
                SELECT t.id, t.title, t.description, t.deadline, t.priority, t.created_at, t.completed, t.tag
                FROM task AS t
                JOIN task_users AS tu ON t.id = tu.task_id
                WHERE tu.user_id = %s
            """, (user_id,))

            tasks = cursor.fetchall()
            return tasks


# Удаление задачи по id
def delete_task_id(task_id: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
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

def update_task(task_id: int, data: TaskUpdate, user_id: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            #  Проверяем, что задача принадлежит пользователю
            cursor.execute(
                "SELECT 1 FROM task_users WHERE task_id = %s AND user_id = %s",
                (task_id, user_id)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=403, detail="Нет доступа к задаче")
            
            # Берём только переданные поля
            update_data = data.model_dump(exclude_unset=True)
            if not update_data:
                raise HTTPException(status_code=400, detail="Нет данных для обновления")

            #  Формируем SET часть SQL
            # Хуйня ебучая разобраться и переписать
            fields = [f"{key} = %s" for key in update_data.keys()]
            values = list(update_data.values())
            values.append(task_id)  # id для WHERE

            query = f"UPDATE task SET {', '.join(fields)} WHERE id = %s"
            cursor.execute(query, values)
            db.commit()
            # Хуйня ебучая разобраться и переписать

            return {"message": "Задача успешно обновлена"}