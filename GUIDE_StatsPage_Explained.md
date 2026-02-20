# 📚 Гайд: Как работает страница статистики

## 🎯 Что мы сделали?

Добавили на страницу статистики:
1. **3 карточки** - процент выполнения, задач готово, дней подряд
2. **График недели** - столбчатая диаграмма за 7 дней

---

## 🏗️ Архитектура (как все устроено)

### Простыми словами:

```
┌─────────────────────────────────────────────────────────┐
│  Stats.jsx (страница)                                    │
│  "Покажи мне статистику!"                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│  useWeeklyStats.js (хук)                                 │
│  "Сейчас получу данные..."                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
         ┌───────┴───────┐
         │               │
         ↓               ↓
┌────────────────┐  ┌────────────────┐
│ Mock данные    │  │ Реальный API   │
│ (сейчас)       │  │ (потом)        │
└────────────────┘  └────────────────┘
         │               │
         └───────┬───────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│  WeeklyProgressChart.jsx (график)                       │
│  "Рисую красивую диаграмму!"                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Структура файлов

```
src/
├── config/
│   └── config.js                    ← Флаг: mock или API
│
├── mocks/
│   └── mockStatsData.js             ← Генератор fake данных
│
├── hooks/
│   └── useWeeklyStats.js            ← Получает данные
│
├── components/
│   └── WeeklyProgressChart/
│       ├── WeeklyProgressChart.jsx  ← Рисует график
│       └── WeeklyProgressChart.scss ← Стили графика
│
└── pages/
    └── Stats/
        └── Stats.jsx                ← Главная страница
```

---

## 🔄 Поток данных (как данные идут)

### Шаг 1: Пользователь открывает страницу Stats

```javascript
// Stats.jsx
const { weeklyStats } = useWeeklyStats(); // Запрашиваем данные
```

### Шаг 2: Хук проверяет флаг

```javascript
// useWeeklyStats.js
if (config.USE_MOCK_DATA) {
  return generateWeeklyMockData(); // Mock данные
} else {
  return api.get('/stats/weekly'); // Реальный API
}
```

### Шаг 3: Данные приходят

```javascript
// Формат данных:
[
  {
    date: "2026-02-15",      // Дата
    completed: 3,            // Выполнено задач
    total: 10,               // Всего задач
    completionRate: 30.0     // Процент (30%)
  },
  ... // 7 дней
]
```

### Шаг 4: График рисуется

```javascript
// WeeklyProgressChart.jsx
<BarChart data={weeklyStats}>
  <Bar dataKey="completionRate" /> // Рисуем столбцы
</BarChart>
```

---

## 🎨 Как работает график (Recharts)

### Что такое Recharts?

Это библиотека для рисования графиков в React. Она берет данные и рисует красивые диаграммы.

### Основные компоненты:

```javascript
<BarChart data={данные}>           // Контейнер графика
  <CartesianGrid />                // Сетка
  <XAxis dataKey="day" />          // Ось X (дни недели)
  <YAxis />                        // Ось Y (проценты)
  <Tooltip />                      // Всплывающая подсказка
  <Bar dataKey="completionRate" /> // Столбцы
</BarChart>
```

### Как это работает:

1. **BarChart** - главный контейнер, в него передаем данные
2. **XAxis** - горизонтальная ось (дни: Пн, Вт, Ср...)
3. **YAxis** - вертикальная ось (проценты: 0%, 25%, 50%...)
4. **Bar** - столбцы, высота = процент выполнения
5. **Tooltip** - подсказка при наведении мыши

### Пример данных для графика:

```javascript
const chartData = [
  { day: "Пн", completionRate: 30 },  // Столбец высотой 30%
  { day: "Вт", completionRate: 50 },  // Столбец высотой 50%
  { day: "Ср", completionRate: 80 },  // Столбец высотой 80%
  ...
];
```

### Цвета столбцов:

```javascript
const getBarColor = (rate) => {
  if (rate >= 80) return '#10B981'; // Зеленый (отлично!)
  if (rate >= 50) return '#8B5CF6'; // Фиолетовый (хорошо)
  if (rate >= 20) return '#F59E0B'; // Оранжевый (средне)
  return '#E5E7EB';                 // Серый (плохо)
};
```

---

## 🎨 Как работают стили (SCSS)

### Что такое SCSS?

Это CSS, но с "суперспособностями":
- Переменные
- Вложенность
- Миксины (готовые куски кода)

### Пример обычного CSS:

```css
.weekly-chart {
  background: white;
  padding: 24px;
}

.weekly-chart__header {
  margin-bottom: 24px;
}

