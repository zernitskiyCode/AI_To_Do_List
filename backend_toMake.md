# Backend - Календарь (Вариант 2: Balanced)

## ✅ Что уже работает:

### 1. Схемы (schemas.py) ✅ ГОТОВО
- ✅ `TaskCreate` уже принимает `deadline: Optional[datetime]`
- ✅ Формат ISO 8601 поддерживается
- ✅ `TaskUpdate` поддерживает обновление `deadline`

### 2. CRUD операции (database/crud.py) ✅ ЧАСТИЧНО ГОТОВО
- ✅ `create_task()` сохраняет `deadline` в БД
- ✅ `get_user_tasks()` возвращает `dueDate` (маппинг из `deadline`)
- ✅ `update_task()` поддерживает обновление `deadline`

### 3. Endpoints (main.py) ✅ ЧАСТИЧНО ГОТОВО
- ✅ **POST /createtask** - принимает и сохраняет `deadline`
- ✅ **PUT /updatetask/{task_id}** - можно обновить `deadline`
- ✅ **GET /gettask** - возвращает задачи с `dueDate`
- ✅ **DELETE /deletetask/{task_id}** - удаление задач работает

### 4. База данных ✅ ГОТОВО
- ✅ Поле `deadline TIMESTAMP` существует в таблице `task`
- ✅ Поле `completed_at TIMESTAMP` для отслеживания завершения

---

## ❌ Что НЕ реализовано (на будущее):

### Фильтрация по дате (пока не нужно - все на фронте)
- ❌ `get_tasks_by_date(user_id, date)` - фильтр по конкретной дате
- ❌ `get_tasks_by_month(user_id, year, month)` - фильтр по месяцу

### Новые endpoints (пока не нужны)
- ❌ **GET /tasks/by-date?date=YYYY-MM-DD** - задачи на конкретную дату
- ❌ **GET /tasks/by-month?year=2024&month=3** - задачи за месяц
- ❌ **GET /tasks/upcoming** - задачи на ближайшие 7 дней

### Оптимизация
- ❌ Сортировка по `deadline ASC NULLS LAST` в `get_user_tasks()`
- ❌ Индекс на `deadline` для быстрых запросов
- ❌ Автоматическое удаление/архивация истекших задач

### Валидация
- ❌ Проверка что `deadline` не раньше `created_at`
- ❌ Флаг `is_overdue` для просроченных задач

---

## 🎯 Рекомендации для будущего:

### Когда понадобятся endpoints по датам:
- Если задач станет 1000+ (медленная фильтрация на фронте)
- Если нужна статистика по месяцам из БД
- Если нужна пагинация календаря

### Автоудаление истекших задач:
**Вариант 1: Soft delete (архивация)**
```sql
ALTER TABLE task ADD COLUMN is_archived BOOLEAN DEFAULT false;
UPDATE task SET is_archived = true 
WHERE deadline < NOW() - INTERVAL '30 days' AND completed = false;
```

**Вариант 2: Cron job (периодическое удаление)**
```python
# Каждую ночь в 00:00
DELETE FROM task 
WHERE deadline < NOW() - INTERVAL '30 days' AND completed = false;
```

**Вариант 3: Фильтрация в запросе**
```python
# В get_user_tasks() добавить:
WHERE (deadline IS NULL OR deadline >= NOW() - INTERVAL '7 days')
```

---

## 📊 Текущее состояние:

**Что работает:**
- Создание задач с `deadline` ✅
- Обновление `deadline` ✅
- Получение задач с `dueDate` ✅
- Удаление задач ✅

**Что НЕ нужно пока:**
- Фильтрация по датам на бэкенде (все на фронте)
- Автоудаление (задачи остаются в БД)

**Вывод:** Бэкенд готов для текущей версии календаря! 🎉
