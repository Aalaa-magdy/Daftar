export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type ProfilePicturePickerAsset = {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
};

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  provider: 'local' | 'google';
  currency: string;
  isEmailVerified: boolean;
  pendingEmailVerified: boolean;
  isActive: boolean;
  totalIncome: number;
  totalExpense: number;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}