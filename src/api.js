// api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  'http://localhost:9000/',
});

axiosInstance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('mff-token');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
