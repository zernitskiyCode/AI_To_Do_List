import { useState } from 'react';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import VoiceInputCard from '../../components/VoiceInputCard/VoiceInputCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';

const Home = ({ 
  notificationCount = 0,
  onNotificationClick,
  onRecordClick,
  onSearch 
}) => {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority);
    // TODO: Implement priority filtering logic
    console.log('Priority changed to:', priority);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // TODO: Implement category filtering logic
    console.log('Category changed to:', category);
  };

  const handleAddTask = () => {
    // TODO: Implement add task logic
    // Example implementation:
    // - Open modal/form for task creation
    // - Collect task data (title, description, priority, category, due date)
    // - Validate input data
    // - Save task to state/database
    // - Update task list
    // - Show success notification
    console.log('Add task manually clicked');
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
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="tasks-section">
          <div className="tasks-section__header">
            <h2>Мои задачи</h2>
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
            {/* TODO: Add TaskList component here */}
            <div className="tasks-placeholder">
              <p>Здесь будут отображаться задачи...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
