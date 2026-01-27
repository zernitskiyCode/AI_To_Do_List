import { useTasks } from './useTasks';

// Хук только для получения статистики задач
export const useTaskState = () => {
  const tasks = useTasks(state => state.tasks);
  
  const getTasksStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(task => task.priority === 'high' && !task.completed).length;
    
    return {
      total,
      completed,
      pending,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return { getTasksStats };
};