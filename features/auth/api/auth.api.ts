import { apiClient } from '@/lib/axios';
import {
  SignupRequest,
  SigninRequest,
  GoogleAuthRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendResetCodeRequest,
  ResendResetCodeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
} from '@/features/auth/types/auth.types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  signin: async (data: SigninRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  googleAuth: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', data);
    return response.data;
  },

  // ─── Password Reset ─────────────────────────────────────────────────────────

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetCode: async (data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> => {
    const response = await apiClient.post<VerifyResetCodeResponse>('/auth/verify-reset-code', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', data);
    return response.data;
  },

  resendResetCode: async (data: ResendResetCodeRequest): Promise<ResendResetCodeResponse> => {
    const response = await apiClient.post<ResendResetCodeResponse>('/auth/resend-reset-code', data);
    return response.data;
  },

  // ─── Token Refresh ───────────────────────────────────────────────────────────

  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  },

  logout: async (data?: RefreshTokenRequest): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout', data ?? {});
    return response.data;
  },
};