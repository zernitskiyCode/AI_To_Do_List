# 🚀 Быстрая шпаргалка - Страница статистики

## 📁 Файлы

```
src/
├── config/config.js              ← Флаг mock/API
├── mocks/mockStatsData.js        ← Fake данные
├── hooks/useWeeklyStats.js       ← Получение данных
├── components/WeeklyProgressChart/
│   ├── WeeklyProgressChart.jsx   ← График
│   └── WeeklyProgressChart.scss  ← Стили
└── pages/Stats/Stats.jsx         ← Страница
```

## 🔧 Быстрые правки

### Изменить цвета столбцов:
```javascript
// WeeklyProgressChart.jsx
const getBarColor = (rate) => {
  if (rate >= 80) return '#10B981'; // ← Измени цвет
  if (rate >= 50) return '#8B5CF6';
  if (rate >= 20) return '#F59E0B';
  return '#E5E7EB';
};
```

### Изменить высоту графика:
```javascript
// WeeklyProgressChart.jsx
<ResponsiveContainer width="100%" height={300}> // ← Измени число
```

### Изменить количество дней:
```javascript
// mockStatsData.js
for (let i = 6; i >= 0; i--) // ← Измени 6 на нужное число - 1
```

### Переключиться на API:
```javascript
// config.js
USE_MOCK_DATA: false // ← Измени на false
```

## 🎨 Recharts шпаргалка

### Основные компоненты:
```javascript
<BarChart data={данные}>          // Контейнер
  <CartesianGrid />               // Сетка
  <XAxis dataKey="day" />         // Ось X
  <YAxis domain={[0, 100]} />     // Ось Y (0-100%)
  <Tooltip />                     // Подсказка
  <Bar dataKey="completionRate" /> // Столбцы
</BarChart>
```

### Формат данных:
```javascript
[
  { day: "Пн", completionRate: 30 },
  { day: "Вт", completionRate: 50 },
  ...
]
```

## 🎨 SCSS шпаргалка

### Вложенность:
```scss
.weekly-chart {
  &__header {  // = .weekly-chart__header
    &__title { // = .weekly-chart__header__title
    }
  }
}
```

### Переменные:
```scss
$color: #8B5CF6;
.element { color: $color; }
```

### Адаптивность:
```scss
@media (max-width: 768px) {
  .element { padding: 16px; }
}
```

## 🐛 Решение проблем

### График не показывается:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Ошибка импорта:
Проверь пути:
```javascript
import Api from '../api/Api';  // Правильно
import { Api } from '../api/Api';  // Неправильно
```

### Стили не работают:
```javascript
import './WeeklyProgressChart.scss';  // Не забудь импорт
```

## 📚 Документация

- **GUIDE_StatsPage_Explained.md** - подробный гайд
- **backend_toMake.md** - задачи для backend
- **CHANGES_SUMMARY.md** - что изменилось

## 🎯 Быстрый старт

1. Открой `GUIDE_StatsPage_Explained.md`
2. Читай раздел "Как работает каждый файл"
3. Экспериментируй с кодом
4. Смотри результат в браузере

Удачи! 🚀
