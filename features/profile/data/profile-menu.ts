import File02Icon from '@hugeicons/core-free-icons/File02Icon';
import FileSecurityIcon from '@hugeicons/core-free-icons/FileSecurityIcon';
import LanguageCircleIcon from '@hugeicons/core-free-icons/LanguageCircleIcon';
import MessageQuestionIcon from '@hugeicons/core-free-icons/MessageQuestionIcon';
import Settings01Icon from '@hugeicons/core-free-icons/Settings01Icon';
import SquareLockPasswordIcon from '@hugeicons/core-free-icons/SquareLockPasswordIcon';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import type { IconSvgElement } from '@hugeicons/react-native';

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: IconSvgElement;
};

export type ProfileMenuSection = {
  id: string;
  title: string;
  items: ProfileMenuItem[];
};

export const PROFILE_MENU_SECTIONS: ProfileMenuSection[] = [
  {
    id: 'profile-settings',
    title: 'Profile Settings',
    items: [
      {
        id: 'edit-profile',
        label: 'Edit Profile Information',
        icon: Settings01Icon,
      },
      {
        id: 'change-password',
        label: 'Change Password',
        icon: SquareLockPasswordIcon,
      },
    ],
  },
  {
    id: 'app-settings',
    title: 'App Settings',
    items: [
      {
        id: 'language',
        label: 'Language',
        icon: LanguageCircleIcon,
      },
    ],
  },
  {
    id: 'help-support',
    title: 'Help & Support',
    items: [
      {
        id: 'rate-us',
        label: 'Rate Us',
        icon: StarIcon,
      },
      {
        id: 'faq',
        label: 'Frequently Asked Questions',
        icon: MessageQuestionIcon,
      },
      {
        id: 'terms',
        label: 'Terms & Conditions',
        icon: File02Icon,
      },
      {
        id: 'privacy',
        label: 'Privacy Policy',
        icon: FileSecurityIcon,
      },
    ],
  },
];

export const PROFILE_USER = {
  name: 'Salma Gamal',
  email: 'salmagamaal119@gmail.com',
  avatar: require('@/assets/images/profile.jpg'),
};
