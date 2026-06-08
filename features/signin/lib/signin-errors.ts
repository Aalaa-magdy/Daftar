// src/features/signin/lib/signin-errors.ts

export type SigninField = 'email' | 'password';

export type SigninFieldErrors = Partial<Record<SigninField, string>>;

const CLIENT_ERROR_KEYS = new Set([
  'auth.emailRequired',
  'auth.invalidEmail',
  'auth.passwordRequired',
  'auth.invalidCredentials',
]);

export function resolveSigninFieldError(
  error: string | undefined,
  t: (key: string) => string,
): string | undefined {
  if (!error) return undefined;
  if (CLIENT_ERROR_KEYS.has(error)) return t(error);
  return error;
}

export function mapSigninFieldErrors(errorMessage: string): SigninFieldErrors {
  const errors: SigninFieldErrors = {};
  const lower = errorMessage.toLowerCase();

  if (
    lower.includes('invalid credentials') ||
    lower.includes('unauthorized') ||
    lower.includes('incorrect') ||
    lower.includes('wrong password') ||
    lower.includes('invalid password')
  ) {
    errors.password = 'auth.invalidCredentials';
    return errors;
  }

  if (lower.includes('email')) {
    errors.email = errorMessage;
  } else if (lower.includes('password')) {
    errors.password = errorMessage;
  }

  if (!Object.keys(errors).length && errorMessage) {
    // Fallback: show on email field
    errors.email = errorMessage;
  }

  return errors;
}