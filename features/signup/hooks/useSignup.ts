// src/features/auth/hooks/useSignup.ts
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupApi } from '../api/signup.api';
import { SignupRequest, AuthResponse, isAuthSuccess } from '../types/signup.types';
import { AxiosError } from 'axios';

export const useSignup = () => {
  return useMutation<AuthResponse, AxiosError, SignupRequest>({
    mutationFn: async (userData: SignupRequest) => {
      const response = await signupApi.signup(userData);
      return response;
    },
    
    onSuccess: async (data) => {
      // Store tokens if returned from backend
      if (isAuthSuccess(data)) {
        await AsyncStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', data.refreshToken);
        }
      }
    },
    
  });
};