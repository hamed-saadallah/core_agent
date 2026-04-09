import axios, { AxiosInstance } from 'axios';
import { Agent, Tool, AgentRun, ApiResponse } from '@/types';

/** Default matches backend `PORT` (see backend/src/main.ts, default 3000). Override with VITE_API_URL. */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';
let isHandlingUnauthorized = false;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const requestUrl = String(error.config?.url ?? '');
        const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

        if (status === 401 && !isAuthRequest) {
          if (isHandlingUnauthorized) {
            return Promise.reject(error);
          }
          isHandlingUnauthorized = true;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
        }
        return Promise.reject(error);
      },
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

const apiClientInstance = new ApiClient().getClient();

export const apiClient = apiClientInstance;
export default apiClientInstance;
