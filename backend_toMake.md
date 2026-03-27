# Backend - Календарь (Вариант 2: Balanced)

## 1. Схемы (schemas.py)

### TaskCreate
- Изменить `deadline` с `Optional[datetime]` на обязательное или оставить опциональным
- Убедиться что принимает ISO 8601 формат

### TaskResponse (если есть)
- Добавить поле `deadline` в ответ
- Форматировать в ISO 8601


## 2. CRUD операции (database/crud.py)

### Фильтрация по дате
- Добавить функцию `get_tasks_by_date(user_id, date)` 
  - Фильтр: `WHERE DATE(deadline) = date`
  
- Добавить функцию `get_tasks_by_month(user_id, year, month)`
  - Фильтр: `WHERE EXTRACT(YEAR FROM deadline) = year AND EXTRACT(MONTH FROM deadline) = month`

### Сортировка
- В `get_tasks()` добавить сортировку по `deadline ASC` (задачи с ближайшим дедлайном первыми)
- Задачи без дедлайна в конце


## 3. Endpoints (main.py)

### Новые роуты

**GET /tasks/by-date**
- Query параметр: `date` (формат: YYYY-MM-DD)
- Возвращает задачи на конкретную дату
- Пример: `/tasks/by-date?date=2024-03-27`

**GET /tasks/by-month**
- Query параметры: `year`, `month`
- Возвращает все задачи за месяц
- Пример: `/tasks/by-month?year=2024&month=3`

**GET /tasks/upcoming** (опционально)
- Возвращает задачи на ближайшие 7 дней
- Полезно для виджета "Предстоящие задачи"


## 4. Обновление существующих endpoints

### POST /createtask
- Убедиться что `deadline` корректно сохраняется в БД
- Валидация: дата не может быть раньше `created_at` (опционально)

### PUT /updatetask/{task_id}
- Разрешить обновление `deadline`
- Можно установить `deadline = NULL` (убрать дедлайн)

### GET /gettask
- Добавить `deadline` в ответ (если еще не добавлено)
- Сортировка по `deadline ASC NULLS LAST`


## 5. Миграции БД (если нужно)

### Проверить поле deadline
- Убедиться что тип `TIMESTAMP` (уже есть в models.py)
- Добавить индекс на `deadline` для быстрых запросов:
  ```sql
  CREATE INDEX idx_task_deadline ON task(deadline);
  ```


## 6. Валидация и обработка ошибок

### Валидация дат
- Проверка формата ISO 8601
- Обработка timezone (UTC или локальное время)
- Ошибка 400 если формат даты неверный

### Edge cases
- Задачи без дедлайна (NULL) - не ломают фильтрацию
- Просроченные задачи - отдельный флаг `is_overdue` (опционально)


## Приоритет реализации

1. **Высокий**: Обновить POST /createtask для приема deadline
2. **Высокий**: Добавить GET /tasks/by-month
3. **Средний**: Добавить GET /tasks/by-date
4. **Средний**: Сортировка по deadline в GET /gettask
5. **Низкий**: GET /tasks/upcoming
6. **Низкий**: Индекс на deadline
