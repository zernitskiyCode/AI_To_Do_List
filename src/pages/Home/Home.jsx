import { useState } from 'react';
import PageHeader from '../../components/PageHeader/PageHeader';
import VoiceInputCard from '../../components/VoiceInputCard/VoiceInputCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import TaskList from '../../components/TaskList/TaskList';
import AddTaskModal from '../../components/Modal/AddTaskModal';
import { useTasks, useTaskFilters } from '../../hooks/useTasks';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useModal } from '../../hooks/useModal';

import './Home.scss';



const Home = ({ 
  notificationCount = 0,
  onNotificationClick,
  onRecordClick,
  onSearch 
}) => {
  const {
    searchQuery,
    selectedCategory,
    selectedPriority,
    setSearchQuery,
    setCategory,
    setPriority
  } = useTaskFilters();

  const { isActive: isModalActive, toggle: toggleModal } = useModal();

  // Получаем данные и методы из useTasks
  const { tasks, isLoading, error, updateTask, deleteTask, toggleComplete } = useTasks();
  
  const filteredTasks = useFilteredTasks({
    priority: selectedPriority,
    category: selectedCategory,
    search: searchQuery
  });

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query); 
  };

  const handleAddTask = () => {
    toggleModal();
  };

  const handleToggleComplete = (taskId) => {
    toggleComplete({ taskId });
  };

  const handleDeleteTask = (taskId) => {
      deleteTask({ taskId });
  };

  // Обработка состояний загрузки и ошибок
  if (isLoading) {
    return (
      <div className="home-page">
        <PageHeader 
          title="AI Задачи"
          icon="⚡"
          variant="default"
          showDate={true}
          showNotifications={true}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
        />
        <div className="home-page__content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Загрузка задач...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <PageHeader 
          title="AI Задачи"
          icon="⚡"
          variant="default"
          showDate={true}
          showNotifications={true}
          notificationCount={notificationCount}
          onNotificationClick={onNotificationClick}
        />
        <div className="home-page__content">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            Ошибка загрузки задач: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <PageHeader 
        title="AI Задачи"
        icon="⚡"
        variant="default"
        showDate={true}
        showNotifications={true}
        notificationCount={notificationCount}
        onNotificationClick={onNotificationClick}
      />
  
      
      <div className="home-page__content">
        <div className="component-container">
          <VoiceInputCard onRecordClick={onRecordClick} />
        </div>
        
        <div className="component-container">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
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

      <AddTaskModal 
        isActive={isModalActive} 
        onClose={toggleModal} 
      />
    </div>
  );
};

export default Home;
