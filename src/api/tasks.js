// Простые утилиты для работы с задачами
const STORAGE_KEY = 'ai_todo_tasks';

// Начальные задачи по умолчанию
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

// Получить задачи из localStorage или вернуть дефолтные
export const getInitialTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_TASKS;
  } catch (error) {
    console.error('Ошибка при загрузке задач из localStorage:', error);
    return DEFAULT_TASKS;
  }
};

// Сохранить задачи в localStorage
export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Ошибка при сохранении задач в localStorage:', error);
  }
};

// Создать новую задачу
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