import { timeoutManager } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const LoginApi = axios.create({
      baseUrl: API_URL,
    //   timeout: 1000
    headers: {
    'Content-Type': 'application/json',
  },
})


LoginApi.interceptors.request.use((config) => {
  console.log('request:', config.url);
  return config;
});


LoginApi.interceptors.response.use(
    (response) =>{
        console.log('unsver:', response.status)
        return response;
    },
    (error) =>{
        console.error('error:', error.message)
        return error;
    }

)

export default LoginApi