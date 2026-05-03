import axios from 'axios';
import { useAuthStore } from './store.js';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (password) => api.post('/auth/login', { password }),
  verify: () => api.post('/auth/verify'),
};

export const videosAPI = {
  getAll: () => api.get('/videos'),
  getOne: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
  reorder: (order) => api.post('/videos/reorder', { order }),
};

export const uploadAPI = {
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (key, value) => api.post('/settings', { key, value }),
};

export default api;
