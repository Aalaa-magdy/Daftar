// src/lib/axios.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function attachAccessToken(config: InternalAxiosRequestConfig) {
  const token = (await AsyncStorage.getItem('accessToken'))?.trim();
  if (!token) return config;

  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

// Attach Bearer token to every request (auth, categories, transactions, etc.)
apiClient.interceptors.request.use(attachAccessToken, (error) =>
  Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authHeader =
        error.config?.headers?.Authorization ??
        error.config?.headers?.get?.('Authorization');

      // Only clear stored tokens when the request was sent with a token that was rejected.
      if (authHeader) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      }
    }
    return Promise.reject(error);
  },
);