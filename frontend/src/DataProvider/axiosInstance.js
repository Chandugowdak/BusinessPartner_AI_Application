import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const isInvalidSession = (status === 401 && message === 'Access token required')
      || (status === 403 && message === 'Invalid token');

    if (isInvalidSession && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('verificationSkipped');
      if (window.location.pathname !== '/login') window.location.replace('/login');
    }

    return Promise.reject(error);
  },
);

export default apiClient;
