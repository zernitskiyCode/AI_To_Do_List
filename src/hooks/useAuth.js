import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Api from '../api/Api';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await Api.get('/me');
      return response.data;
    },
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => Api.post('/login', credentials),
    onSuccess: () => {
      meQuery.refetch();
    }
  });

  const registerMutation = useMutation({
    mutationFn: (userData) => Api.post('/registration', userData),
    onSuccess: () => {
      meQuery.refetch();
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => Api.post('/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.invalidateQueries(['me']);
    },
    onError: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.invalidateQueries(['me']);
    }
  });

  const isAuthenticated = !!meQuery.data && !meQuery.error;
  const isLoading = meQuery.isLoading;

  return {
    // data user
    user_id: meQuery.data,
    
    // state
    isAuthenticated,
    isLoading,
    
    // Мmethod
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    loginLoading: loginMutation.isPending,
    
    register: registerMutation.mutate,
    registerError: registerMutation.error,
    registerLoading: registerMutation.isPending,
    
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
    
    // extend methods
    checkAuth: meQuery.refetch,
    authError: meQuery.error
  };
};