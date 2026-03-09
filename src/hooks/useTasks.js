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
    onError: (context) => {
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
    mutationFn: ({ taskId }) => {
      const currentTasks = queryClient.getQueryData(['tasks']) || [];
      const currentTask = currentTasks.find(task => task.id === taskId);
      const newCompleted = !currentTask?.completed;
      
      return updateTaskInDB(taskId, { completed: newCompleted });
    },
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
    onError: (context) => {
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
    toggleComplete: toggleComplete.mutate,
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
