import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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