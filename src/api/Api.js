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
