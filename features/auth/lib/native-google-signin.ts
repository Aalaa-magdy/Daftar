import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

let configured = false;

function ensureConfigured() {
  if (configured) return;

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    throw new Error('MISSING_WEB_CLIENT_ID');
  }

  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
  });

  configured = true;
}

export async function signInWithNativeGoogle(): Promise<string> {
  ensureConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore — there may be no cached session
  }

  const result = await GoogleSignin.signIn();
  if (result.type === 'cancelled') {
    throw Object.assign(new Error('Sign-in cancelled'), { code: statusCodes.SIGN_IN_CANCELLED });
  }

  const idToken =
    result.data.idToken ?? (await GoogleSignin.getTokens()).idToken;

  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }

  return idToken;
}

export function getNativeGoogleSignInErrorMessage(error: unknown): string | null {
  const code = (error as { code?: string })?.code;

  if (code === statusCodes.SIGN_IN_CANCELLED) {
    return null;
  }

  if (code === statusCodes.IN_PROGRESS) {
    return 'Google sign-in is already in progress.';
  }

  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services is not available on this device.';
  }

  if (error instanceof Error && error.message === 'MISSING_WEB_CLIENT_ID') {
    return 'Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env.local.';
  }

  if (code === '10' || code === '12500') {
    return (
      'Google Sign-In setup error (DEVELOPER_ERROR). In Google Cloud Console, open your Android OAuth client (package com.daftr) and add the SHA-1 from ":app signingReport" (not library modules). Run: cd android && .\\gradlew signingReport — use the SHA1 under Task :app:signingReport → Variant: debug.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Google sign-in failed. Please try again.';
}
