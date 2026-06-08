// src/features/signin/api/signin.api.ts
import { apiClient } from '../../../lib/axios';
import { SigninRequest, AuthResponse } from '../types/signin.types';

export const signinApi = {
  signin: async (data: SigninRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};