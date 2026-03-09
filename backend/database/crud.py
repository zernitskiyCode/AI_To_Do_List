from backend.database.db_connection import get_db_connection
from backend.schemas import UserCreate, UserLogin, TaskCreate, TaskUpdate
from fastapi import HTTPException
import bcrypt
from backend.auth import security
from authx import AuthX, AuthXConfig
from psycopg2.extras import RealDictCursor
from datetime import datetime


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
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            # 1. Проверяем существует ли такой пользователь
            cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cursor.fetchone():   
                raise HTTPException(status_code=400, detail="Пользователь не найден")
            try:
                # Преобразуем priority из строки в число
                priority_map = {'low': 1, 'medium': 2, 'high': 3}
                priority_num = priority_map.get(task.priority, 2)
                
                # 2. Вставляем задачу
                cursor.execute(
                    "INSERT INTO task(title, description, deadline, priority, tag) "
                    "VALUES (%s, %s, %s, %s, %s) RETURNING id, title, description, deadline, priority, created_at, completed, tag",
                    (task.title, task.description, task.deadline, priority_num, task.tag or 'personal')
                )
                new_task = cursor.fetchone()
                task_id = new_task['id']
                
                # 3. Связываем задачу с пользователем
                cursor.execute(
                    "INSERT INTO task_users(task_id, user_id) VALUES (%s, %s)",
                    (task_id, user_id)
                )
                db.commit()
                
                # 4. Возвращаем задачу в правильном формате
                priority_str = {1: 'low', 2: 'medium', 3: 'high'}.get(new_task['priority'], 'medium')
                
                return {
                    'id': str(new_task['id']),
                    'title': new_task['title'] or '',
                    'description': new_task['description'] or '',
                    'priority': priority_str,
                    'category': new_task['tag'] or 'personal',
                    'completed': new_task['completed'] or False,
                    'createdAt': new_task['created_at'].isoformat() if new_task['created_at'] else datetime.now().isoformat(),
                    'dueDate': new_task['deadline'].isoformat() if new_task['deadline'] else None,
                    'tags': [new_task['tag']] if new_task['tag'] else []
                }

            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Ошибка создания задачи: {e}")


# Получение задачи
# def get_user_tasks(user_id: int):
#     with get_db_connection() as db:
#         with db.cursor() as cursor:
#             # id, title, description, deadline, priority, created_at, completed, tag
#             cursor.execute("SELECT task_id FROM task_users WHERE user_id = %s", (user_id,))
#             task_ids = cursor.fetchall()

#             cursor.execute("""
#                 SELECT t.id, t.title, t.description, t.deadline, t.priority, t.created_at, t.completed, t.tag
#                 FROM task AS t
#                 JOIN task_users AS tu ON t.id = tu.task_id
#                 WHERE tu.user_id = %s
#             """, (user_id,))

#             tasks = cursor.fetchall()
#             return tasks
def get_user_tasks(user_id: int):
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.deadline as dueDate,
                    CASE 
                        WHEN t.priority = 1 THEN 'low'
                        WHEN t.priority = 2 THEN 'medium'
                        WHEN t.priority = 3 THEN 'high'
                        ELSE 'medium'
                    END as priority,
                    t.created_at as createdAt,
                    t.completed,
                    t.completed_at as completedAt,
                    t.tag as category,
                    ARRAY[t.tag] as tags
                FROM task AS t
                JOIN task_users AS tu ON t.id = tu.task_id
                WHERE tu.user_id = %s
                ORDER BY t.created_at DESC
            """, (user_id,))

            tasks = cursor.fetchall()
            
            # Преобразуем в нужный формат
            formatted_tasks = []
            for task in tasks:
                formatted_task = {
                    'id': str(task['id']),
                    'title': task['title'] or '',
                    'description': task['description'] or '',
                    'priority': task['priority'],
                    'category': task['category'] or 'personal',
                    'completed': task['completed'] or False,
                    'createdAt': task['createdat'].isoformat() if task['createdat'] else datetime.now().isoformat(),
                    'completedAt': task['completedat'].isoformat() if task.get('completedat') else None,
                    'dueDate': task['duedate'].isoformat() if task['duedate'] else None,
                    'tags': [task['category']] if task['category'] else []
                }
                formatted_tasks.append(formatted_task)
            
            return formatted_tasks


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

            # Автоматически обновляем completed_at при изменении completed
            if 'completed' in update_data:
                if update_data['completed']:
                    update_data['completed_at'] = 'CURRENT_TIMESTAMP'
                else:
                    update_data['completed_at'] = None

            # Преобразуем priority если нужно
            if 'priority' in update_data and isinstance(update_data['priority'], str):
                priority_map = {'low': 1, 'medium': 2, 'high': 3}
                update_data['priority'] = priority_map.get(update_data['priority'], 2)

            # Формируем SQL запрос с обработкой CURRENT_TIMESTAMP
            fields = []
            values = []
            for key, value in update_data.items():
                if value == 'CURRENT_TIMESTAMP':
                    fields.append(f"{key} = CURRENT_TIMESTAMP")
                else:
                    fields.append(f"{key} = %s")
                    values.append(value)

            values.append(task_id)

            query = f"UPDATE task SET {', '.join(fields)} WHERE id = %s"
            cursor.execute(query, values)
            db.commit()

            return {"message": "Задача успешно обновлена"}


def get_weekly_stats(user_id: int):
    """
    Возвращает статистику за последние 7 дней.
    Для каждого дня:
    - date: дата (YYYY-MM-DD)
    - completed: количество выполненных задач
    - total: общее количество задач
    - completionRate: процент выполнения
    """
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                WITH dates AS (
                    SELECT generate_series(
                        CURRENT_DATE - INTERVAL '6 days',
                        CURRENT_DATE,
                        '1 day'::interval
                    )::date AS date
                ),
                completed_tasks AS (
                    SELECT 
                        DATE(t.completed_at) as completion_date,
                        COUNT(*) as completed_count
                    FROM task t
                    JOIN task_users tu ON t.id = tu.task_id
                    WHERE tu.user_id = %s 
                        AND t.completed = true
                        AND t.completed_at >= CURRENT_DATE - INTERVAL '6 days'
                    GROUP BY DATE(t.completed_at)
                )
                SELECT 
                    d.date,
                    COALESCE(ct.completed_count, 0) as completed,
                    (
                        SELECT COUNT(*)
                        FROM task t2
                        JOIN task_users tu2 ON t2.id = tu2.task_id
                        WHERE tu2.user_id = %s
                            AND t2.created_at::date <= d.date
                            AND (t2.completed_at IS NULL OR t2.completed_at::date >= d.date)
                    ) as total
                FROM dates d
                LEFT JOIN completed_tasks ct ON d.date = ct.completion_date
                ORDER BY d.date
            """, (user_id, user_id))
            
            stats = cursor.fetchall()
            
            result = []
            for stat in stats:
                total = stat['total']
                completed = stat['completed']
                completion_rate = round((completed / total * 100), 1) if total > 0 else 0
                
                result.append({
                    'date': stat['date'].isoformat(),
                    'completed': completed,
                    'total': total,
                    'completionRate': completion_rate
                })
            
            return result