.weekly-chart__title h3 {
  font-size: 20px;
}
```

### Тот же код в SCSS (с вложенностью):

```scss
.weekly-chart {
  background: white;
  padding: 24px;

  &__header {                    // & = .weekly-chart
    margin-bottom: 24px;
  }

  &__title {
    h3 {
      font-size: 20px;
    }
  }
}
```

### Переменные в SCSS:

```scss
// Вместо повторения цветов:
$card-radius: 12px;
$base-padding: 20px;

.weekly-chart {
  border-radius: $card-radius;   // = 12px
  padding: $base-padding;        // = 20px
}
```

### Миксины (готовые куски):

```scss
// Определяем миксин:
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Используем:
.weekly-chart__header {
  @include flex-center;  // Вставляет все 3 свойства
}
```

### Адаптивность (для мобильных):

```scss
.weekly-chart {
  padding: 24px;

  // На экранах меньше 768px:
  @media (max-width: 768px) {
    padding: 16px;  // Меньше отступы
  }
}
```

---

## 🔧 Как работает каждый файл

### 1. `config.js` - Конфигурация

```javascript
export const config = {
  USE_MOCK_DATA: true,  // true = mock, false = API
};
```

**Зачем?** Один флаг переключает между fake и реальными данными.

---

### 2. `mockStatsData.js` - Генератор fake данных

```javascript
export const generateWeeklyMockData = () => {
  const data = [];
  
  // Генерируем 7 дней
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);  // Минус i дней
    
    // Случайные числа
    const completed = Math.floor(Math.random() * 7) + 3;  // 3-9
    const total = completed + Math.floor(Math.random() * 3);  // +0-2
    
    data.push({
      date: date.toISOString().split('T')[0],  // "2026-02-15"
      completed,
      total,
      completionRate: Math.round((completed / total) * 100)
    });
  }
  
  return data;
};
```

**Зачем?** Генерирует реалистичные данные для разработки.

---

### 3. `useWeeklyStats.js` - Хук для данных

```javascript
export const useWeeklyStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      if (config.USE_MOCK_DATA) {
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 300));
        return generateWeeklyMockData();
      }
      
      // Реальный API (когда готов)
      // return api.get('/stats/weekly');
      return [];
    },
  });

  return { weeklyStats: data, isLoading };
};
```

**Зачем?** Получает данные и кеширует их (не запрашивает каждый раз).

---

### 4. `WeeklyProgressChart.jsx` - Компонент графика

```javascript
const WeeklyProgressChart = ({ data }) => {
  // Преобразуем даты в дни недели
  const chartData = data.map(item => {
    const date = new Date(item.date);
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    return {
      day: dayNames[date.getDay()],  // "Пн"
      completionRate: item.completionRate,  // 30
      completed: item.completed,  // 3
      total: item.total,  // 10
    };
  });

  return (
    <div className="weekly-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 100]} />
          <Bar dataKey="completionRate">
            {chartData.map((entry, index) => (
              <Cell fill={getBarColor(entry.completionRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

**Зачем?** Рисует график с помощью Recharts.

---

### 5. `Stats.jsx` - Главная страница

```javascript
const Stats = () => {
  // Получаем данные
  const { weeklyStats, isLoading } = useWeeklyStats();
  const { streak } = useStreak();
  const TaskStats = useTaskState().getTasksStats();

  return (
    <div className="stats-page">
      {/* 3 карточки */}
      <div className="stats-grid stats-grid--three">
        <StatCard value={TaskStats.completionRate + '%'} type="completed" />
        <StatCard value={TaskStats.completed} type="ready" />
        <StatCard value={streak} type="streak" />
      </div>

      {/* График */}
      {!isLoading && <WeeklyProgressChart data={weeklyStats} />}
    </div>
  );
};
```

**Зачем?** Собирает все вместе и отображает.

---

## 🎨 Как сделана диаграмма (пошагово)

### Шаг 1: Установили библиотеку

```bash
npm install recharts
```

### Шаг 2: Импортировали компоненты

```javascript
import { 
  BarChart,           // Контейнер графика
  Bar,                // Столбцы
  XAxis,              // Ось X
  YAxis,              // Ось Y
  CartesianGrid,      // Сетка
  Tooltip,            // Подсказка
  ResponsiveContainer, // Адаптивный контейнер
  Cell                // Ячейка (для цвета)
} from 'recharts';
```

### Шаг 3: Подготовили данные

```javascript
// Было:
{ date: "2026-02-15", completionRate: 30 }

// Стало:
{ day: "Пн", completionRate: 30 }
```

### Шаг 4: Создали график

```javascript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    {/* Сетка */}
    <CartesianGrid strokeDasharray="3 3" />
    
    {/* Ось X (дни) */}
    <XAxis dataKey="day" />
    
    {/* Ось Y (проценты) */}
    <YAxis domain={[0, 100]} />
    
    {/* Столбцы */}
    <Bar dataKey="completionRate">
      {chartData.map((entry, index) => (
        <Cell key={index} fill={getBarColor(entry.completionRate)} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

### Шаг 5: Добавили цвета

```javascript
const getBarColor = (rate) => {
  if (rate >= 80) return '#10B981'; // Зеленый
  if (rate >= 50) return '#8B5CF6'; // Фиолетовый
  if (rate >= 20) return '#F59E0B'; // Оранжевый
  return '#E5E7EB';                 // Серый
};
```

### Шаг 6: Добавили tooltip

```javascript
const CustomTooltip = ({ active, payload }) => {
  if (active && payload) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{data.day}</p>
        <p>{data.completionRate}% выполнено</p>
        <p>{data.completed} из {data.total} задач</p>
      </div>
    );
  }
  return null;
};

// В графике:
<Tooltip content={<CustomTooltip />} />
```

---

## 🎨 Стили графика (SCSS)

### Контейнер графика:

```scss
.weekly-chart {
  background: white;              // Белый фон
  border-radius: 12px;            // Скругленные углы
  padding: 30px;                  // Отступы внутри
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  // Тень
  margin-top: 20px;               // Отступ сверху
}
```

### Заголовок:

```scss
.weekly-chart__header {
  margin-bottom: 24px;            // Отступ снизу
}

.weekly-chart__title {
  display: flex;                  // Flexbox
  align-items: center;            // По центру вертикально
  gap: 12px;                      // Расстояние между элементами

  h3 {
    font-size: 20px;              // Размер текста
    font-weight: 600;             // Жирность
    margin: 0;                    // Убираем отступы
  }
}
```

### Tooltip (всплывающая подсказка):

```scss
.custom-tooltip {
  background: white;              // Белый фон
  border: 1px solid #E5E7EB;      // Серая рамка
  border-radius: 8px;             // Скругленные углы
  padding: 12px 16px;             // Отступы
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);  // Тень

  .tooltip-day {
    font-size: 14px;              // Размер
    font-weight: 600;             // Жирность
    margin: 0 0 4px 0;            // Отступ снизу
  }

  .tooltip-rate {
    font-size: 16px;              // Больше размер
    font-weight: 700;             // Еще жирнее
    color: #8B5CF6;               // Фиолетовый цвет
  }
}
```

### Адаптивность (мобильные):

```scss
@media (max-width: 768px) {
  .weekly-chart {
    padding: 16px;                // Меньше отступы
    
    &__content {
      height: 250px;              // Меньше высота
    }
  }
}
```

---

## 🔄 Как переключиться на реальный API

### Когда backend будет готов:

1. Открой `src/config/config.js`
2. Измени:
   ```javascript
   USE_MOCK_DATA: false  // Было: true
   ```
3. Готово! Приложение автоматически переключится на API

---

## 🎓 Что нужно знать для понимания

### React:
- **Компоненты** - кусочки UI (как LEGO)
- **Props** - данные, которые передаются в компонент
- **Hooks** - функции для работы с данными (useState, useQuery)

### Recharts:
- **BarChart** - контейнер для столбчатой диаграммы
- **Bar** - сами столбцы
- **XAxis/YAxis** - оси координат
- **Tooltip** - всплывающая подсказка

### SCSS:
- **&** - ссылка на родителя (.weekly-chart &__header = .weekly-chart__header)
- **@include** - вставка миксина (готового кода)
- **@media** - стили для разных экранов

---

## 💡 Полезные ссылки

- **Recharts документация**: https://recharts.org/
- **SCSS гайд**: https://sass-lang.com/guide
- **React Query**: https://tanstack.com/query/latest

---

## ❓ Частые вопросы

### Q: Почему график не показывается?
A: Проверь:
1. `USE_MOCK_DATA: true` в config.js
2. Нет ошибок в консоли браузера
3. Данные приходят (console.log(weeklyStats))

### Q: Как изменить цвета столбцов?
A: В `WeeklyProgressChart.jsx` найди функцию `getBarColor` и измени цвета:
```javascript
if (rate >= 80) return '#твой_цвет';
```

### Q: Как изменить высоту графика?
A: В `WeeklyProgressChart.jsx` найди:
```javascript
<ResponsiveContainer width="100%" height={300}>
```
Измени `300` на нужное число.

### Q: Как добавить больше дней?
A: В `mockStatsData.js` измени цикл:
```javascript
for (let i = 13; i >= 0; i--)  // Было: 6
```

---

## 🎉 Готово!

Теперь ты понимаешь:
- Как устроена архитектура
- Как работает Recharts
- Как работает SCSS
- Как переключиться на реальный API

Удачи! 🚀
