import StatCard from '../../components/StatCard/StatCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import WeeklyProgressChart from '../../components/WeeklyProgressChart/WeeklyProgressChart';
import { useTaskState } from '../../hooks/useTaskState';
import { useWeeklyStats, useStreak } from '../../hooks/useWeeklyStats';
import { useMemo } from 'react';

/**
 * Страница статистики
 * Показывает:
 * - 3 карточки: процент выполнения, задач готово, дней подряд
 * - График недели: столбчатая диаграмма за последние 7 дней
 */
const Stats = () => {
  // Получаем статистику задач (процент выполнения, количество)
  const { getTasksStats } = useTaskState();
  const TaskStats = useMemo(() => getTasksStats(), [getTasksStats]);
  
  // Получаем данные для графика недели (mock или API)
  const { weeklyStats, isLoading: weeklyLoading } = useWeeklyStats();
  
  // Получаем стрик (дни подряд) (mock или API)
  const { streak, isLoading: streakLoading } = useStreak();

  // Только 3 карточки (убрали "Всего задач")
  const statCards = [ 
    { 
      value: TaskStats.completionRate > 0 ? `${TaskStats.completionRate}%` : '0%',  
      type: 'completed',
      subtitle: 'Выполнено'
    },
    { 
      value: TaskStats.completed, 
      type: 'ready',
      subtitle: 'Задач готово'
    },
    { 
      value: streak > 0 ? `${streak}` : '0', 
      type: 'streak',
      subtitle: 'Дней подряд'
    },
  ];

  return (
    <div className="stats-page">
      <PageHeader 
        icon="📊"
        title="Статистика"
        subtitle="Ваша продуктивность"
        variant="stats"
      />
      
      <div className="stats-page__content">
        {/* Верхние 3 карточки */}
        <div className="stats-grid stats-grid--three">
          {statCards.map((card, index) => (
            <StatCard 
              key={index} 
              value={card.value} 
              type={card.type}
              subtitle={card.subtitle}
            />
          ))}
        </div>

        {/* График недели (показываем только после загрузки) */}
        {!weeklyLoading && weeklyStats.length > 0 && (
          <WeeklyProgressChart data={weeklyStats} />
        )}
        
        {/* Заглушка при загрузке */}
        {weeklyLoading && (
          <div className="weekly-chart-skeleton">
            Загрузка графика...
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;


