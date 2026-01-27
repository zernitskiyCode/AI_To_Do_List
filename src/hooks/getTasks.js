import Api from '../api/Api';

export const getTasks = async () => {
  const response = await Api.get('/gettask');
  return response.data;
};

export const createTaskInDB = async (taskData) => {
  const response = await Api.post('/createtask', taskData);
  return response.data;
};

export const updateTaskInDB = async (taskId, updates) => {
  const response = await Api.put(`/updatetask/${taskId}`, updates);
  return response.data;
};

export const deleteTaskFromDB = async (taskId) => {
  const response = await Api.delete(`/deletetask/${taskId}`);
  return response.data;
};