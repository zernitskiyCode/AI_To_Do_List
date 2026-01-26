import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTasks, createTaskInDB, updateTaskInDB, deleteTaskFromDB } from './getTasks';

export const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Изучить React Hooks',
    description: 'Разобраться с useState, useEffect и другими хуками',
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date('2024-12-15T09:00:00').toISOString(),
    dueDate: new Date('2024-12-20T18:00:00').toISOString(),
    tags: ['react', 'javascript', 'обучение']
  },
  {
    id: '2',
    title: 'Купить продукты',
    description: 'Молоко, хлеб, яйца, овощи для салата',
    priority: 'medium',
    category: 'personal',
    completed: false,
    createdAt: new Date('2024-12-15T10:30:00').toISOString(),
    dueDate: new Date('2024-12-16T19:00:00').toISOString(),
    tags: ['покупки', 'еда']
  },
  {
    id: '3',
    title: 'Сделать зарядку',
    description: 'Утренняя зарядка 20 минут',
    priority: 'low',
    category: 'health',
    completed: true,
    createdAt: new Date('2024-12-15T07:00:00').toISOString(),
    dueDate: new Date('2024-12-15T08:00:00').toISOString(),
    tags: ['здоровье', 'спорт']
  },
  {
    id: '4',
    title: 'Подготовить презентацию',
    description: 'Создать слайды для встречи с клиентом',
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date('2024-12-15T11:00:00').toISOString(),
    dueDate: new Date('2024-12-18T14:00:00').toISOString(),
    tags: ['работа', 'презентация', 'клиент']
  },
  {
    id: '5',
    title: 'Позвонить маме',
    description: 'Узнать как дела, обсудить планы на выходные',
    priority: 'medium',
    category: 'personal',
    completed: false,
    createdAt: new Date('2024-12-15T12:00:00').toISOString(),
    dueDate: new Date('2024-12-15T20:00:00').toISOString(),
    tags: ['семья', 'звонок']
  }
];

export const createTask = (taskData) => {
  return {
    id: Date.now().toString(),
    title: taskData.title || '',
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    category: taskData.category || 'personal',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: taskData.dueDate || null,
    tags: taskData.tags || []
  };
};

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
      name: 'task-storage', 
      partialize: (state) => ({ tasks: state.tasks }), // сохраняем только tasks
    }
  )
);


/*
СОВЕТЫ ПО ИНТЕГРАЦИИ С БД В ZUSTAND:

1. ЗАГРУЗКА ЗАДАЧ ИЗ БД:
   - Добавьте action fetchTasks в store:
   
   fetchTasks: async () => {
     try {
       const tasks = await getTasks();
       set({ tasks, isLoading: false });
     } catch (error) {
       set({ error: error.message, isLoading: false });
     }
   }

2. СОЗДАНИЕ ЗАДАЧИ С СОХРАНЕНИЕМ В БД:
   
   addTask: async (taskData) => {
     try {
       const newTask = await createTaskInDB(taskData);
       set(state => ({ tasks: [newTask, ...state.tasks] }));
       return newTask;
     } catch (error) {
       console.error('Error creating task:', error);
       throw error;
     }
   }

3. ОБНОВЛЕНИЕ ЗАДАЧИ:
   
   updateTask: async (taskId, updates) => {
     try {
       const updatedTask = await updateTaskInDB(taskId, updates);
       set(state => ({
         tasks: state.tasks.map(task => 
           task.id === taskId ? updatedTask : task
         )
       }));
     } catch (error) {
       console.error('Error updating task:', error);
       throw error;
     }
   }

4. УДАЛЕНИЕ ЗАДАЧИ:
   
   deleteTask: async (taskId) => {
     try {
       await deleteTaskFromDB(taskId);
       set(state => ({
         tasks: state.tasks.filter(task => task.id !== taskId)
       }));
     } catch (error) {
       console.error('Error deleting task:', error);
       throw error;
     }
   }

5. ДОБАВЬТЕ СОСТОЯНИЯ ДЛЯ ЗАГРУЗКИ И ОШИБОК:
   
   В начальное состояние store добавьте:
   tasks: [],
   isLoading: true,
   error: null

6. ВЫЗОВ fetchTasks ПРИ МОНТИРОВАНИИ:
   
   В компоненте Home или App:
   useEffect(() => {
     useTasks.getState().fetchTasks();
   }, []);

7. ОПТИМИСТИЧНЫЕ ОБНОВЛЕНИЯ (опционально):
   
   Сначала обновляйте UI, потом отправляйте на сервер:
   
   toggleComplete: async (taskId) => {
     // Оптимистичное обновление
     set(state => ({
       tasks: state.tasks.map(task => 
         task.id === taskId ? { ...task, completed: !task.completed } : task
       )
     }));
     
     try {
       await updateTaskInDB(taskId, { completed: !task.completed });
     } catch (error) {
       // Откатываем изменения при ошибке
       set(state => ({
         tasks: state.tasks.map(task => 
           task.id === taskId ? { ...task, completed: !task.completed } : task
         )
       }));
     }
   }

8. PERSIST MIDDLEWARE:
   
   Можете убрать persist если все данные в БД, или оставить для кэширования:
   
   persist(
     (set, get) => ({ ... }),
     {
       name: 'task-storage',
       partialize: (state) => ({ tasks: state.tasks }), // кэшируем задачи
     }
   )
*/



