import { makeRedirectUri } from 'expo-auth-session';
import type { GoogleAuthRequestConfig } from 'expo-auth-session/providers/google';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

/**
 * Redirect URI for Google browser OAuth.
 * Must be listed on the **Web application** OAuth client in Google Cloud Console
 * under Authorized redirect URIs (e.g. daftr:/oauthredirect and daftr://oauthredirect).
 */
export function getGoogleRedirectUri(): string {
  return makeRedirectUri({ scheme: 'daftr', path: 'oauthredirect' });
}

export function getGoogleAuthRequestConfig(): Partial<GoogleAuthRequestConfig> {
  return {
    webClientId,
    // Browser OAuth on native must use the Web client ID (platform client IDs cause 400).
    androidClientId: webClientId,
    iosClientId: webClientId,
    clientId: webClientId,
    redirectUri: getGoogleRedirectUri(),
    scopes: ['profile', 'email', 'openid'],
    selectAccount: true,
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
