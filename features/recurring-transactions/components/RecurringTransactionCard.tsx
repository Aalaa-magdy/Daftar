import { colors } from '@/theme/colors';
import { formatBalanceAmount } from '@/features/transactions/lib/format-balance-amount';
import ProgressBar from '@/components/ui/ProgressBar';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import RepeatIcon from '@hugeicons/core-free-icons/RepeatIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/AppText';
import type { RecurringTransactionListItem } from '../types/recurring-transaction.types';

type Props = {
  item: RecurringTransactionListItem;
  onEdit?: () => void;
};

const EXPENSE_COLOR = '#DC5444';




const RecurringTransactionCard = ({ item, onEdit }: Props) => {
  const { t } = useTranslation();
  console.log('RecurringTransactionCard item:', item); // Debugging log
  const isExpense = item.type === 'expense';
  const hasProgress =
    item.repeatMonths != null &&
    item.repeatMonths > 0 &&
    item.generatedCount != null;

  const progress = hasProgress
    ? Math.min(Math.max(item.generatedCount! / item.repeatMonths!, 0), 1)
    : 0;

  const footerLabel = [item.categoryName, item.scheduleLabel]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.card}>
      {/* Row 1: name + amount */}
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.amount,
            { color: isExpense ? EXPENSE_COLOR : colors.primary },
          ]}
        >
          {isExpense ? '-' : '+'}
          {formatBalanceAmount(item.amount)} {t('common.egp')}
        </Text>
      </View>

      {/* Row 2: payment count + next run date */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {hasProgress
            ? t('recurring.paymentProgress', {
                current: item.generatedCount,
                total: item.repeatMonths,
                defaultValue: 'Payment {{current}} of {{total}}',
              })
            : ''}
        </Text>
      
      </View>

      {/* Progress bar */}
      {hasProgress ? <ProgressBar progress={progress} /> : null}

      {/* Row 3: category · schedule + edit */}
      <View style={styles.bottomRow}>
        <View style={styles.scheduleRow}>
          <HugeiconsIcon
            icon={RepeatIcon}
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.schedule} numberOfLines={1}>
            {footerLabel}
          </Text>
        </View>

        {onEdit ? (
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.7}
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={t('transaction.edit')}
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
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
    paddingVertical: 16,
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
    fontSize: 20,
    lineHeight: 26,
    color: colors.black,
  },
  amount: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
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

export default RecurringTransactionCard;