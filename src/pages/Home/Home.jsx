import { useState, useMemo } from 'react';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import VoiceInputCard from '../../components/VoiceInputCard/VoiceInputCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import TaskList from '../../components/TaskList/TaskList';
import { useTasks } from '../../hooks/useTasks';

import './Home.scss';



const Home = ({ 
  notificationCount = 0,
  onNotificationClick,
  onRecordClick,
  onSearch 
}) => {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Используем основной хук для управления задачами
  const addTask = useTasks(state => state.addTask);
  const updateTask = useTasks(state => state.updateTask);
  const deleteTask = useTasks(state => state.deleteTask);
  const toggleComplete = useTasks(state => state.toggleComplete);
  const getFilteredTasks = useTasks(state => state.getFilteredTasks);
  
 

  // Фильтрованные задачи на основе выбранных фильтров
  const filteredTasks = useMemo(() => {
    return getFilteredTasks({
      priority: selectedPriority,
      category: selectedCategory,
      search: searchQuery
    });
  }, [getFilteredTasks, selectedPriority, selectedCategory, searchQuery]);

  // Статистика задач


  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query); // Вызываем родительский обработчик если есть
  };

  const handleAddTask = () => {
    // Простая реализация добавления задачи
    // В будущем можно заменить на модальное окно
    const title = prompt('Введите название задачи:');
    if (!title || title.trim() === '') return;

    const description = prompt('Введите описание задачи (необязательно):') || '';
    
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: selectedPriority !== 'all' ? selectedPriority : 'medium',
      category: selectedCategory !== 'all' ? selectedCategory : 'personal',
      dueDate: null,
      tags: []
    };

    const newTask = addTask(taskData);
    console.log('Задача добавлена:', newTask);
  };

  const handleToggleComplete = (taskId) => {
    toggleComplete(taskId);
  };

  const handleDeleteTask = (taskId) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    deleteTask(taskId);
  };

  return (
    <div className="home-page">
      <HomeHeader 
        notificationCount={notificationCount}
        onNotificationClick={onNotificationClick}
      />
  
      
      <div className="home-page__content">
        <div className="component-container">
          <VoiceInputCard onRecordClick={onRecordClick} />
        </div>
        
        <div className="component-container">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="tasks-section">
          <div className="tasks-section__header">
            <div className="component-container">
              <TaskFilters
                selectedPriority={selectedPriority}
                selectedCategory={selectedCategory}
                onPriorityChange={handlePriorityChange}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
          
          <div className="component-container">
            <AddTaskButton onClick={handleAddTask} />
          </div>
          
          <div className="component-container">
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={updateTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
