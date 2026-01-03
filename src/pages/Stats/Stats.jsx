import StatCard from '../../components/StatCard/StatCard';
import { useTaskState } from '../../hooks/useTaskState';
import { useState, useMemo } from 'react';




const Stats = ({ stats = {} }) => {


  const { getTasksStats } = useTaskState()
 
  const TaskStats = useMemo(() => getTasksStats(), [getTasksStats]);
  const daysInRow = 1;//позже кастомный хук и запрос на бд или локальное хранение


  const statCards = [
    { label: 'Задачи', value: TaskStats.total ,valueColor:'#06c840ff' },
    { label: 'Процент выполненых', value: TaskStats.completionRate > 0 ? `${TaskStats.completionRate} % `: '0',  valueColor:'#5d06c8ff'},
    { label: 'Выполнено', value: TaskStats.completed , valueColor:'#06c840ff'},
    { label: 'Дней подряд', value: daysInRow > 0 ? `${daysInRow} 🔥 ` : '0' , valueColor:'#f0bb1dff' },
  ];
  

  return (
    <div className="stats-page">
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <StatCard key={index} label={card.label} value={card.value}/>
        ))}
      </div>
    </div>
  );
};

export default Stats;


