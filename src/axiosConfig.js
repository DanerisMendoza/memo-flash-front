import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/', // Replace with your API base URL
    timeout: 10000, // Adjust the timeout as needed
});

// Add request interceptor to attach token when available
axiosInstance.interceptors.request.use(
    config => {
        // Add token to request headers if available
        const token = localStorage.getItem('token'); // Retrieve token from storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling unauthorized access or other responses globally
axiosInstance.interceptors.response.use(
    response => {
        // Handle responses globally if needed
        return response;
    },
    error => {
        // Handle error responses globally if needed
        return Promise.reject(error);
    }
);

export default axiosInstance;
