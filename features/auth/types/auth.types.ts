export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// ─── Signin ───────────────────────────────────────────────────────────────────

export interface SigninRequest {
  email: string;
  password: string;
}

// ─── Google ───────────────────────────────────────────────────────────────────

export interface GoogleAuthRequest {
  idToken: string;
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ResendResetCodeRequest {
  email: string;
}

export interface ResendResetCodeResponse {
  message: string;
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ─── Shared responses ─────────────────────────────────────────────────────────

export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthErrorResponse {
  statusCode: number;
  message: {
    message: string | string[];
    error: string;
    statusCode: number;
  };
  path: string;
  timestamp: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export function isAuthSuccess(response: AuthResponse): response is AuthSuccessResponse {
  return 'accessToken' in response;
}