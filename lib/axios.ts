import {
  handleRefreshFailure,
  refreshAccessToken,
  shouldSkipTokenRefresh,
} from '@/features/auth/lib/token-refresh';
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

function getAuthorizationHeader(config: InternalAxiosRequestConfig) {
  return (
    config.headers?.Authorization ??
    (typeof config.headers?.get === 'function'
      ? config.headers.get('Authorization')
      : undefined)
  );
}

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string,
) {
  const value = `Bearer ${token}`;

  if (typeof config.headers.set === 'function') {
    config.headers.set('Authorization', value);
  } else {
    config.headers.Authorization = value;
  }
}

apiClient.interceptors.request.use(attachAccessToken, (error) =>
  Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry || shouldSkipTokenRefresh(originalRequest.url)) {
      return Promise.reject(error);
    }

    const authHeader = getAuthorizationHeader(originalRequest);
    if (!authHeader) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      setAuthorizationHeader(originalRequest, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      await handleRefreshFailure();
      return Promise.reject(refreshError);
    }
  },
);
