import { useState, useEffect, useCallback } from 'react';
import { getInitialTasks, saveTasksToStorage, createTask } from '../api/tasks';

export const useTasks = () => {
  // Инициализируем состояние сразу из localStorage
  const [tasks, setTasks] = useState(() => getInitialTasks());

  // Сохраняем в localStorage при каждом изменении tasks
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Добавление новой задачи
  const addTask = useCallback((taskData) => {
    const newTask = createTask(taskData);
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  // Обновление задачи
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  // Удаление задачи
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Переключение статуса выполнения
  const toggleComplete = useCallback((taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  // Фильтрация задач
  const getFilteredTasks = useCallback((filters = {}) => {
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
  }, [tasks]);

  // Статистика задач
  const getTasksStats = useCallback(() => {
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
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredTasks,
    getTasksStats
  };
};