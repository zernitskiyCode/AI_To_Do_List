import StatCard from '../../components/StatCard/StatCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import WeeklyProgressChart from '../../components/WeeklyProgressChart/WeeklyProgressChart';
import { useTaskState } from '../../hooks/useTaskState';
import { useWeeklyStats, useStreak } from '../../hooks/useWeeklyStats';
import { useMemo } from 'react';
import './Stats.scss';


const Stats = () => {
  const { getTasksStats } = useTaskState();
  const TaskStats = useMemo(() => getTasksStats(), [getTasksStats]);
  
  const { weeklyStats, isLoading: weeklyLoading } = useWeeklyStats();

  
  const { streak } = useStreak();

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
        {/* Верхние 3 карточки с анимацией */}
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

        {/* График недели(показываем только после загрузки) */}
        {!weeklyLoading && weeklyStats.length > 0 && (
          <div className="chart-wrapper">
            <WeeklyProgressChart data={weeklyStats} />
          </div>
        )}
        
        {/* Заглушка при загрузке БУДЕТ МЕНЯТЬСЯ*/}
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
