import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { authApi } from '@/features/auth/api/auth.api';
import {
  getGoogleAuthRequestConfig,
  isGoogleAuthConfigured,
} from '@/features/auth/lib/google-auth-config';
import {
  getNativeGoogleSignInErrorMessage,
  signInWithNativeGoogle,
} from '@/features/auth/lib/native-google-signin';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks';
import { transactionKeys } from '@/features/transactions/hooks/query-keys';
import { queryClient } from '@/lib/query-client';
import { getApiErrorMessage } from '@/lib/api-error';

WebBrowser.maybeCompleteAuthSession();

type UseGoogleAuthOptions = {
  onSuccess?: () => void;
};

async function completeGoogleAuth(idToken: string, onSuccess?: () => void) {
  const data = await authApi.googleAuth({ idToken });
  await storeAuthTokens(data);
  await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
  onSuccess?.();
}

export const useGoogleAuth = ({ onSuccess }: UseGoogleAuthOptions = {}) => {
  const [isPending, setIsPending] = useState(false);
  const googleConfig = getGoogleAuthRequestConfig();
  const useBrowserFlow = Platform.OS === 'web';

  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

  useEffect(() => {
    if (!useBrowserFlow || !response) return;

    if (response.type === 'success') {
      const idToken =
        response.authentication?.idToken ??
        (typeof response.params?.id_token === 'string'
          ? response.params.id_token
          : undefined);

      if (!idToken) {
        setIsPending(false);
        Alert.alert('Error', 'Google sign-in did not return a token. Please try again.');
        return;
      }

      completeGoogleAuth(idToken, onSuccess)
        .catch((error) => {
          Alert.alert('Error', getApiErrorMessage(error));
        })
        .finally(() => {
          setIsPending(false);
        });
    } else if (response.type === 'error') {
      setIsPending(false);
      Alert.alert('Error', response.error?.message ?? 'Google sign-in failed. Please try again.');
    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      setIsPending(false);
    }
  }, [response, onSuccess, useBrowserFlow]);

  const signInWithGoogle = useCallback(async () => {
    if (Constants.appOwnership === 'expo' && Platform.OS === 'android') {
      Alert.alert(
        'Development build required',
        'Google sign-in does not work in Expo Go on Android. Run: npx expo run:android',
      );
      return;
    }

    if (!isGoogleAuthConfigured()) {
      Alert.alert(
        'Error',
        'Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env.local.',
      );
      return;
    }

    if (Platform.OS !== 'web') {
      try {
        setIsPending(true);
        const idToken = await signInWithNativeGoogle();
        await completeGoogleAuth(idToken, onSuccess);
      } catch (error) {
        const message = getNativeGoogleSignInErrorMessage(error);
        if (message) {
          Alert.alert('Error', message);
        }
      } finally {
        setIsPending(false);
      }
      return;
    }

    if (!request) {
      Alert.alert('Error', 'Google sign-in is not ready yet. Please try again.');
      return;
    }

    try {
      setIsPending(true);
      await promptAsync({ showInRecents: true });
    } catch {
      setIsPending(false);
      Alert.alert('Error', 'Could not open Google sign-in. Please try again.');
    }
  }, [request, promptAsync, onSuccess]);

  return {
    signInWithGoogle,
    isPending,
  };
};
