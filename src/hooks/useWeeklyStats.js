import { useQuery } from '@tanstack/react-query';
import { config } from '../config/config';
import { generateWeeklyMockData, generateStreakMockData } from '../mocks/mockStatsData';
// import Api from '../api/Api'; // Закомментировано, пока используем mock данные

/**
 * Хук для получения статистики за неделю
 * Автоматически переключается между mock и реальными данными
 * 
 * Возвращает: { weeklyStats, isLoading, error }
 * weeklyStats - массив из 7 объектов: [{ date, completed, total, completionRate }, ...]
 */
export const useWeeklyStats = () => {
  const { data: weeklyStats = [], isLoading, error } = useQuery({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      // Если используем mock данные
      if (config.USE_MOCK_DATA) {
        // Имитируем задержку сети (300мс)
        await new Promise(resolve => setTimeout(resolve, 300));
        return generateWeeklyMockData(); // Генерируем новые данные каждый раз
      }
      
      // Реальный API запрос (когда backend готов)
      // Раскомментируй импорт Api выше и эту строку:
      // const response = await Api.get(config.API_ENDPOINTS.WEEKLY_STATS);
      // return response.data;
      
      return []; // Заглушка на случай если USE_MOCK_DATA = false, но API еще не готов
    },
    staleTime: 1000 * 60 * 5, // Кеш на 5 минут
  });

  return { weeklyStats, isLoading, error };
};

/**
 * Хук для получения стрика (дней подряд)
 * 
 * Возвращает: { streak, isLoading, error }
 * streak - число дней подряд (например, 5)
 */
export const useStreak = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      // Если используем mock данные
      if (config.USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return generateStreakMockData();
      }
      
      // Реальный API запрос (когда backend готов)
      // Раскомментируй импорт Api выше и эти строки:
      // const response = await Api.get(config.API_ENDPOINTS.STREAK);
      // return response.data.streak;
      
      return 0; // Заглушка на случай если USE_MOCK_DATA = false, но API еще не готов
    },
    staleTime: 1000 * 60 * 5,
  });

  return { streak: data || 0, isLoading, error };
};
