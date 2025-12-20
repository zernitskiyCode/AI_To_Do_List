import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TASKS, createTask } from '../api/tasks';

// Zustand store с persist middleware для автоматического сохранения в localStorage
export const useTasks = create(
  persist(
    (set, get) => ({
      // Состояние
      tasks: DEFAULT_TASKS,
      
      // Действия
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
      
      // Фильтрация задач
      getFilteredTasks: (filters = {}) => {
        const { tasks } = get();
        let filtered = [...tasks];

        // Фильтр по приоритету
        if (filters.priority && filters.priority !== 'all') {
          filtered = filtered.filter(task => task.priority === filters.priority);
        }

        // Фильтр по категории
        if (filters.category && filters.category !== 'all') {
          filtered = filtered.filter(task => task.category === filters.category);
        }

        // Фильтр по статусу выполнения
        if (filters.completed !== undefined) {
          filtered = filtered.filter(task => task.completed === filters.completed);
        }

        // Поиск по тексту
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
      
      // Статистика задач
      getTasksStats: () => {
        const { tasks } = get();
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
      }
    }),
    {
      name: 'ai_todo_tasks', // ключ для localStorage
      // Можно добавить дополнительные опции persist если нужно
      partialize: (state) => ({ tasks: state.tasks }), // сохраняем только tasks
    }
  )
);