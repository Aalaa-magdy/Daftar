import { colors } from '@/theme/colors';
import { useDirectionalIcons } from '@/hooks/useDirectionalIcons';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

interface Props {
  title: string;
  onBack: () => void;
  onDelete?: () => void;
}

const TransactionHeader = ({ title, onBack, onDelete }: Props) => {
  const { t } = useTranslation();
  const { backIcon } = useDirectionalIcons();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel={t('common.goBack')}
      >
        <HugeiconsIcon icon={backIcon} size={32} color={colors.textGray} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {onDelete ? (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('transaction.deleteTransaction')}
        >
          <HugeiconsIcon icon={Delete02Icon} size={24} color={colors.red} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    flexDirection: 'row',
    gap:12,
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontFamily: 'Changa_500Medium',
    fontSize: 20,
    lineHeight: 28,
    color: colors.black,
  },
  spacer: {
    width: 24,
  },
});

export default TransactionHeader;
