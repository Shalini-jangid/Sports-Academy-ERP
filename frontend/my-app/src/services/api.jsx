// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Leave API
export const leaveAPI = {
  applyLeave: (formData) => api.post('/leaves', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyLeaves: () => api.get('/leaves/my-leaves'),
  getAllLeaves: (params = {}) => api.get('/leaves', { params }),
  updateLeaveStatus: (id, status) => api.patch(`/leaves/${id}/status`, { status }),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getMyAttendance: (params = {}) => api.get('/attendance/my-attendance', { params }),
  getSportAttendance: (params = {}) => api.get('/attendance/sport', { params }),
};

// User API
export const userAPI = {
  getStudents: (params = {}) => api.get('/users/students', { params }),
  getStaff: () => api.get('/users/staff'),
  updateLeaveBalance: (data) => api.patch('/users/leave-balance', data),
};

// Schedule API
export const scheduleAPI = {
  getSchedule: () => api.get('/schedule'),
  createSchedule: (data) => api.post('/schedule', data),
};

export default api;