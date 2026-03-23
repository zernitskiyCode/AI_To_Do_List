import { useQuery } from '@tanstack/react-query';
import Api from '../api/Api';


export const useWeeklyStats = () => {
  const { data: weeklyStats = [], isLoading, error } = useQuery({
    queryKey: ['weeklyStats'],
    queryFn: async () => {
      const response = await Api.get('/stats/weekly');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 мин
  });

  return { weeklyStats, isLoading, error };
};

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
