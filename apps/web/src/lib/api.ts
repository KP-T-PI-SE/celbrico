import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

// Assuming the API server runs on port 5000 during dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token || useAuthStore.getState().tempToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token expiration/refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.startsWith('/login') || 
                           currentPath.startsWith('/otp') || 
                           currentPath.startsWith('/set-pin') || 
                           currentPath.startsWith('/onboarding');
        if (!isAuthPage) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
