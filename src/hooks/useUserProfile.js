import { useQuery } from '@tanstack/react-query';
import Api from '../api/Api';

export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const response = await Api.get('/getInfoProfile', {
        params: { user_id: userId }
      });
      const data = response.data;
      return {
        name: data[0],
        surname: data[1],
        email: data[2]
      };
    },
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000,
  });
};