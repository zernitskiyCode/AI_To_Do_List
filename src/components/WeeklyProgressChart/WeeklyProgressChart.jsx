import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './WeeklyProgressChart.scss';

/**
 * Компонент графика недельной статистики
 * 
 * Props:
 * - data: массив из 7 объектов [{ date, completed, total, completionRate }, ...]
 *   date - дата в формате "2026-02-15"
 *   completed - количество выполненных задач
 *   total - общее количество задач
 *   completionRate - процент выполнения (0-100)
 */
const WeeklyProgressChart = ({ data }) => {
  // Преобразуем данные: дата → название дня недели
  const chartData = data.map(item => {
    const date = new Date(item.date);
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayName = dayNames[date.getDay()];
    
    return {
      day: dayName,                        // Название дня для оси X
      completionRate: item.completionRate, // Процент для высоты столбца
      completed: item.completed,           // Для tooltip
      total: item.total,                   // Для tooltip
    };
  });

  /**
   * Кастомный tooltip (всплывающая подсказка при наведении)
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-day">{data.day}</p>
          <p className="tooltip-rate">{data.completionRate}% выполнено</p>
          <p className="tooltip-tasks">{data.completed} из {data.total} задач</p>
        </div>
      );
    }
    return null;
  };

  /**
   * Функция определения цвета столбца по проценту выполнения
   * ≥80% → Зеленый (отлично)
   * 50-79% → Фиолетовый (хорошо)
   * 20-49% → Оранжевый (средне)
   * <20% → Серый (плохо)
   */
  const getBarColor = (rate) => {
    if (rate >= 80) return '#10B981'; // Зеленый
    if (rate >= 50) return '#8B5CF6'; // Фиолетовый
    if (rate >= 20) return '#F59E0B'; // Оранжевый
    return '#E5E7EB'; // Серый
  };

  return (
    <div className="weekly-chart">
      <div className="weekly-chart__header">
        <div className="weekly-chart__title">
          <span className="weekly-chart__icon">📅</span>
          <h3>Неделя</h3>
        </div>
        <p className="weekly-chart__subtitle">Прогресс за 7 дней</p>
      </div>
      
      <div className="weekly-chart__content">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            {/* Сетка */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            
            {/* Ось X (дни недели) */}
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              style={{ fontSize: '14px', fontWeight: '500' }}
            />
            
            {/* Ось Y (проценты 0-100%) */}
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '14px' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            
            {/* Всплывающая подсказка */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            
            {/* Столбцы (каждый со своим цветом в зависимости от процента) */}
            <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.completionRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyProgressChart;
