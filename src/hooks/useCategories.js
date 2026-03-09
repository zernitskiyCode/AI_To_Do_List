import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, getAllCategories } from './getTasks';

// Хук для работы с категориями (топ-6 для фильтров)
export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 минут
    retry: 2,
  });

  // Функция для инвалидации кеша категорий
  const invalidateCategories = () => {
    queryClient.invalidateQueries(['categories']);
    queryClient.invalidateQueries(['allCategories']);
  };

  return {
    categories,
    isLoading,
    error,
    invalidateCategories,
  };
};

// Хук для получения ВСЕХ категорий (для формы создания задачи)
export const useAllCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['allCategories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10, // 10 минут
    retry: 2,
  });

  return {
    categories,
    isLoading,
    error,
  };
};
