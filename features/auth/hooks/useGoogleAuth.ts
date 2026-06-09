import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import {
  getGoogleSignin,
  getGoogleSigninHelpers,
} from '../lib/google-signin';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { AuthResponse } from '@/features/auth/types/auth.types';
import { getApiErrorMessage } from '@/lib/api-error';

type UseGoogleAuthOptions = {
  onSuccess?: () => void;
};

async function getGoogleErrorMessage(error: unknown): Promise<string> {
  const { isErrorWithCode, statusCodes } = await getGoogleSigninHelpers();

  if (isErrorWithCode(error)) {
    const code = (error as { code: string }).code;
    switch (code) {
      case statusCodes.SIGN_IN_CANCELLED:
      case statusCodes.IN_PROGRESS:
        return '';
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services not available on this device.';
      default:
        return 'Google sign-in failed. Please try again.';
    }
  }

  if (error instanceof AxiosError) {
    return getApiErrorMessage(error);
  }

  if (error instanceof Error) {
    if (error.message.includes('Native module')) {
      return 'Google sign-in requires a development build. It is not available in Expo Go.';
    }
    if (error.message) {
      return error.message;
    }
  }

  return 'Something went wrong. Please try again.';
}

export const useGoogleAuth = ({ onSuccess }: UseGoogleAuthOptions = {}) => {
  const mutation = useMutation<AuthResponse, Error, void>({
    mutationFn: async () => {
      const GoogleSignin = await getGoogleSignin();

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();

      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;

      if (!idToken) {
        throw new Error('Google sign-in did not return an idToken.');
      }

      return authApi.googleAuth({ idToken });
    },
    onSuccess: async (data) => {
      await storeAuthTokens(data);
      onSuccess?.();
    },
  });

  const signInWithGoogle = useCallback(async () => {
    try {
      await mutation.mutateAsync();
    } catch (error) {
      const message = await getGoogleErrorMessage(error);
      if (message) {
        Alert.alert('Error', message);
      }
    }
  }, [mutation]);

  return {
    signInWithGoogle,
    isPending: mutation.isPending,
  };
};
