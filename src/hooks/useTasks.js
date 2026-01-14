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
      


      
    }),
    {
      name: 'task-storage', // ключ для localStorage
      // Можно добавить дополнительные опции persist если нужно
      partialize: (state) => ({ tasks: state.tasks }), // сохраняем только tasks
    }
  )
);