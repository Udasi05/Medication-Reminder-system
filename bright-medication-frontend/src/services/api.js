// ============================================
// FILE: src/services/api.js
// ============================================
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
};

// Elder API calls
export const elderAPI = {
    getAll: () => api.get('/elders'),
    getById: (id) => api.get(`/elders/${id}`),
    create: (data) => api.post('/elders', data),
    update: (id, data) => api.put(`/elders/${id}`, data),
    delete: (id) => api.delete(`/elders/${id}`),
};

// Medication API calls
export const medicationAPI = {
    getByElder: (elderId) => api.get(`/medications/elder/${elderId}`),
    getById: (id) => api.get(`/medications/${id}`),
    create: (data) => api.post('/medications', data),
    update: (id, data) => api.put(`/medications/${id}`, data),
    delete: (id) => api.delete(`/medications/${id}`),
};

// Reminder API calls
export const reminderAPI = {
    getAll: () => api.get('/reminders'),
    getToday: () => api.get('/reminders/today'),
    getByElder: (elderId) => api.get(`/reminders/elder/${elderId}`),
    getStats: () => api.get('/reminders/stats'),
    confirm: (id) => api.put(`/reminders/${id}/confirm`),
};

export default api;