
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

// Request APIs
export const requestAPI = {
  create: (data) => api.post('/api/requests', data),
  getAll: (params) => api.get('/api/requests', { params }),
  getById: (id) => api.get(`/api/requests/${id}`),
  getMyRequests: () => api.get('/api/requests/user/my-requests'),
  update: (id, data) => api.put(`/api/requests/${id}`, data),
  respond: (id, message) => api.post(`/api/requests/${id}/respond`, { message }),
  acceptResponder: (id, responderId) => api.post(`/api/requests/${id}/accept/${responderId}`),
  rate: (id, score, feedback) => api.post(`/api/requests/${id}/rate`, { score, feedback }),
  delete: (id) => api.delete(`/api/requests/${id}`),
};

// Export the instance (optional, if needed elsewhere)
export { api };
