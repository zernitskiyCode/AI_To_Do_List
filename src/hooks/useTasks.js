// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const DEFAULT_TASKS = [
//   {
//     id: '1',
//     title: 'Изучить React Hooks',
//     description: 'Разобраться с useState, useEffect и другими хуками',
//     priority: 'high',
//     category: 'work',
//     completed: false,
//     createdAt: new Date('2024-12-15T09:00:00').toISOString(),
//     dueDate: new Date('2024-12-20T18:00:00').toISOString(),
//     tags: ['react', 'javascript', 'обучение']
//   },
//   {
//     id: '2',
//     title: 'Купить продукты',
//     description: 'Молоко, хлеб, яйца, овощи для салата',
//     priority: 'medium',
//     category: 'personal',
//     completed: false,
//     createdAt: new Date('2024-12-15T10:30:00').toISOString(),
//     dueDate: new Date('2024-12-16T19:00:00').toISOString(),
//     tags: ['покупки', 'еда']
//   },
//   {
//     id: '3',
//     title: 'Сделать зарядку',
//     description: 'Утренняя зарядка 20 минут',
//     priority: 'low',
//     category: 'health',
//     completed: true,
//     createdAt: new Date('2024-12-15T07:00:00').toISOString(),
//     dueDate: new Date('2024-12-15T08:00:00').toISOString(),
//     tags: ['здоровье', 'спорт']
//   },
//   {
//     id: '4',
//     title: 'Подготовить презентацию',
//     description: 'Создать слайды для встречи с клиентом',
//     priority: 'high',
//     category: 'work',
//     completed: false,
//     createdAt: new Date('2024-12-15T11:00:00').toISOString(),
//     dueDate: new Date('2024-12-18T14:00:00').toISOString(),
//     tags: ['работа', 'презентация', 'клиент']
//   },
//   {
//     id: '5',
//     title: 'Позвонить маме',
//     description: 'Узнать как дела, обсудить планы на выходные',
//     priority: 'medium',
//     category: 'personal',
//     completed: false,
//     createdAt: new Date('2024-12-15T12:00:00').toISOString(),
//     dueDate: new Date('2024-12-15T20:00:00').toISOString(),
//     tags: ['семья', 'звонок']
//   }
// ];

// export const createTask = (taskData) => {
//   return {
//     id: Date.now().toString(),
//     title: taskData.title || '',
//     description: taskData.description || '',
//     priority: taskData.priority || 'medium',
//     category: taskData.category || 'personal',
//     completed: false,
//     createdAt: new Date().toISOString(),
//     dueDate: taskData.dueDate || null,
//     tags: taskData.tags || []
//   };
// };

// export const useTasks = create(
//   persist(
//     (set, get) => ({
//       tasks: DEFAULT_TASKS,
      
//       addTask: (taskData) => {
//         const newTask = createTask(taskData);
//         set(state => ({
//           tasks: [newTask, ...state.tasks]
//         }));
        
//         return newTask;
//       },
      
//       updateTask: (taskId, updates) => {
//         set(state => ({
//           tasks: state.tasks.map(task => 
//             task.id === taskId ? { ...task, ...updates } : task
//           )
//         }));
//       },
      
//       deleteTask: (taskId) => {
//         set(state => ({
//           tasks: state.tasks.filter(task => task.id !== taskId)
//         }));
//       },
      
//       toggleComplete: (taskId) => {
//         set(state => ({
//           tasks: state.tasks.map(task => 
//             task.id === taskId ? { ...task, completed: !task.completed } : task
//           )
//         }));
//       },
      
      
//     }),
//     {
//       name: 'task-storage', 
//       partialize: (state) => ({ tasks: state.tasks }), // сохраняем только tasks
//     }
//   )
// );





import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTaskInDB, updateTaskInDB, deleteTaskFromDB } from './getTasks';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 5, // 5 
    retry: 2,
  });

  const createTask = useMutation({
    mutationFn: createTaskInDB,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
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
import { create } from 'zustand';

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


