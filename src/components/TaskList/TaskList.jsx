import { useState, useEffect, useRef } from 'react';
import './TaskList.scss';
import { useTasks } from '../../hooks/useTasks';
import EmptyState from './EmptyState';

const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onDeleteTask,
  isTogglingComplete = false,
}) => {
  const [expandedTask, setExpandedTask] = useState(null);
  const [visibleTasks, setVisibleTasks] = useState(new Set());
  const { tasks: allTasks } = useTasks();
  const taskRefs = useRef({});

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
    const categoryMap = {
      'work': 'Работа',
      'personal': 'Личное',
      'health': 'Здоровье',
      'study': 'Учеба',
    };
    
    
    return categoryMap[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Другое');
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const taskId = entry.target.dataset.taskId;
          if (entry.isIntersecting) {
            setVisibleTasks((prev) => new Set([...prev, taskId]));
          } else {
            setVisibleTasks((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    Object.values(taskRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(taskRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [tasks]);



  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <EmptyState hasAnyTasks={allTasks.length > 0} />
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task.id}
          ref={(el) => (taskRefs.current[task.id] = el)}
          data-task-id={task.id}
          className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
            visibleTasks.has(String(task.id)) ? 'task-item--visible' : ''
          }`}
        >
          <div className="task-item__header" onClick={() => handleToggleExpand(task.id)}>
            <div className="task-item__main">
              <button
                className="task-item__checkbox"
                disabled={isTogglingComplete}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isTogglingComplete) {
                    onToggleComplete?.(task.id);
                  }
                }}
                style={{ 
                  opacity: isTogglingComplete ? 0.5 : 1, 
                  cursor: isTogglingComplete ? 'not-allowed' : 'pointer',
                  pointerEvents: isTogglingComplete ? 'none' : 'auto'
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