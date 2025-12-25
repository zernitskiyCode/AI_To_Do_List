import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TASKS, createTask } from '../api/tasks';


export const useTasks = create(
  persist(
    (set, get) => ({
      tasks: DEFAULT_TASKS,
      
      addTask: (taskData) => {
        const newTask = createTask(taskData);
        set(state => ({
          tasks: [newTask, ...state.tasks]
        }));
        return newTask;
      },
      
      updateTask: (taskId, updates) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        }));
      },
      
      deleteTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId)
        }));
      },
      
      toggleComplete: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }));
      },
      

      getFilteredTasks: (filters = {}) => {
        const { tasks } = get();
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
      },
      
    }),
    {
      name: 'ai_todo_tasks', // ключ для localStorage
      // Можно добавить дополнительные опции persist если нужно
      partialize: (state) => ({ tasks: state.tasks }), // сохраняем только tasks
    }
  )
);