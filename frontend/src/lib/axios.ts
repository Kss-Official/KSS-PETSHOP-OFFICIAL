import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    '[axios] VITE_API_BASE_URL is not set. ' +
      'Add it to your frontend/.env file (e.g. VITE_API_BASE_URL=http://localhost:8080/api).'
  );
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pawfectly_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; status?: number }>) => {
    if (!error.response) {
      // Network failure / server unreachable
      return Promise.reject(new Error('Network error: Unable to connect to server. Please check your connection.'));
    }

    if (error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('pawfectly_token');
      localStorage.removeItem('pawfectly_user');
      if (!window.location.pathname.includes('/login')) {
        // Optionally redirect or dispatch event
      }
    }

    const message =
      error.response.data?.message ||
      (error.response.status === 403
        ? 'You do not have permission to perform this action.'
        : 'An unexpected error occurred. Please try again.');

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