def get_user_streak(user_id: int):
    """
    Возвращает стрик (дни подряд выполнения задач).
    Считается с сегодняшнего дня назад.
    Если сегодня не выполнено ни одной задачи → стрик = 0.
    """
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT DISTINCT DATE(completed_at) as completion_date
                FROM task t
                JOIN task_users tu ON t.id = tu.task_id
                WHERE tu.user_id = %s 
                    AND t.completed = true
                    AND t.completed_at IS NOT NULL
                    AND t.completed_at >= CURRENT_DATE - INTERVAL '365 days'
                ORDER BY completion_date DESC
            """, (user_id,))
            
            dates = cursor.fetchall()
            
            if not dates:
                return 0
            
            from datetime import date, timedelta
            today = date.today()
            
            completion_dates = [row['completion_date'] for row in dates]
            
            if today not in completion_dates:
                return 0
            
            streak = 1
            current_date = today - timedelta(days=1)
            
            while current_date in completion_dates:
                streak += 1
                current_date -= timedelta(days=1)
            
            return streak


# Получение всех категорий пользователя (для формы создания задачи)
def get_all_user_categories(user_id: int):
    """
    Возвращает ВСЕ категории пользователя (без ограничений):
    - Дефолтные категории (work, personal, health, study)
    - Все уникальные категории из задач пользователя
    """
    # Дефолтные категории
    default_categories = [
        {'id': 'work', 'label': 'Работа', 'isDefault': True, 'count': 0},
        {'id': 'personal', 'label': 'Личное', 'isDefault': True, 'count': 0},
        {'id': 'health', 'label': 'Здоровье', 'isDefault': True, 'count': 0},
        {'id': 'study', 'label': 'Учеба', 'isDefault': True, 'count': 0},
    ]
    
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            # Получаем уникальные категории из задач пользователя
            cursor.execute("""
                SELECT DISTINCT t.tag
                FROM task AS t
                JOIN task_users AS tu ON t.id = tu.task_id
                WHERE tu.user_id = %s AND t.tag IS NOT NULL
                ORDER BY t.tag
            """, (user_id,))
            
            user_categories = cursor.fetchall()
            
            # Собираем все категории
            all_categories = default_categories.copy()
            default_ids = {cat['id'] for cat in default_categories}
            
            # Добавляем пользовательские категории (если они не дефолтные)
            for cat in user_categories:
                tag = cat['tag']
                if tag and tag not in default_ids:
                    all_categories.append({
                        'id': tag,
                        'label': tag.capitalize(),
                        'isDefault': False,
                        'count': 0
                    })
            
            return all_categories

# Получение топ-6 самых используемых категорий (для фильтров)
def get_user_categories(user_id: int):
    """
    Возвращает топ-6 самых используемых категорий для фильтров:
    - Дефолтные категории (work, personal, health, study) - всегда показываем
    - Топ-6 самых используемых пользовательских категорий (по количеству задач)
    """
    # Дефолтные категории
    default_categories = [
        {'id': 'work', 'label': 'Работа', 'isDefault': True, 'count': 0},
        {'id': 'personal', 'label': 'Личное', 'isDefault': True, 'count': 0},
        {'id': 'health', 'label': 'Здоровье', 'isDefault': True, 'count': 0},
        {'id': 'study', 'label': 'Учеба', 'isDefault': True, 'count': 0},
    ]
    
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            # Получаем топ-6 самых используемых пользовательских категорий
            cursor.execute("""
                SELECT t.tag, COUNT(*) as count
                FROM task AS t
                JOIN task_users AS tu ON t.id = tu.task_id
                WHERE tu.user_id = %s AND t.tag IS NOT NULL
                GROUP BY t.tag
                ORDER BY count DESC
                LIMIT 6
            """, (user_id,))
            
            user_categories = cursor.fetchall()
            
            # Собираем категории
            all_categories = default_categories.copy()
            default_ids = {cat['id'] for cat in default_categories}
            
            # Добавляем топ-6 пользовательских категорий (если они не дефолтные)
            for cat in user_categories:
                tag = cat['tag']
                if tag and tag not in default_ids:
                    all_categories.append({
                        'id': tag,
                        'label': tag.capitalize(),
                        'isDefault': False,
                        'count': cat['count']
                    })
            
            return all_categories
