import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTaskInDB, updateTaskInDB, deleteTaskFromDB } from './getTasks';
import { create } from 'zustand';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 2,
  });

  const createTask = useMutation({
    mutationFn: createTaskInDB,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      
      // Инвалидируем оба кеша категорий
      queryClient.invalidateQueries(['categories']);
      queryClient.invalidateQueries(['allCategories']);
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      queryClient.setQueryData(['tasks'], (old) => [
        { ...newTask, id: 'temp-' + Date.now() },
        ...old
      ]);
      
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error('Ошибка при создании задачи:', error);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, updates }) => updateTaskInDB(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const deleteTask = useMutation({
    mutationFn:({taskId}) => deleteTaskFromDB(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const toggleComplete = useMutation({
    mutationFn: ({ taskId, newCompleted }) => {
      return updateTaskInDB(taskId, { completed: newCompleted });
    },
    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      
      const currentTask = previousTasks.find(task => task.id === taskId);
      const newCompleted = !currentTask?.completed;
      
      queryClient.setQueryData(['tasks'], (old) =>
        old.map(task =>
          task.id === taskId ? { 
            ...task, 
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : null,
          } : task
        )
      );
      
      return { previousTasks, newCompleted };
    },
    onSuccess: (data, variables) => {
      // Успешно обновлено
    },
    onError: (error, variables, context) => {
      console.error('Ошибка при изменении статуса задачи:', error);
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
    toggleComplete: (taskId) => {
      const currentTasks = queryClient.getQueryData(['tasks']) || [];
      const currentTask = currentTasks.find(task => task.id === taskId);
      const newCompleted = !currentTask?.completed;
      toggleComplete.mutate({ taskId, newCompleted });
    },
    isTogglingComplete: toggleComplete.isPending,
  };
};

// for UI(need go to along hook)
export const useTaskFilters = create((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  selectedPriority: 'all',
  showCompleted: true,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ selectedCategory: category }),
  setPriority: (priority) => set({ selectedPriority: priority }),
  toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted })),
}));
