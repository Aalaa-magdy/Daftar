import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/theme/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { CategoryStat } from '../types/statistics.types';
import { formatCompactAmount, formatPercentage } from '../lib/format-stat-amount';

interface Props {
  categories: CategoryStat[];
  totalSpent: number;
}

const CategoryBreakdown = ({ categories, totalSpent }: Props) => {
  const { t } = useTranslation();
  const categoryCount = categories.length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('statistics.byCategory')}</Text>
      <Text style={styles.subtitle}>
        {t('statistics.categoriesSummary', {
          count: categoryCount,
          amount: totalSpent.toLocaleString('en-US'),
        })}
      </Text>

      {categories.length === 0 ? (
        <Text style={styles.emptyText}>{t('statistics.noCategoryData')}</Text>
      ) : (
        <View style={styles.list}>
          {categories.map((item, index) => {
            const color = item.color ?? colors.textSecondary;
            const iconBackground = `${color}1A`;

            return (
              <View
                key={item.categoryId}
                style={[styles.row, index < categories.length - 1 && styles.rowBorder]}
              >
                <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
                  {item.icon ? (
                    <HugeiconsIcon icon={item.icon} size={18} color={color} />
                  ) : null}
                </View>

                <View style={styles.content}>
                  <View style={styles.topLine}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>
                      {formatCompactAmount(item.amount, t('common.egp'))}{' '}
                      {formatPercentage(item.percentage)}
                    </Text>
                  </View>
                  <ProgressBar progress={item.percentage / 100} />
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
    alignItems: 'center',
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
  meta: {
    fontFamily: 'Changa_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});

export default CategoryBreakdown;
