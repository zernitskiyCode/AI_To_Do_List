import './TaskStats.scss';

const TaskStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="task-stats">
      <div className="task-stats__item">
        <span className="task-stats__number">{stats.total}</span>
        <span className="task-stats__label">Всего</span>
      </div>
      <div className="task-stats__item">
        <span className="task-stats__number task-stats__number--completed">{stats.completed}</span>
        <span className="task-stats__label">Выполнено</span>
      </div>
      <div className="task-stats__item">
        <span className="task-stats__number task-stats__number--pending">{stats.pending}</span>
        <span className="task-stats__label">В работе</span>
      </div>
      {stats.highPriority > 0 && (
        <div className="task-stats__item">
          <span className="task-stats__number task-stats__number--urgent">{stats.highPriority}</span>
          <span className="task-stats__label">Срочные</span>
        </div>
      )}
    </div>
  );
};

export default TaskStats;