import { colors } from '@/theme/colors';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import Tick01Icon from '@hugeicons/core-free-icons/Tick01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

const ProfileSuccessBanner = ({ visible, message, onDismiss }: Props) => {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <HugeiconsIcon icon={Tick01Icon} size={18} color={colors.green} />
      </View>

      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={t('common.dismiss')}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${colors.green}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.black,
  },
});

export default ProfileSuccessBanner;
