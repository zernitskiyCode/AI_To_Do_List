import { useState } from 'react';
import './AddTaskForm.scss';
import { useTasks } from '../../hooks/useTasks';
import { useReducer } from 'react';



const initialState = {
  taskName: '',
  selectedPriority: 'medium',
  selectedCategory: 'personal',
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
  const addTask = useTasks(state => state.addTask);
  

//Validating
const validateTaskName = (name) => {
  if (typeof name !== 'string') {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Минимум 3 символа' });
    return false;
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Минимум 3 символа' });
    return false;
  }
  if (trimmed.length > 100) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Минимум 3 символа' });
    return false;
  }

  if (/[<>\"'%;()&+]/.test(trimmed)) {
    dispatch({ type: 'UPDATE_FIELD', field: 'error', value: 'Минимум 3 символа' });
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
  const categories = [
    { id: 'work', label: 'Работа' },
    { id: 'personal', label: 'Личное' },
    { id: 'health', label: 'Здоровье' },
    { id: 'study', label: 'Учеба' },
  ];

  const handlePriorityClick = (priorityId) =>  dispatch({ type: 'UPDATE_FIELD', field: 'selectedPriority', value: priorityId });
  const handleCategoryClick = (categoryId) => dispatch({ type: 'UPDATE_FIELD', field: 'selectedCategory', value: categoryId });

  const handleTaskNameChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'taskName', value: e.target.value });

    if (formState.error) dispatch({ type: 'SET_ERROR', value: '' });
  };

  //create task
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(!validateTaskName(formState.taskName)) return;

     const taskData = {
      title: formState.taskName.trim(),
      priority: formState.selectedPriority !== 'all' ? formState.selectedPriority : 'medium',
      category: formState.selectedCategory !== 'all' ? formState.selectedCategory : 'personal',
      dueDate: null,
      tags: []
    };

    addTask(taskData);
    
    dispatch({ type: 'RESET_FORM' });
    
    if (onClose) {
      onClose();
    }

    console.log('Task created successfully');
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
          <div className="add-task-form__categories">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-filter ${formState.selectedCategory === category.id ? 'category-filter--active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
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