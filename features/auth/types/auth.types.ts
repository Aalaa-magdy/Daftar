
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