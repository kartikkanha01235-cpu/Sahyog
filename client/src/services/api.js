
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create one configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// User APIs
export const userAPI = {
  getProfile: (id) => api.get(`/api/users/profile/${id}`),
  updateProfile: (data) => api.put('/api/users/profile', data),
  searchUsers: (params) => api.get('/api/users/search', { params }),
  getStats: (id) => api.get(`/api/users/stats/${id}`),
};

// Skill APIs
export const skillAPI = {
  getCategories: () => api.get('/api/skills/categories'),
  create: (data) => api.post('/api/skills', data),
  getByUser: (userId) => api.get(`/api/skills/user/${userId}`),
  search: (params) => api.get('/api/skills/search', { params }),
  update: (id, data) => api.put(`/api/skills/${id}`, data),
  delete: (id) => api.delete(`/api/skills/${id}`),
};

// Export the instance (optional, if needed elsewhere)
export { api };
