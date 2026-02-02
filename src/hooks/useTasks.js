import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTasks, createTaskInDB, updateTaskInDB, deleteTaskFromDB } from './getTasks';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Получение задач
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 2,
  });

  // Создание задачи
  const createTask = useMutation({
    mutationFn: createTaskInDB,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
    // Оптимистичное обновление
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old) => [
        { ...newTask, id: 'temp-' + Date.now() },
        ...old
      ]);
      
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
  });

  // Обновление задачи
  const updateTask = useMutation({
    mutationFn: ({ taskId, updates }) => updateTaskInDB(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Удаление задачи
  const deleteTask = useMutation({
    mutationFn: ({ taskId }) => deleteTaskFromDB(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Toggle complete с оптимистичным обновлением
  const toggleComplete = useMutation({
    mutationFn: ({ taskId, completed }) => updateTaskInDB(taskId, { completed }),
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old) =>
        old.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
    toggleComplete: toggleComplete.mutate,
  };
};

// Zustand хук для UI состояния фильтров с persist
export const useTaskFilters = create(
  persist(
    (set) => ({
      searchQuery: '',
      selectedCategory: 'all',
      selectedPriority: 'all',
      showCompleted: true,
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),
      setPriority: (priority) => set({ selectedPriority: priority }),
      toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted })),
    }),
    {
      name: 'task-filters-storage',
    }
  )
);
