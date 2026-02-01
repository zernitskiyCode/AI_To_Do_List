import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Api = axios.create({
    baseURL: API_URL,  
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Важно! Для отправки cookies
})

Api.interceptors.request.use((config) => {
  console.log('request:', config.url);
  return config;
});

Api.interceptors.response.use(
    (response) => {
        console.log('response:', response.status);
        return response;
    },
    (error) => {
        console.error('error:', error.response?.status, error.message);
        return Promise.reject(error); // Важно! Возвращаем rejected promise
    }
)

export default Api



