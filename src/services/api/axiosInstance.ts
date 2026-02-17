
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
