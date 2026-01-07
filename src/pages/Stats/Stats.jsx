import StatCard from '../../components/StatCard/StatCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useTaskState } from '../../hooks/useTaskState';
import { useMemo } from 'react';




const Stats = ({ stats = {} }) => {


  const { getTasksStats } = useTaskState()
 
  const TaskStats = useMemo(() => getTasksStats(), [getTasksStats]);
  const daysInRow = 1;//позже кастомный хук и запрос на бд или локальное хранение


  const statCards = [
    { 
      label: 'Задачи', 
      value: TaskStats.total, 
      type: 'total',
      subtitle: 'Всего задач'
    },
    { 
      label: 'Процент выполненых', 
      value: TaskStats.completionRate > 0 ? `${TaskStats.completionRate}%` : '0%',  
      type: 'completed',
      subtitle: 'Выполнено'
    },
    { 
      label: 'Выполнено', 
      value: TaskStats.completed, 
      type: 'ready',
      subtitle: 'Задач готово'
    },
    { 
      label: 'Дней подряд', 
      value: daysInRow > 0 ? `${daysInRow}` : '0', 
      type: 'streak',
      subtitle: 'Дней активности'
    },
  ];
  

  return (
    <div className="stats-page">
      <PageHeader 
        title="Статистика"
        subtitle="Ваша продуктивность"
        variant="stats"
    ></PageHeader>
      
      <div className="stats-page__content">
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <StatCard 
              key={index} 
              value={card.value} 
              type={card.type}
              subtitle={card.subtitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;


