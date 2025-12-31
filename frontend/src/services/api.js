import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Admin Services
export const adminService = {
  getUsers: (params) => api.get('/admin/access-control/users', { params }),
  updateUserStatus: (userId, status) => api.patch(`/admin/access-control/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/access-control/users/${userId}`),
  getLogs: () => api.get('/admin/access-control/logs')
};

// Emergency Services
export const emergencyService = {
  getMetrics: () => api.get('/emergency/metrics'),
  getPredictions: (params) => api.get('/emergency/predictions', { params }),
  getHistoricalData: () => api.get('/emergency/historical'),
  getNotifications: () => api.get('/emergency/notifications')
};

// Healthcare Services
export const healthcareService = {
  getDashboard: () => api.get('/healthcare/dashboard'),
  getAppointments: (params) => api.get('/healthcare/appointments', { params }),
  scheduleAppointment: (data) => api.post('/healthcare/appointments', data),
  submitVitals: (data) => api.post('/healthcare/remote-monitoring', data),
  getAiDiagnosis: (data) => api.post('/healthcare/diagnosis-assistant', data)
};

// Chatbot Service
export const chatbotService = {
  sendMessage: (message, domain, sessionId) => api.post('/chatbot', { message, domain, sessionId })
};