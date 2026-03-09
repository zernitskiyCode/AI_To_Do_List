# Backend Tasks - Статистика для страницы Stats

## 🎯 Цель
Добавить функционал для отслеживания статистики выполнения задач:
- Дата завершения задачи
- Статистика за неделю (7 дней)
- Стрик (дни подряд выполнения задач)

---

## 📋 Задача 1: Добавить поле `completed_at`

### Зачем?
Нужно знать КОГДА задача была завершена, чтобы:
- Считать статистику по дням
- Определять стрик (дни подряд)
- Строить графики

### Что делать:

#### 1.1. Обновить таблицу в БД

**Файл**: `backend/database/models.py`

Найди функцию `init_db()` и в CREATE TABLE для `task` добавь новое поле:

```python
cursor.execute(""" 
CREATE TABLE IF NOT EXISTS task(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT False,
    completed_at TIMESTAMP DEFAULT NULL,  -- ← ДОБАВЬ ЭТУ СТРОКУ
    tag TEXT NOT NULL)
""")
```

#### 1.2. Миграция для существующей БД

Если таблица уже создана, выполни SQL:

```sql
ALTER TABLE task ADD COLUMN completed_at TIMESTAMP DEFAULT NULL;
```

#### 1.3. Автоматическое обновление `completed_at`

**Файл**: `backend/database/crud.py`

Найди функцию `update_task` и измени её:

```python
def update_task(task_id: int, data: TaskUpdate, user_id: int):
    with get_db_connection() as db:
        with db.cursor() as cursor:
            # Проверяем доступ
            cursor.execute(
                "SELECT 1 FROM task_users WHERE task_id = %s AND user_id = %s",
                (task_id, user_id)
            )
            if not cursor.fetchone():
                raise HTTPException(status_code=403, detail="Нет доступа к задаче")
            
            update_data = data.model_dump(exclude_unset=True)
            
            if not update_data:
                raise HTTPException(status_code=400, detail="Нет данных для обновления")

            # ← ДОБАВЬ ЭТУ ЛОГИКУ
            # Автоматически обновляем completed_at при изменении completed
            if 'completed' in update_data:
                if update_data['completed']:
                    # Задача завершена → записываем текущее время
                    update_data['completed_at'] = 'CURRENT_TIMESTAMP'
                else:
                    # Задача снова не завершена → сбрасываем дату
                    update_data['completed_at'] = None

            # Преобразуем priority если нужно
            if 'priority' in update_data and isinstance(update_data['priority'], str):
                priority_map = {'low': 1, 'medium': 2, 'high': 3}
                update_data['priority'] = priority_map.get(update_data['priority'], 2)

            # Формируем SQL запрос
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
```

#### 1.4. Возвращать `completed_at` в API

**Файл**: `backend/database/crud.py`

Найди функцию `get_user_tasks` и добавь `completed_at`:

```python
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
                    t.completed_at as completedAt,  -- ← ДОБАВЬ ЭТУ СТРОКУ
                    t.tag as category,
                    ARRAY[t.tag] as tags
                FROM task AS t
                JOIN task_users AS tu ON t.id = tu.task_id
                WHERE tu.user_id = %s
                ORDER BY t.created_at DESC
            """, (user_id,))

            tasks = cursor.fetchall()
            
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
                    'completedAt': task['completedat'].isoformat() if task['completedat'] else None,  # ← ДОБАВЬ
                    'dueDate': task['duedate'].isoformat() if task['duedate'] else None,
                    'tags': [task['category']] if task['category'] else []
                }
                formatted_tasks.append(formatted_task)
            
            return formatted_tasks
```

---

## 📋 Задача 2: Endpoint для статистики за неделю

### Зачем?
Для графика нужны данные: сколько задач выполнено каждый день за последние 7 дней.

### Что делать:

#### 2.1. Создать функцию в `crud.py`

**Файл**: `backend/database/crud.py`

Добавь новую функцию:

```python
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
                    -- Генерируем последние 7 дней
                    SELECT generate_series(
                        CURRENT_DATE - INTERVAL '6 days',
                        CURRENT_DATE,
                        '1 day'::interval
                    )::date AS date
                ),
                completed_tasks AS (
                    -- Считаем выполненные задачи по дням
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
                        -- Считаем общее количество задач на эту дату
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
            
            # Форматируем результат
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
```

#### 2.2. Создать endpoint в `main.py`

