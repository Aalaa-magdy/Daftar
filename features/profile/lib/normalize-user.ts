import type { UserProfile } from '../types/user.types';

function pickUserRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;

  if (record.user && typeof record.user === 'object') {
    return record.user as Record<string, unknown>;
  }

  if (
    record.data &&
    typeof record.data === 'object' &&
    !Array.isArray(record.data)
  ) {
    return record.data as Record<string, unknown>;
  }

  return record;
}

export function normalizeUser(raw: unknown): UserProfile | null {
  const nested = pickUserRecord(raw);
  if (!nested) return null;

  const name = String(nested.name ?? nested.fullName ?? '').trim();
  const email = String(nested.email ?? '').trim();
  const id = nested._id ?? nested.id ?? email;

  if (!name && !email) return null;

  return {
    _id: id != null ? String(id) : '',
    name,
    email,
    provider: nested.provider === 'google' ? 'google' : 'local',
    currency: String(nested.currency ?? 'EGP'),
    isEmailVerified: Boolean(nested.isEmailVerified),
    pendingEmailVerified: Boolean(nested.pendingEmailVerified),
    isActive: nested.isActive !== false,
    totalIncome: Number(nested.totalIncome ?? 0),
    totalExpense: Number(nested.totalExpense ?? 0),
    profileImage: readProfilePictureUrl(nested),
    createdAt: String(nested.createdAt ?? ''),
    updatedAt: String(nested.updatedAt ?? ''),
    lastLoginAt: String(nested.lastLoginAt ?? ''),
  };
}

function readOptionalString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export function readProfilePictureUrl(raw: unknown): string | undefined {
  const nested = pickUserRecord(raw);
  if (!nested) return undefined;

  return readOptionalString(nested, [
    'profileImage',
    'profilePictureUrl',
    'avatar',
    'avatarUrl',
    'imageUrl',
    'url',
  ]);
}

export function unwrapUserResponse(data: unknown): UserProfile {
  const user = normalizeUser(data);
  if (!user) {
    throw new Error('Invalid user profile response');
  }
  return user;
}
