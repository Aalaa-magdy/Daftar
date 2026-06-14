import type { IconSvgElement } from "@hugeicons/react-native";
import Key01Icon from "@hugeicons/core-free-icons/Key01Icon";
import NewReleasesIcon from "@hugeicons/core-free-icons/NewReleasesIcon";
import SquareLockPasswordIcon from "@hugeicons/core-free-icons/SquareLockPasswordIcon";

export type PasswordStepType = 'forget' | 'check' | 'verify';

export interface PasswordDataType {
  id: number;
  type: PasswordStepType;
  titleKey: string;
  subtitleKey: string;
  icon: IconSvgElement;
}

export const passwordData: PasswordDataType[] = [
  {
    id: 1,
    type: 'forget',
    titleKey: 'resetPassword.forgotTitle',
    subtitleKey: 'resetPassword.forgotSubtitle',
    icon: Key01Icon,
  },
  {
    id: 2,
    type: 'check',
    titleKey: 'resetPassword.checkEmailTitle',
    subtitleKey: 'resetPassword.checkEmailSubtitle',
    icon: NewReleasesIcon,
  },
  {
    id: 3,
    type: 'verify',
    titleKey: 'resetPassword.setNewPasswordTitle',
    subtitleKey: 'resetPassword.setNewPasswordSubtitle',
    icon: SquareLockPasswordIcon,
  },
];

export default passwordData;