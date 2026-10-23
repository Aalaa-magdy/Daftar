import { colors } from '@/theme/colors';
import { useDirectionalIcons } from '@/hooks/useDirectionalIcons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/AppText";

interface Props {
  label: string;
  icon: IconSvgElement;
  onPress?: () => void;
  showDivider?: boolean;
}

const ProfileMenuItem = ({ label, icon, onPress, showDivider = true }: Props) => {
  const { chevronIcon } = useDirectionalIcons();

  return (
    <TouchableOpacity
      style={[styles.row, showDivider && styles.rowDivider]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
    >
      <HugeiconsIcon icon={icon} size={22} color={colors.textSecondary} />
      <Text style={styles.label}>{label}</Text>
      <HugeiconsIcon icon={chevronIcon} size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 22,
    color: colors.black,
  },
});

export default ProfileMenuItem;
