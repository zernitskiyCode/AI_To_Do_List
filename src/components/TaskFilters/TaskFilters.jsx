import './TaskFilters.scss';

const TaskFilters = ({ 
  selectedPriority = 'all',
  selectedCategory = 'all',
  onPriorityChange,
  onCategoryChange 
}) => {
  const priorities = [
    { id: 'all', label: 'Все', color: '#8B5CF6' },
    { id: 'high', label: 'Важные', color: '#EF4444' },
    { id: 'medium', label: 'Средние', color: '#F59E0B' },
    { id: 'low', label: 'Низкие', color: '#3B82F6' },
  ];

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'work', label: 'Работа' },
    { id: 'personal', label: 'Личное' },
    { id: 'health', label: 'Здоровье' },
    { id: 'study', label: 'Учеба' },
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
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter ${selectedCategory === category.id ? 'category-filter--active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;