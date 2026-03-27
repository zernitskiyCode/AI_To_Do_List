import { useReducer } from 'react';
import './AddTaskForm.scss';
import { useTasks } from '../../hooks/useTasks';
import { useAllCategories } from '../../hooks/useCategories';
import DateTimePicker from '../DateTimePicker/DateTimePicker';



const initialState = {
  taskName: '',
  description: '',
  selectedPriority: 'medium',
  selectedCategory: 'personal',
  customCategory: '',
  isCustomCategory: false,
  dueDateTime: '',
  error: ''
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};



const AddTaskForm = ({ onClose }) => {
 
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { createTask } = useTasks();
  const { categories, isLoading: categoriesLoading } = useAllCategories(); // Используем ВСЕ категории
  

//Validating
const validateTaskName = (name) => {
  if (typeof name !== 'string') {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'не являеться строкой' });
    return false;
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Минимум 3 символа' });
    return false;
  }
  if (trimmed.length > 100) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Максимум 100 символов' });
    return false;
  }

  if (/[<>\"'%;()&+]/.test(trimmed)) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Используються недопустимые символы' });
    return false;
  }
  


  dispatch({ type: 'SET_ERROR', value: '' });
  return true;
};
  //Datas
  const priorities = [
    { id: 'high', label: 'Важные', color: '#EF4444' },
    { id: 'medium', label: 'Средние', color: '#F59E0B' },
    { id: 'low', label: 'Низкие', color: '#3B82F6' },
  ];

  const handlePriorityClick = (priorityId) =>  dispatch({ type: 'UPDATE_FIELD', field: 'selectedPriority', value: priorityId });
  
  const handleCategoryClick = (categoryId) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'selectedCategory', value: categoryId });
    dispatch({ type: 'UPDATE_FIELD', field: 'isCustomCategory', value: false });
  };

  const handleCustomCategoryToggle = () => {
    dispatch({ type: 'UPDATE_FIELD', field: 'isCustomCategory', value: !formState.isCustomCategory });
    if (!formState.isCustomCategory) {
      dispatch({ type: 'UPDATE_FIELD', field: 'customCategory', value: '' });
    }
  };

  const handleCustomCategoryChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'customCategory', value: e.target.value });
  };

  const handleTaskNameChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'taskName', value: e.target.value });

    if (formState.error) dispatch({ type: 'SET_ERROR', value: '' });
  };

  const handleDescriptionChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'description', value: e.target.value });
  };

  const handleDateTimeChange = (value) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'dueDateTime', value });
  };

  //create task
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!validateTaskName(formState.taskName)) return;

    // Определяем финальную категорию
    const finalCategory = formState.isCustomCategory 
      ? formState.customCategory.trim() 
      : formState.selectedCategory;

    // Валидация кастомной категории
    if (formState.isCustomCategory && !formState.customCategory.trim()) {
      dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Введите название категории' });
      return;
    }

     const taskData = {
      title: formState.taskName.trim(),
      description: formState.description.trim() || null,
      priority: formState.selectedPriority !== 'all' ? formState.selectedPriority : 'medium',
      tag: finalCategory !== 'all' ? finalCategory : 'personal',
      deadline: formState.dueDateTime ? new Date(formState.dueDateTime).toISOString() : null,
      tags: []
    };

    console.log('📝 Отправляем задачу:', taskData);
    console.log('📅 dueDateTime из formState:', formState.dueDateTime);
    console.log('🕐 deadline после конвертации:', taskData.deadline);

    try {
      createTask(taskData);
      
      dispatch({ type: 'RESET_FORM' });
      
      if (onClose) {
        onClose();
      }

      console.log('✅ Task created successfully');
    } catch (error) {
      console.error('❌ Ошибка создания задачи:', error);
      dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Ошибка создания задачи' });
    }
  };

   return (
    <div className="add-task-form">
      <h2 className="add-task-form__title">Создать задачу</h2>
      
      <form onSubmit={handleSubmit} className="add-task-form__form">
        {/* Name field */}
        <div className="add-task-form__field">
          <label className="add-task-form__label">Название задачи</label>
          <input
            type="text"
            className="add-task-form__input"
            value={formState.taskName}
            onChange={handleTaskNameChange}
            placeholder="Введите название задачи..."
            required
          />
          {formState.error && <div className="add-task-form__error">{formState.error}</div>}
        </div>

        {/* Description field */}
        <div className="add-task-form__field">
          <label className="add-task-form__label">Описание</label>
          <textarea
            className="add-task-form__input add-task-form__textarea"
            value={formState.description}
            onChange={handleDescriptionChange}
            placeholder="Добавьте описание задачи..."
            rows="3"
          />
        </div>

        {/* priority */}
        <div className="add-task-form__field">
          <label className="add-task-form__label">Приоритет</label>
          <div className="add-task-form__priority">
            {priorities.map((priority) => (
              <button
                key={priority.id}
                type="button"
                className={`priority-filter ${formState.selectedPriority === priority.id ? 'priority-filter--active' : ''}`}
                style={{ 
                  '--priority-color': priority.color,
                  backgroundColor: formState.selectedPriority === priority.id ? priority.color : 'transparent',
                  color: formState.selectedPriority === priority.id ? '#FFFFFF' : priority.color,
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

        {/* category */}
        <div className="add-task-form__field">
          <label className="add-task-form__label">Категория</label>
          
          {!formState.isCustomCategory ? (
            <>
              <div className="add-task-form__categories">
                {categoriesLoading ? (
                  <div className="add-task-form__loading">Загрузка категорий...</div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`category-filter ${formState.selectedCategory === category.id ? 'category-filter--active' : ''}`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.label}
                    </button>
                  ))
                )}
              </div>
              <button
                type="button"
                className="add-task-form__custom-toggle"
                onClick={handleCustomCategoryToggle}
              >
                + Создать свою категорию
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                className="add-task-form__input"
                value={formState.customCategory}
                onChange={handleCustomCategoryChange}
                placeholder="Введите название категории..."
                maxLength="50"
              />
              <button
                type="button"
                className="add-task-form__custom-toggle"
                onClick={handleCustomCategoryToggle}
              >
                ← Выбрать из существующих
              </button>
            </>
          )}
        </div>

        {/* DateTime Picker */}
        <div className="add-task-form__field">
          <DateTimePicker
            value={formState.dueDateTime}
            onChange={handleDateTimeChange}
            label="Срок выполнения (опционально)"
          />
        </div>

        {/* submit*/}
        <button 
          type="submit" 
          className="add-task-form__submit"
          disabled={!formState.taskName.trim()}
        >
          Создать задачу
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;