// src/features/signin/types/signin.types.ts

export interface SigninRequest {
    email: string;
    password: string;
  }
  
  // Success response (200)
  export interface AuthSuccessResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  // Error response (400, etc.)
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
  
  // Union type for API response
  export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;
  
  // Helper to check if response is success
  export function isAuthSuccess(response: AuthResponse): response is AuthSuccessResponse {
    return 'accessToken' in response;
  }