import File02Icon from '@hugeicons/core-free-icons/File02Icon';
import FileSecurityIcon from '@hugeicons/core-free-icons/FileSecurityIcon';
import LanguageCircleIcon from '@hugeicons/core-free-icons/LanguageCircleIcon';
import MessageQuestionIcon from '@hugeicons/core-free-icons/MessageQuestionIcon';
import Settings01Icon from '@hugeicons/core-free-icons/Settings01Icon';
import SquareLockPasswordIcon from '@hugeicons/core-free-icons/SquareLockPasswordIcon';
// import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import type { IconSvgElement } from '@hugeicons/react-native';

export type ProfileMenuItem = {
  id: string;
  labelKey: string;
  icon: IconSvgElement;
};

export type ProfileMenuSection = {
  id: string;
  titleKey: string;
  items: ProfileMenuItem[];
};

export const PROFILE_MENU_SECTIONS: ProfileMenuSection[] = [
  {
    id: 'profile-settings',
    titleKey: 'profile.sections.profileSettings',
    items: [
      {
        id: 'edit-profile',
        labelKey: 'profile.menu.editProfile',
        icon: Settings01Icon,
      },
      {
        id: 'change-password',
        labelKey: 'profile.menu.changePassword',
        icon: SquareLockPasswordIcon,
      },
    ],
  },
  {
    id: 'app-settings',
    titleKey: 'profile.sections.appSettings',
    items: [
      {
        id: 'language',
        labelKey: 'profile.menu.language',
        icon: LanguageCircleIcon,
      },
    ],
  },
  {
    id: 'help-support',
    titleKey: 'profile.sections.helpSupport',
    items: [
      // {
      //   id: 'rate-us',
      //   labelKey: 'profile.menu.rateUs',
      //   icon: StarIcon,
      // },
      {
        id: 'faq',
        labelKey: 'profile.menu.faq',
        icon: MessageQuestionIcon,
      },
      {
        id: 'terms',
        labelKey: 'profile.menu.terms',
        icon: File02Icon,
      },
      {
        id: 'privacy',
        labelKey: 'profile.menu.privacy',
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