// src/hooks/useTasks.js - React Query для серверных данных
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getTasks, createTaskInDB, updateTaskInDB, deleteTaskFromDB } from './getTasks';

// export const useTasks = () => {
//   const queryClient = useQueryClient();

//   // Получение задач
//   const { data: tasks = [], isLoading, error } = useQuery({
//     queryKey: ['tasks'],
//     queryFn: getTasks,
//     staleTime: 1000 * 60 * 5, // 5 минут
//     retry: 2,
//   });

//   // Создание задачи
//   const createTask = useMutation({
//     mutationFn: createTaskInDB,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//     },
//     // Оптимистичное обновление
//     onMutate: async (newTask) => {
//       await queryClient.cancelQueries(['tasks']);
//       const previousTasks = queryClient.getQueryData(['tasks']);
      
//       queryClient.setQueryData(['tasks'], (old) => [
//         { ...newTask, id: 'temp-' + Date.now() },
//         ...old
//       ]);
      
//       return { previousTasks };
//     },
//     onError: (err, newTask, context) => {
//       queryClient.setQueryData(['tasks'], context.previousTasks);
//     },
//   });

//   // Обновление задачи
//   const updateTask = useMutation({
//     mutationFn: ({ taskId, updates }) => updateTaskInDB(taskId, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//     },
//   });

//   // Удаление задачи
//   const deleteTask = useMutation({
//     mutationFn: deleteTaskFromDB,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks']);
//     },
//   });

//   // Toggle complete с оптимистичным обновлением
//   const toggleComplete = useMutation({
//     mutationFn: ({ taskId, completed }) => updateTaskInDB(taskId, { completed }),
//     onMutate: async ({ taskId }) => {
//       await queryClient.cancelQueries(['tasks']);
//       const previousTasks = queryClient.getQueryData(['tasks']);
      
//       queryClient.setQueryData(['tasks'], (old) =>
//         old.map(task =>
//           task.id === taskId ? { ...task, completed: !task.completed } : task
//         )
//       );
      
//       return { previousTasks };
//     },
//     onError: (err, variables, context) => {
//       queryClient.setQueryData(['tasks'], context.previousTasks);
//     },
//   });

//   return {
//     tasks,
//     isLoading,
//     error,
//     createTask: createTask.mutate,
//     updateTask: updateTask.mutate,
//     deleteTask: deleteTask.mutate,
//     toggleComplete: toggleComplete.mutate,
//   };
// };

// // src/hooks/useTaskFilters.js - Zustand для UI состояния
// import { create } from 'zustand';

// export const useTaskFilters = create((set) => ({
//   searchQuery: '',
//   selectedCategory: 'all',
//   selectedPriority: 'all',
//   showCompleted: true,
  
//   setSearchQuery: (query) => set({ searchQuery: query }),
//   setCategory: (category) => set({ selectedCategory: category }),
//   setPriority: (priority) => set({ selectedPriority: priority }),
//   toggleShowCompleted: () => set((state) => ({ showCompleted: !state.showCompleted })),
// }));
