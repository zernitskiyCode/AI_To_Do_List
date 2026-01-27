import { useMemo } from 'react';
import { useTasks } from './useTasks';

export const useFilteredTasks = (filters = {}) => {
  const tasks = useTasks(state => state.tasks);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    if (filters.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === filters.completed);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [tasks, filters.priority, filters.category, filters.completed, filters.search]);

  return filteredTasks;
};