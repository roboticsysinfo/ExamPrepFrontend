import axios from 'axios';

const getToken = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;

  try {
    const parsed = JSON.parse(userData);
    return parsed.token || null;
  } catch (err) {
    console.error('Error parsing token from localStorage:', err);
    return null;
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized - Redirecting to login");
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
