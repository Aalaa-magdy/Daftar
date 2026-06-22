import { colors } from '@/theme/colors';
import { formatBalanceAmount } from '@/features/transactions/lib/format-balance-amount';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import RepeatIcon from '@hugeicons/core-free-icons/RepeatIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RecurringIncomeListItem } from '../types/recurring-transaction.types';

type Props = {
  item: RecurringIncomeListItem;
  onEdit?: () => void;
};

const RecurringIncomeCard = ({ item, onEdit }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.amount}>
          {formatBalanceAmount(item.amount)} {t('common.egp')}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.scheduleRow}>
          <HugeiconsIcon icon={RepeatIcon} size={18} color={colors.textSecondary} />
          <Text style={styles.schedule}>{item.scheduleLabel}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t('transaction.edit')}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.black,
  },
  amount: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  scheduleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  schedule: {
    flex: 1,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  editButton: {
    padding: 4,
  },
});

export default RecurringIncomeCard;
