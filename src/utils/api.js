import axios from 'axios';
import toast from 'react-hot-toast';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We only silently pass 401s if they are handled by components,
    // but a global toast here is good for general 500s.
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Tenant APIs
export const getTenant = () => api.get('/tenant');

// Usage APIs
export const getUsage = () => api.get('/usage');
export const getUsageHistory = () => api.get('/usage/history');

// Billing APIs
export const calculateInvoice = () => api.post('/billing/calculate');
export const getInvoices = () => api.get('/billing/invoices');

// Demo API
export const getDemoData = () => api.get('/demo/data');

export default api;