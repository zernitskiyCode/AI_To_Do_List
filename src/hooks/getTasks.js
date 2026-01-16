import Api from '../api/Api';
import { useAuthStore } from './useAuthStore';

export const getTasks = async () => {
  const { user } = useAuthStore.getState();
  
  if (!user?.user_id) {
    throw new Error('User not authenticated');
  }

  const response = await Api.get('/gettask', {
    params: { user_id: user.user_id }
  });
  
  return response.data;
};

export const createTaskInDB = async (taskData) => {
  const { user } = useAuthStore.getState();
  
  if (!user?.user_id) {
    throw new Error('User not authenticated');
  }

  const response = await Api.post('/createtask', {
    ...taskData,
    user_id: user.user_id
  });
  
  return response.data;
};

export const updateTaskInDB = async (taskId, updates) => {
  const { user } = useAuthStore.getState();
  
  if (!user?.user_id) {
    throw new Error('User not authenticated');
  }

  const response = await Api.put(`/updatetask/${taskId}`, {
    ...updates,
    user_id: user.user_id
  });
  
  return response.data;
};

export const deleteTaskFromDB = async (taskId) => {
  const { user } = useAuthStore.getState();
  
  if (!user?.user_id) {
    throw new Error('User not authenticated');
  }

  const response = await Api.delete(`/deletetask/${taskId}`, {
    params: { user_id: user.user_id }
  });
  
  return response.data;
};