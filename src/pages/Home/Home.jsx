import { useState } from 'react';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import VoiceInputCard from '../../components/VoiceInputCard/VoiceInputCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import TaskList from '../../components/TaskList/TaskList';
import AddTaskModal from '../../components/Modal/AddTaskModal';
import { useTasks } from '../../hooks/useTasks';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useModal } from '../../hooks/useModal';

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


  const { isActive: isModalActive, toggle: toggleModal } = useModal();

  // const addTask = useTasks(state => state.addTask);
  const updateTask = useTasks(state => state.updateTask);
  const deleteTask = useTasks(state => state.deleteTask);
  const toggleComplete = useTasks(state => state.toggleComplete);
  
  const filteredTasks = useFilteredTasks({
    priority: selectedPriority,
    category: selectedCategory,
    search: searchQuery
  });



  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query); 
  };


  const handleAddTask = () => {
    toggleModal();
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

      <AddTaskModal 
        isActive={isModalActive} 
        onClose={toggleModal} 
      />
    </div>
  );
};

export default Home;
