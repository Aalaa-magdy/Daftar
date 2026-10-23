import { colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import { formatCompactAmount, formatCompactNumber } from '../lib/format-stat-amount';
import type { DailyStatisticsData } from '../types/statistics-response.types';

interface Props {
  title: string;
  data: DailyStatisticsData;
}

const DailyTransactions = ({ title, data }: Props) => {
  const { t } = useTranslation();
  const { transactions } = data;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.balanceText}>{t('statistics.openingBalance')}</Text>
          <Text style={styles.summaryValue}>
            {formatCompactNumber(data.openingBalance)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.balanceText}>{t('statistics.closingBalance')}</Text>
          <Text style={styles.summaryValue}>
            {formatCompactNumber(data.closingBalance)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.balanceText}>{t('statistics.netBalance')}</Text>
          <Text style={styles.summaryValue}>
            {formatCompactNumber(data.netBalance)}
          </Text>
        </View>
      </View>

      {transactions.length === 0 ? (
        <Text style={styles.emptyText}>{t('statistics.noExpensesToday')}</Text>
      ) : (
        <View style={styles.list}>
          {transactions.map((item, index) => {
            const isExpense = item.transactionType === 'expense';

            return (
              <View
                key={item._id}
                style={[
                  styles.row,
                  index < transactions.length - 1 && styles.rowBorder,
                ]}
              >
                <View
                  style={[
                    styles.colorMark,
                    {
                      backgroundColor:
                        item.categoryBackgroundColor ?? colors.backgroundColor,
                    },
                  ]}
                />

                <View style={styles.content}>
                  <View style={styles.topLine}>
                    <View style={styles.nameGroup}>
                      <Text style={styles.name}>
                        {item.categoryName ?? t('statistics.uncategorized')}
                      </Text>
                      <Text style={styles.meta}>{item.transactionType}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Text
                        style={[
                          styles.amount,
                          { color: isExpense ? colors.red : colors.green },
                        ]}
                      >
                        {formatCompactAmount(item.amount, t('common.egp'))}
                      </Text>
                      <Text style={styles.meta}>{item.percentage}%</Text>
                    </View>
                  </View>

                  <View style={styles.balanceLine}>
                    <View style={styles.balanceItem}>
                      <Text style={styles.balanceText}>
                        {t('statistics.balanceBefore')}:
                      </Text>
                      <Text style={[styles.balanceText, styles.balanceValue]}>
                        {formatCompactNumber(item.balanceBefore)}
                      </Text>
                    </View>
                    <View style={styles.balanceItem}>
                      <Text style={styles.balanceText}>
                        {t('statistics.balanceAfter')}:
                      </Text>
                      <Text style={[styles.balanceText, styles.balanceValue]}>
                        {formatCompactNumber(item.balanceAfter)}
                      </Text>
                    </View>
                  </View>
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
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 8,
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryValue: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: colors.black,
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
  colorMark: {
    width: 8,
    height: 36,
    borderRadius: 4,
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
  nameGroup: {
    flex: 1,
    gap: 2,
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
    fontFamily: 'Changa_400Regular',
    fontSize: 13,
    lineHeight: 18,
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

export default DailyTransactions;
