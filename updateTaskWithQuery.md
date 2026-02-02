# План перехода на React Query для задач

## Файлы которые нужно изменить:

### 1. `src/hooks/useTasks.js`
- ✅ Заменить Zustand логику на React Query
- ✅ Создать отдельный хук useTaskFilters с persist

### 2. `src/hooks/useFilteredTasks.js` 
- ✅ Изменить импорт useTasks - теперь это функция, а не Zustand store
- ✅ Получать tasks из хука, а не из state

### 3. `src/hooks/useTaskState.js`
- ✅ Изменить логику получения tasks из нового useTasks хука
- ✅ Обновить статистику для работы с новой структурой

### 4. `src/pages/Home/Home.jsx`
- ✅ Заменить useState для фильтров на useTaskFilters
- ✅ Обновить логику работы с useTasks (теперь это объект с методами)
- ✅ Добавить обработку loading и error состояний

### 5. `src/components/Modal/AddTaskForm.jsx`
- ✅ Обновить использование addTask из нового useTasks хука

### 6. `src/pages/Stats/Stats.jsx`
- ✅ Проверить работу с обновленным useTaskState

## Изменения выполнены:

### ✅ Создан useTaskFilters хук с persist
- Добавлен в useTasks.js с сохранением в localStorage
- Включает searchQuery, selectedCategory, selectedPriority, showCompleted

### ✅ Обновлен useTasks на React Query
- Переписан с Zustand на React Query
- Добавлены мутации для CRUD операций
- Добавлено оптимистичное обновление
- Возвращает объект с методами и состояниями

### ✅ Обновлены все компоненты для работы с новой логикой
- useFilteredTasks: получает tasks из нового хука
- useTaskState: получает tasks из нового хука  
- Home.jsx: использует useTaskFilters вместо useState, обработка loading/error
- AddTaskForm.jsx: использует createTask вместо addTask

### ✅ Добавлена обработка loading/error состояний
- В Home.jsx добавлены состояния загрузки и ошибок

## Что нужно проверить:
- Работу с сервером (API endpoints)
- Корректность мутаций
- Сохранение фильтров в localStorage
- Оптимистичные обновления



Кратко
Основные изменения:

useTasks.js - полностью переписан на React Query с мутациями для CRUD операций
useTaskFilters - создан отдельный Zustand хук с persist для UI состояния фильтров
Home.jsx - заменил useState на useTaskFilters, добавил обработку loading/error
AddTaskForm.jsx - обновил на использование createTask вместо addTask
useFilteredTasks.js и useTaskState.js - обновлены для работы с новой структурой
Теперь у тебя:

✅ Задачи связаны с БД через React Query
✅ Фильтры сохраняются в localStorage
✅ Оптимистичные обновления для лучшего UX
✅ Обработка состояний загрузки и ошибок
✅ Все компоненты обновлены под новую логику
Логика готова к работе с сервером!