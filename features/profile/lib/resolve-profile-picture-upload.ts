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

  const profilePicture = readProfilePictureUrl(data);
  if (profilePicture) {
    const current = await refetchProfile();
    return { ...current, profilePicture };
  }

  return refetchProfile();
}
