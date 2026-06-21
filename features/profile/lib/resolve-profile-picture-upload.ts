import type { UserProfile } from '../types/user.types';
import { normalizeUser, readProfilePictureUrl } from './normalize-user';

/** Parses upload response or refetches `/users/me` when the body is partial. */
export async function resolveProfilePictureUploadResult(
  data: unknown,
  refetchProfile: () => Promise<UserProfile>,
): Promise<UserProfile> {
  const user = normalizeUser(data);
  if (user) {
    return user;
  }

  const profileImage = readProfilePictureUrl(data);
  if (profileImage) {
    try {
      const current = await refetchProfile();
      return { ...current, profileImage };
    } catch {
      return {
        _id: '',
        name: '',
        email: '',
        provider: 'local',
        currency: 'EGP',
        isEmailVerified: false,
        pendingEmailVerified: false,
        isActive: true,
        totalIncome: 0,
        totalExpense: 0,
        profileImage,
        createdAt: '',
        updatedAt: '',
        lastLoginAt: '',
      };
    }
  }

  return refetchProfile();
}
