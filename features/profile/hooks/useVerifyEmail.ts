import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import type { UserProfile, VerifyEmailVariables } from '../types/user.types';
import { profileKeys } from './query-keys';

async function resolveProfileAfterVerification(
  pendingEmail: string | undefined,
  verifiedProfile: UserProfile | null,
): Promise<UserProfile> {
  const profile = verifiedProfile ?? (await userApi.getMe());

  const targetEmail = pendingEmail?.trim();
  if (!targetEmail || profile.email.trim() === targetEmail) {
    return { ...profile, isEmailVerified: true };
  }

  return userApi.updateMe({
    name: profile.name,
    email: targetEmail,
  });
}

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, AxiosError, VerifyEmailVariables>({
    mutationFn: ({ code, pendingEmail }) =>
      userApi.verifyEmail({ code }).then((verifiedProfile) =>
        resolveProfileAfterVerification(pendingEmail, verifiedProfile),
      ),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.me, profile);
    },
  });
};
