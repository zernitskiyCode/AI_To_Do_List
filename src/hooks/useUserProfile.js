<<<<<<< HEAD
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
    retry: 1,
  });
};
=======
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
>>>>>>> 8f9fac244b45184d1e081d3c8d8557266c44ceb3
