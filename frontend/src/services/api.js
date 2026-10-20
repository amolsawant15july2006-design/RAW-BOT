import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('raw_bot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const robotApi = {
  getAll: () => api.get('/robots'),
  getById: (id) => api.get(`/robots/${id}`),
  sendCommand: (id, command, extraData = {}) => api.post(`/robots/${id}/command`, { command, ...extraData }),
  update: (id, data) => api.put(`/robots/${id}`, data),
  create: (data) => api.post('/robots', data),
};

export const packageApi = {
  getAll: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

export const taskApi = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const locationApi = {
  getAll: () => api.get('/location'),
  getByRobot: (robotId) => api.get(`/location/${robotId}`),
};

export const alertApi = {
  getAll: (params) => api.get('/alerts', { params }),
  create: (data) => api.post('/alerts', data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  clearAll: () => api.delete('/alerts'),
};

export const settingApi = {
  getAll: () => api.get('/settings'),
  update: (section, data) => api.put(section ? `/settings/${section}` : '/settings', data),
};

export const userApi = {
  login: (credentials) => api.post('/users/login', credentials),
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const simulationApi = {
  getStatus: () => api.get('/simulation/status'),
  toggle: () => api.post('/simulation/toggle'),
  setSpeed: (speed) => api.post('/simulation/speed', { speed }),
  triggerObstacle: (robotId) => api.post('/simulation/obstacle', { robotId }),
};

export const hardwareApi = {
  getStatus: () => api.get('/hardware/status'),
  setConfig: (config) => api.post('/hardware/config', config),
  move: (dir) => api.post('/hardware/move', { dir }),
  emergency: () => api.post('/hardware/emergency'),
  getDistances: () => api.get('/hardware/distances'),
  heartbeat: () => api.get('/hardware/heartbeat'),
};

export const healthApi = {
  check: () => api.get('/health'),
};

export default api;
