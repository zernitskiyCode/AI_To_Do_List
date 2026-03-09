import './TaskFilters.scss';
import { useCategories } from '../../hooks/useCategories';

const TaskFilters = ({ 
  selectedPriority = 'all',
  selectedCategory = 'all',
  onPriorityChange,
  onCategoryChange 
}) => {
  const { categories, isLoading } = useCategories();
  const priorities = [
    { id: 'all', label: 'Все', color: '#8B5CF6' },
    { id: 'high', label: 'Важные', color: '#EF4444' },
    { id: 'medium', label: 'Средние', color: '#F59E0B' },
    { id: 'low', label: 'Низкие', color: '#3B82F6' },
  ];

  // Добавляем "Все" к категориям
  const allCategories = [
    { id: 'all', label: 'Все', isDefault: true },
    ...categories
  ];

  const handlePriorityClick = (priorityId) => {
    if (onPriorityChange) {
      onPriorityChange(priorityId);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="task-filters">
      <div className="task-filters__section">
        <div className="task-filters__priority">
          {priorities.map((priority) => (
            <button
              key={priority.id}
              className={`priority-filter ${selectedPriority === priority.id ? 'priority-filter--active' : ''}`}
              style={{ 
                '--priority-color': priority.color,
                backgroundColor: selectedPriority === priority.id ? priority.color : 'transparent',
                color: selectedPriority === priority.id ? '#FFFFFF' : priority.color,
                borderColor: priority.color
              }}
              onClick={() => handlePriorityClick(priority.id)}
            >
              <span className="priority-filter__dot"></span>
              {priority.label}
            </button>
          ))}
        </div>
      </div>

      <div className="task-filters__section">
        <div className="task-filters__categories">
          {isLoading ? (
            <div className="task-filters__loading">Загрузка...</div>
          ) : (
            allCategories.map((category) => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'category-filter--active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;