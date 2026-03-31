import axios from 'axios';
 
const API_BASE = process.env.REACT_APP_API_URL || '/api';
 
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});
 
// Attach token from localStorage on init
const token = localStorage.getItem('bvp_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
 
// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bvp_token');
      localStorage.removeItem('bvp_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);
 
export const reportAPI = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  getAnalytics: (params) => api.get('/reports/analytics/summary', { params }),
  getBranches: () => api.get('/reports/branches'),
  getConsolidated: (params) => api.get('/reports/reports/consolidated', { params }),
  getProjectWise: (params) => api.get('/reports/reports/projectwise', { params }),
  getBranchHistory: (params) => api.get('/reports/reports/branch-history', { params }),
};
 
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getUsers: () => api.get('/auth/users'),
  approveUser: (id) => api.put(`/auth/users/${id}/approve`),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};
 
export default api;