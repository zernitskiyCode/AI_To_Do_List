# Stats Integration Changes Log

## Цель
Подключение реальных API endpoints для страницы статистики и подготовка фронтенда для работы с `completed_at`.

---

## Изменения

### 1. Подготовка фронтенда для работы с `completed_at`
- [x] Обновлен `toggleComplete` в `useTasks.js` - добавлена запись `completedAt`
  - При завершении задачи: `completedAt = new Date().toISOString()`
  - При отмене завершения: `completedAt = null`

### 1.5. КРИТИЧЕСКОЕ: Добавлены отсутствующие backend endpoints
- [x] Добавлена функция `get_weekly_stats()` в `backend/database/crud.py`
- [x] Добавлена функция `get_user_streak()` в `backend/database/crud.py`
- [x] Добавлен endpoint `GET /stats/weekly` в `backend/main.py`
- [x] Добавлен endpoint `GET /stats/streak` в `backend/main.py`
- [x] Обновлены импорты в `backend/main.py`
- [x] Добавлено поле `completed_at` в `backend/database/models.py`
- [x] Создана функция миграции `migrate_add_completed_at()` для существующих БД
- [x] Обновлен `update_task()` - автоматическая запись `completed_at`
- [x] Обновлен `get_user_tasks()` - возврат `completedAt` в ответе

### 2. Подключение реальных API endpoints
- [x] Обновлен `useWeeklyStats.js` - подключен реальный API `/stats/weekly`
  - Удалена логика с `USE_MOCK_DATA`
  - Прямой вызов `Api.get('/stats/weekly')`
- [x] Обновлен `useStreak` - подключен реальный API `/stats/streak`
  - Удалена логика с `USE_MOCK_DATA`
  - Прямой вызов `Api.get('/stats/streak')`
  - Извлечение `streak` из `response.data.streak`

### 3. Удаление mock данных
- [x] Удален файл `src/mocks/mockStatsData.js`
- [x] Удален файл `src/config/config.js` (больше не нужен флаг `USE_MOCK_DATA`)
- [x] Удалены все импорты mock функций из `useWeeklyStats.js`

---

## 4. Оптимизация и исправление багов

### Проблема: Куча повторных запросов при toggleComplete
- **Причина 1**: `invalidateQueries(['tasks'])` в `onSuccess` вызывал перезагрузку задач
- **Причина 2**: Дублирование QueryClient в `main.jsx` и `App.jsx` вызывало конфликты
- **Решение**: 
  - Убрали инвалидацию tasks, т.к. мы уже обновили их оптимистично в `onMutate`
  - Удалили дублирование QueryClient из `App.jsx`
  - Настроили глобальные дефолтные опции в `main.jsx`

### Изменения:
- [x] Исправлен `onError` callback - правильные параметры `(error, variables, context)`
- [x] Оптимизирован `toggleComplete` - убрана `invalidateQueries(['tasks'])`
- [x] **КРИТИЧНО**: Удалено дублирование QueryClient из `App.jsx`
- [x] Настроены глобальные дефолтные опции QueryClient в `main.jsx`

### Результат:
- Теперь при изменении статуса задачи делается только 1 запрос к API
- Статистика обновляется автоматически
- UI обновляется мгновенно (оптимистичное обновление)

---

## 5. Финальное решение проблемы каскада запросов

### Проблема:
Любая инвалидация статистики (`weeklyStats`, `streak`) вызывала каскад запросов

### Решение:
Полностью убрали автоматическую инвалидацию статистики из `toggleComplete`

### Компромисс:
- ✅ toggleComplete работает идеально - только 1 запрос
- ✅ UI обновляется мгновенно
- ⚠️ Статистика обновится при следующем заходе на страницу Stats (или при перезагрузке)
- ⚠️ Кеш статистики - 5 минут

---

## 6. Исправление проблемы двойного клика

### Проблема:
При быстром двойном клике на чекбокс задача сначала завершалась, а потом сразу отменялась. В БД оставалось `completed=False, completed_at=None`.

