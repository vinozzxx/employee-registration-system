import api from './api';
import type { LoginRequest, SignupRequest, AuthData, ApiResponse } from '../types';

/**
 * Auth API Service
 * Handles HTTP communication for Authentication.
 */
export const authService = {
  async login(data: LoginRequest): Promise<AuthData> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data.data as AuthData;
  },

  async signup(data: SignupRequest): Promise<AuthData> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/signup', data);
    return response.data.data as AuthData;
  },
};
