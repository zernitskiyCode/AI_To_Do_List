import { useState } from 'react';
import './TaskList.scss';

const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onDeleteTask, 
}) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'work': return 'Работа';
      case 'personal': return 'Личное';
      case 'health': return 'Здоровье';
      case 'study': return 'Учеба';
      default: return 'Другое';
    }
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };



  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div className="task-list__empty">
          <span className="task-list__empty-icon">📝</span>
          <h3>Задач пока нет</h3>
          <p>Добавьте первую задачу, чтобы начать планирование</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
        >
          <div className="task-item__header" onClick={() => handleToggleExpand(task.id)}>
            <div className="task-item__main">
              <button
                className="task-item__checkbox"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete?.(task.id);
                }}
              >
                {task.completed ? '✓' : ''}
              </button>
              
              <div className="task-item__content">
                <h4 className="task-item__title">{task.title}</h4>
                <div className="task-item__meta">
                  <span 
                    className="task-item__priority"
                    style={{ '--priority-color': getPriorityColor(task.priority) }}
                  >
                    {getPriorityText(task.priority)}
                  </span>
                  <span className="task-item__category">
                    {getCategoryText(task.category)}
                  </span>
                  {task.dueDate && (
                    <span className="task-item__due-date">
                      📅 {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="task-item__actions">
              <button
                className="task-item__expand"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(task.id);
                }}
              >
                {expandedTask === task.id ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {expandedTask === task.id && (
            <div className="task-item__details">
              {task.description && (
                <div className="task-item__description">
                  <strong>Описание:</strong>
                  <p>{task.description}</p>
                </div>
              )}
              
              {task.tags && task.tags.length > 0 && (
                <div className="task-item__tags">
                  <strong>Теги:</strong>
                  <div className="task-item__tag-list">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="task-item__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="task-item__dates">
                <div className="task-item__created">
                  <strong>Создано:</strong> {formatDate(task.createdAt)}
                </div>
                {task.dueDate && (
                  <div className="task-item__due">
                    <strong>Срок:</strong> {formatDate(task.dueDate)}
                  </div>
                )}
              </div>

              <div className="task-item__bottom-actions">
                <button
                  className="task-item__delete"
                  onClick={() => onDeleteTask?.(task.id)}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;