import { makeRedirectUri } from 'expo-auth-session';
import type { GoogleAuthRequestConfig } from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const androidClientId =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? webClientId;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? webClientId;

function getWebClientIdPrefix(): string | null {
  const suffix = '.apps.googleusercontent.com';
  if (!webClientId.endsWith(suffix)) return null;
  return webClientId.slice(0, -suffix.length);
}

/**
 * Redirect URI for Google browser OAuth on native.
 * Must be listed on the **Web application** OAuth client in Google Cloud Console.
 */
export function getGoogleRedirectUri(): string {
  if (Platform.OS === 'web') {
    return makeRedirectUri({ scheme: 'daftr', path: 'oauthredirect' });
  }

  const applicationId =
    Constants.expoConfig?.android?.package ??
    Constants.expoConfig?.ios?.bundleIdentifier;

  if (applicationId) {
    return `${applicationId}:/oauthredirect`;
  }

  const webClientPrefix = getWebClientIdPrefix();
  if (webClientPrefix) {
    return `com.googleusercontent.apps.${webClientPrefix}:/oauth2redirect/google`;
  }

  return makeRedirectUri({ scheme: 'daftr', path: 'oauthredirect' });
}

export function getGoogleAuthRequestConfig(): Partial<GoogleAuthRequestConfig> {
  return {
    webClientId,
    androidClientId,
    iosClientId,
    // Browser OAuth must use the Web client ID (Android client ID causes 400 invalid_request).
    clientId: webClientId,
    redirectUri: getGoogleRedirectUri(),
    scopes: ['profile', 'email', 'openid'],
  };
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(webClientId);
}

export function getGoogleAuthDebugInfo(): {
  webClientId: string;
  redirectUri: string;
} {
  return {
    webClientId,
    redirectUri: getGoogleRedirectUri(),
  };
}
