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
└── pages/Stats/
    ├── Stats.jsx                 ← Страница
    └── Stats.scss                ← Анимация
```

## 🔧 Быстрые правки

### Изменить скорость анимации карточек:
```scss
// Stats.scss
.stat-card-wrapper {
  .stats-grid--visible & {
    animation: fadeInUp 0.6s ease-out forwards; // ← Измени 0.6s
  }
}
```

### Изменить задержку между карточками:
```javascript
// Stats.jsx
style={{ animationDelay: `${index * 0.1}s` }} // ← Измени 0.1
```

### Изменить скорость анимации графика:
```scss
// Stats.scss
.chart-wrapper {
  transition: opacity 0.8s ease-out, transform 0.8s ease-out; // ← Измени 0.8s
  
  &--visible {
    transition-delay: 0.3s; // ← Измени задержку
  }
}
```

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

### Анимация:
```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.1s; // Задержка
}
```

## 🎬 Анимация шпаргалка

### Типы анимации:
```scss
// CSS Animation (keyframes)
animation: fadeInUp 0.6s ease-out forwards;

// CSS Transition (плавный переход)
transition: opacity 0.8s ease-out;
```

### Задержка:
```scss
animation-delay: 0.3s;        // Для animation
transition-delay: 0.3s;       // Для transition
```

### Easing (плавность):
```scss
ease-out    // Быстро в начале, медленно в конце
ease-in     // Медленно в начале, быстро в конце
ease-in-out // Медленно в начале и конце
linear      // Равномерно
```

## 🐛 Решение проблем

### График не показывается:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Анимация не работает:
1. Проверь импорт `import './Stats.scss';`
2. Очисти кеш и перезапусти

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