**Файл**: `backend/main.py`

Добавь новый endpoint:

```python
@app.get("/stats/weekly", tags=["Статистика"], summary="Статистика за неделю")
def get_weekly_statistics(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает статистику за последние 7 дней.
    
    Ответ: [
        {
            "date": "2026-02-15",
            "completed": 3,
            "total": 10,
            "completionRate": 30.0
        },
        ... (7 дней)
    ]
    """
    try:
        stats = get_weekly_stats(user_id)
        return stats
    except Exception as e:
        logger.error("Ошибка при получении недельной статистики: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка: {e}")
```

---

## 📋 Задача 3: Endpoint для стрика (дней подряд)

### Зачем?
Стрик мотивирует пользователя выполнять задачи каждый день.

### Что такое стрик?
Количество дней подряд (начиная с сегодня), когда пользователь выполнил хотя бы 1 задачу.

**Примеры**:
- Сегодня выполнил, вчера выполнил, позавчера нет → стрик = 2
- Сегодня не выполнил → стрик = 0

### Что делать:

#### 3.1. Создать функцию в `crud.py`

**Файл**: `backend/database/crud.py`

Добавь новую функцию:

```python
def get_user_streak(user_id: int):
    """
    Возвращает стрик (дни подряд выполнения задач).
    Считается с сегодняшнего дня назад.
    Если сегодня не выполнено ни одной задачи → стрик = 0.
    """
    with get_db_connection() as db:
        with db.cursor(cursor_factory=RealDictCursor) as cursor:
            # Получаем все даты выполнения задач за последний год
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
            
            # Проверяем стрик
            from datetime import date, timedelta
            today = date.today()
            
            completion_dates = [row['completion_date'] for row in dates]
            
            # Если сегодня нет выполненных задач → стрик = 0
            if today not in completion_dates:
                return 0
            
            # Считаем стрик (идем назад от сегодня)
            streak = 1
            current_date = today - timedelta(days=1)
            
            while current_date in completion_dates:
                streak += 1
                current_date -= timedelta(days=1)
            
            return streak
```

#### 3.2. Создать endpoint в `main.py`

**Файл**: `backend/main.py`

Добавь новый endpoint:

```python
@app.get("/stats/streak", tags=["Статистика"], summary="Стрик (дни подряд)")
def get_streak(user_id: int = Depends(get_current_user_id)):
    """
    Возвращает количество дней подряд выполнения задач.
    
    Ответ: { "streak": 7 }
    """
    try:
        streak = get_user_streak(user_id)
        return {"streak": streak}
    except Exception as e:
        logger.error("Ошибка при получении стрика: %s", e)
        raise HTTPException(status_code=500, detail=f"Ошибка: {e}")
```

---

## ✅ Чек-лист

- [ ] Добавить поле `completed_at` в таблицу `task`
- [ ] Выполнить миграцию БД (ALTER TABLE)
- [ ] Обновить `update_task` - автоматически устанавливать `completed_at`
- [ ] Обновить `get_user_tasks` - возвращать `completedAt`
- [ ] Создать функцию `get_weekly_stats` в `crud.py`
- [ ] Создать endpoint `GET /stats/weekly` в `main.py`
- [ ] Создать функцию `get_user_streak` в `crud.py`
- [ ] Создать endpoint `GET /stats/streak` в `main.py`
- [ ] Протестировать все endpoints

---

## 🧪 Тестирование

### 1. Проверить `completed_at`:
```bash
# Завершить задачу
curl -X PUT http://localhost:8000/updatetask/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Проверить что completed_at установлен
curl http://localhost:8000/gettask
```

### 2. Проверить статистику за неделю:
```bash
curl http://localhost:8000/stats/weekly
```

Ожидаемый ответ:
```json
[
  {
    "date": "2026-02-15",
    "completed": 3,
    "total": 10,
    "completionRate": 30.0
  },
  ...
]
```

### 3. Проверить стрик:
```bash
curl http://localhost:8000/stats/streak
```

Ожидаемый ответ:
```json
{
  "streak": 5
}
```

---

## 📝 Примечания

1. **completed_at автоматически обновляется** при изменении `completed`
2. **Стрик считается с сегодня** - если сегодня не выполнено задач, стрик = 0
3. **Статистика за 7 дней** - от сегодня назад (включая сегодня)
4. **Все запросы требуют авторизации** - используется `get_current_user_id`
