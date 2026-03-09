# 🚀 Быстрый старт: Новая система категорий

## Что изменилось?

✅ Теперь можно создавать свои категории для задач!

## Запуск

### 1. Backend
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows
python main.py
```

### 2. Frontend
```bash
npm run dev
```

## Быстрый тест

1. Откройте приложение
2. Нажмите "Добавить задачу"
3. Нажмите "+ Создать свою категорию"
4. Введите "Спорт"
5. Создайте задачу
6. ✅ Категория "Спорт" появится в фильтрах!

## Документация

- 📄 **update.md** - Полное описание всех изменений
- 🧪 **TESTING_CATEGORIES.md** - Инструкция по тестированию
- 🏗️ **ARCHITECTURE_CATEGORIES.md** - Архитектура решения
- ✅ **CHECKLIST.md** - Чеклист перед запуском
- 📖 **USER_GUIDE.md** - Руководство пользователя

## Измененные файлы

### Backend (2 файла)
- `backend/database/crud.py` - новая функция `get_user_categories()`
- `backend/main.py` - новый endpoint `GET /categories`

### Frontend (7 файлов)
- `src/hooks/getTasks.js` - новая функция `getCategories()`
- `src/hooks/useTasks.js` - новый хук `useCategories()`
- `src/components/Modal/AddTaskForm.jsx` - логика создания категорий
- `src/components/Modal/AddTaskForm.scss` - стили
- `src/components/TaskFilters/TaskFilters.jsx` - динамические категории
- `src/components/TaskFilters/TaskFilters.scss` - стили
- `src/components/TaskList/TaskList.jsx` - отображение категорий

## Проблемы?

### Категории не загружаются?
- Проверьте, что backend запущен
- Проверьте консоль браузера (F12)
- Проверьте, что вы авторизованы

### Новая категория не появляется?
- Обновите страницу (F5)
- Или создайте еще одну задачу

### Другие проблемы?
- Смотрите **CHECKLIST.md** для детальной диагностики

## 🎉 Готово!

Система категорий готова к использованию!
