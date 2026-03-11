<<<<<<< HEAD
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



=======
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Api = axios.create({
    baseURL: API_URL,  
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})


Api.interceptors.request.use((config) => {
  console.log('request:', config.url);
  return config;
});


Api.interceptors.response.use(
    (response) =>{
        console.log('unsver:', response.status)
        return response;
    },
    (error) =>{
        console.error('error:', error.message)
        return error;
    }

)

export default Api
>>>>>>> 8f9fac244b45184d1e081d3c8d8557266c44ceb3