### Причина:
UI позволял кликнуть дважды до завершения первого запроса

### Решение:
1. Добавлен флаг `isPending` из mutation
2. Кнопка блокируется (`disabled`) пока идет запрос
3. Визуальная индикация (opacity 0.5) во время обновления

### Файлы:
- `src/hooks/useTasks.js` - добавлен флаг isTogglingComplete
- `src/components/TaskList/TaskList.jsx` - блокировка кнопки при обновлении

---

## 7. КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Race condition в toggleComplete

### Проблема:
После перезагрузки страницы (F5) данные показывали `completed: false, completedAt: null`, хотя UI показывал что задача завершена.

### Причина:
Race condition в `toggleComplete` - функция читала старое значение `completed` из кеша ПОСЛЕ того как `onMutate` уже изменил его оптимистично. В результате:
1. `onMutate` меняет `completed: false → true` в кеше
2. `mutationFn` читает кеш и видит уже измененное значение `completed: true`
3. `mutationFn` вычисляет `newCompleted = !true = false`
4. Отправляет на backend `completed: false` вместо `completed: true`

### Решение:
Изменена логика `toggleComplete`:
1. Вычисление `newCompleted` перенесено в `onMutate` (до изменения кеша)
2. `newCompleted` передается через context в `mutationFn`
3. Обертка в `return` для удобного вызова `toggleComplete(taskId)`

### Код:
```javascript
// До (НЕПРАВИЛЬНО):
mutationFn: ({ taskId }) => {
  const currentTasks = queryClient.getQueryData(['tasks']) || [];
  const currentTask = currentTasks.find(task => task.id === taskId);
  const newCompleted = !currentTask?.completed; // ❌ Читает уже измененное значение
  return updateTaskInDB(taskId, { completed: newCompleted });
}

// После (ПРАВИЛЬНО):
mutationFn: ({ taskId, newCompleted }) => {
  return updateTaskInDB(taskId, { completed: newCompleted });
},
onMutate: async ({ taskId }) => {
  const previousTasks = queryClient.getQueryData(['tasks']);
  const currentTask = previousTasks.find(task => task.id === taskId);
  const newCompleted = !currentTask?.completed; // ✅ Читает ДО изменения
  // ... обновляем кеш ...
  return { previousTasks, newCompleted };
}
```

### Файлы:
- `src/hooks/useTasks.js` - исправлена логика toggleComplete
- `src/pages/Home/Home.jsx` - обновлен вызов toggleComplete

### Результат:
✅ Данные корректно сохраняются в БД
✅ completedAt записывается правильно
✅ После перезагрузки страницы данные сохраняются
✅ Статистика работает корректно

---

## ✅ Финальный результат

### Что работает:
1. ✅ toggleComplete - только 1 запрос, никаких дублей
2. ✅ Защита от двойного клика
3. ✅ completed_at записывается в БД корректно
4. ✅ Данные сохраняются после перезагрузки страницы
5. ✅ Статистика показывает реальные данные
6. ✅ Оптимистичные обновления UI
7. ✅ Минимум запросов к API

### Компромиссы:
- Статистика обновляется при заходе на страницу Stats (не автоматически)
- Кеш статистики - 5 минут

### Итоговые изменения фронтенда:
- `src/main.jsx` - настройка QueryClient с дефолтными опциями
- `src/App.jsx` - удалено дублирование QueryClient
- `src/hooks/useTasks.js` - исправлена race condition в toggleComplete
- `src/hooks/getTasks.js` - чистый код без логов
- `src/hooks/useWeeklyStats.js` - подключены реальные API
- `src/pages/Home/Home.jsx` - обновлен вызов toggleComplete
- `src/components/TaskList/TaskList.jsx` - блокировка при обновлении

### Итоговые изменения бэкенда:
- `backend/database/models.py` - добавлено поле completed_at + миграция
- `backend/database/crud.py` - функции get_weekly_stats, get_user_streak, обновлен update_task и get_user_tasks
- `backend/main.py` - endpoints /stats/weekly, /stats/streak

### Все debug логи удалены из production кода
