// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
});

// Attach token if present
api.interceptors.request.use((config) => {
    const authRaw = localStorage.getItem('auth');
    if (authRaw) {
        try {
            const { token } = JSON.parse(authRaw);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch { }
    }
    return config;
});

export default api;
