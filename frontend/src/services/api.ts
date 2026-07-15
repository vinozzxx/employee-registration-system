import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config';
import { STORAGE_KEYS, MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

/**
 * Configured Axios instance — the single HTTP client for the entire frontend.
 *
 * Interceptors handle:
 *   - Request: Automatically attach JWT token from localStorage
 *   - Response: Unwrap the API response envelope
 *   - Error: Translate HTTP errors to user-facing messages,
 *             handle 401 (token expiry) globally
 *
 * Principle: DRY — auth header logic is in one place, not every service.
 *            Single Responsibility — HTTP concerns live here, not in components.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------------------------------------------
// Request Interceptor — Attach JWT token
// -------------------------------------------------------
apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && requestConfig.headers) {
      requestConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error: unknown) => Promise.reject(error),
);

// -------------------------------------------------------
// Response Interceptor — Handle errors globally
// -------------------------------------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Token expired or invalid — dispatch global event
      if (status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(new Error(MESSAGES.UNAUTHORIZED));
      }

      // Return the API error message if available
      const apiError = error.response?.data as ApiResponse | undefined;
      const message = apiError?.message ?? error.message ?? MESSAGES.NETWORK_ERROR;
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
