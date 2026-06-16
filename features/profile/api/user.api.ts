import { apiClient } from '@/lib/axios';
import { unwrapUserResponse } from '../lib/normalize-user';
import type { UserProfile } from '../types/user.types';

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<unknown>('/users/me');
    return unwrapUserResponse(response.data);
  },
};
