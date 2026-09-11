import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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
    const isAuthEndpoint = error.config?.url?.includes('/auth/');

    if (error.response?.status === 401) {
      if (!isAuthEndpoint) {
        // Token expired or invalid for authenticated requests
        localStorage.removeItem('pawfectly_token');
        localStorage.removeItem('pawfectly_user');
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
      const authMessage = isAuthEndpoint
        ? error.response.data?.message || 'Invalid email or password. Please check your credentials.'
        : 'Session expired or authentication failed. Please log in again.';
      const authErr = new Error(authMessage);
      (authErr as any).response = error.response;
      (authErr as any).status = 401;
      return Promise.reject(authErr);
    }

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout: The server took too long to respond. Please check your connection.'));
      }
      return Promise.reject(new Error(error.message || 'Network error: Unable to connect to server. Please check your connection.'));
    }

    if (
      error.response.status === 403 &&
      !isAuthEndpoint &&
      typeof error.response.data?.message === 'string' &&
      (error.response.data.message.toLowerCase().includes('deactivated') ||
       error.response.data.message.toLowerCase().includes('locked'))
    ) {
      localStorage.removeItem('pawfectly_token');
      localStorage.removeItem('pawfectly_user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }

    const message =
      error.response.data?.message ||
      (error.response.status === 403
        ? 'You do not have permission to perform this action.'
        : `Server error (${error.response.status}): An unexpected error occurred. Please try again.`);

    const customError = new Error(message);
    (customError as any).response = error.response;
    (customError as any).status = error.response.status;
    return Promise.reject(customError);
  }
);

export default apiClient;
