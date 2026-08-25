import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/theme/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import {
  formatCompactAmount,
  formatCompactNumber,
  formatPercentage,
} from '../lib/format-stat-amount';
import type { DailyCategoryStat } from '../types/daily-report.types';

interface Props {
  title: string;
  expenseCount: number;
  categories: DailyCategoryStat[];
}

const DailyCategoryReport = ({ title, expenseCount, categories }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        {t('statistics.expensesCount', { count: expenseCount })}
      </Text>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>{t('statistics.noExpensesToday')}</Text>
      ) : (
        <View style={styles.list}>
          {categories.map((item, index) => {
            const color = item.color ?? colors.textSecondary;
            const iconBackground = `${color}1A`;
            const showBalance =
              item.balanceBefore != null && item.balanceAfter != null;

            return (
              <View
                key={item.categoryId}
                style={[
                  styles.row,
                  index < categories.length - 1 && styles.rowBorder,
                ]}
              >
                <View
                  style={[styles.iconWrap, { backgroundColor: iconBackground }]}
                >
                  {item.icon ? (
                    <HugeiconsIcon icon={item.icon} size={18} color={color} />
                  ) : null}
                </View>

                <View style={styles.content}>
                  <View style={styles.topLine}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.meta, styles.amount]}>
                        {formatCompactAmount(item.amount, t('common.egp'))}
                      </Text>
                      <Text style={styles.meta}>
                        {formatPercentage(item.percentage)}
                      </Text>
                    </View>
                  </View>

                  <ProgressBar progress={item.percentage / 100} color={color} />

                  {showBalance ? (
                    <View style={styles.balanceLine}>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceText}>
                          {t('statistics.balanceBefore')}:
                        </Text>
                        <Text style={[styles.balanceText, styles.balanceValue]}>
                          {formatCompactNumber(item.balanceBefore as number)}
                        </Text>
                      </View>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceText}>
                          {t('statistics.balanceAfter')}:
                        </Text>
                        <Text style={[styles.balanceText, styles.balanceValue]}>
                          {formatCompactNumber(item.balanceAfter as number)}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  subtitle: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: -4,
  },
  emptyText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontFamily: 'Changa_500Medium',
    fontSize: 15,
    lineHeight: 20,
    color: colors.black,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontFamily: 'Changa_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  amount: {
    color: colors.red,
    // Keep "1k EGP"/"1k ج.م" reading in that fixed internal order —
    // isolates it from the surrounding RTL paragraph's bidi reordering.
    writingDirection: 'ltr',
  },
  balanceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  balanceValue: {
    fontFamily: 'Changa_500Medium',
    color: colors.green,
  },
});

export default DailyCategoryReport;
