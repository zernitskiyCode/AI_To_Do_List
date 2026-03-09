const EmptyState = ({ hasAnyTasks }) => {
  if (!hasAnyTasks) {
    return (
      <div className="task-list__empty">
        <span className="task-list__empty-icon">📝</span>
        <h3>Задач пока нет</h3>
        <p>Добавьте первую задачу, чтобы начать планирование</p>
      </div>
    );
  }

  return (
    <div className="task-list__empty">
      <span className="task-list__empty-icon">🔍</span>
      <h3>Задачи не найдены</h3>
      <p>Попробуйте изменить параметры поиска или фильтры</p>
    </div>
  );
};

export default EmptyState;
