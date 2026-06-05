import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getActivities = () => api.get('/activities');
export const getActivitiesByName = (name) => api.get(`/activities/search?name=${name}`);
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);