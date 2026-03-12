import { useQuery } from '@tanstack/react-query';
import Api from '../api/Api';

/**
 * Хук для получения статистики за неделю
 * 
 * Возвращает: { weeklyStats, isLoading, error }
 * weeklyStats - массив из 7 объектов: [{ date, completed, total, completionRate }, ...]
 */
export const useWeeklyStats = () => {
  const { data: weeklyStats = [], isLoading, error } = useQuery({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      const response = await Api.get('/stats/weekly');
      return response.data;
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
      const response = await Api.get('/stats/streak');
      return response.data.streak;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { streak: data || 0, isLoading, error };
};
