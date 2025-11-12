import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// User APIs
export const userAPI = {
  getProfile: (id) => axios.get(`${API_BASE_URL}/api/users/profile/${id}`),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/api/users/profile`, data),
  searchUsers: (params) => axios.get(`${API_BASE_URL}/api/users/search`, { params }),
  getStats: (id) => axios.get(`${API_BASE_URL}/api/users/stats/${id}`)
};

// Skill APIs
export const skillAPI = {
  getCategories: () => axios.get(`${API_BASE_URL}/api/skills/categories`),
  create: (data) => axios.post(`${API_BASE_URL}/api/skills`, data),
  getByUser: (userId) => axios.get(`${API_BASE_URL}/api/skills/user/${userId}`),
  search: (params) => axios.get(`${API_BASE_URL}/api/skills/search`, { params }),
  update: (id, data) => axios.put(`${API_BASE_URL}/api/skills/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/api/skills/${id}`)
};

// Help Request APIs
export const requestAPI = {
  create: (data) => axios.post(`${API_BASE_URL}/api/requests`, data),
  getAll: (params) => axios.get(`${API_BASE_URL}/api/requests`, { params }),
  getById: (id) => axios.get(`${API_BASE_URL}/api/requests/${id}`),
  getMyRequests: () => axios.get(`${API_BASE_URL}/api/requests/user/my-requests`),
  update: (id, data) => axios.put(`${API_BASE_URL}/api/requests/${id}`, data),
  respond: (id, message) => axios.post(`${API_BASE_URL}/api/requests/${id}/respond`, { message }),
  acceptResponder: (id, responderId) => axios.post(`${API_BASE_URL}/api/requests/${id}/accept/${responderId}`),
  rate: (id, score, feedback) => axios.post(`${API_BASE_URL}/api/requests/${id}/rate`, { score, feedback }),
  delete: (id) => axios.delete(`${API_BASE_URL}/api/requests/${id}`)
};

export default {
  userAPI,
  skillAPI,
  requestAPI
};
