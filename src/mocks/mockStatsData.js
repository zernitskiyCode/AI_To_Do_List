/**
 * Mock данные для статистики
 * Используется пока backend API не готов
 */

/**
 * Генерирует данные за последние 7 дней
 * Возвращает массив объектов: [{ date, completed, total, completionRate }, ...]
 */
export const generateWeeklyMockData = () => {
  const data = [];
  const today = new Date();
  
  // Генерируем данные для последних 7 дней (от сегодня назад)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Случайные данные (в будни больше задач, в выходные меньше)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const completed = isWeekend 
      ? Math.floor(Math.random() * 3) + 1  // 1-3 задачи в выходные
      : Math.floor(Math.random() * 7) + 3; // 3-9 задач в будни
    
    const total = completed + Math.floor(Math.random() * 3); // +0-2 незавершенных
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    data.push({
      date: date.toISOString().split('T')[0], // Формат: "2026-02-15"
      completed,
      total,
      completionRate
    });
  }
  
  return data;
};

/**
 * Возвращает фиксированный стрик (дни подряд)
 * Пока backend не готов, возвращаем константу
 */
export const generateStreakMockData = () => {
  // Фиксированное значение: 5 дней подряд
  return 5;
};

// Экспорт всех mock данных
export const mockStatsData = {
  weekly: generateWeeklyMockData(),
  streak: generateStreakMockData()
};
