import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Api = axios.create({
    baseURL: API_URL,  
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
})

Api.interceptors.request.use((config) => {
  console.log('request:', config.method?.toUpperCase(), config.url);
  return config;
});

Api.interceptors.response.use(
    (response) => {
        console.log('response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('error:', error.response?.status, error.message, 'URL:', error.config?.url);
        return Promise.reject(error); 
    }
)

export default Api



