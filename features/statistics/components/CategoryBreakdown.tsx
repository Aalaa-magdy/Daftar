import ProgressBar from '@/components/ui/ProgressBar';
import { EXPENSE_CATEGORIES } from '@/features/transaction/data/form-options';
import { colors } from '@/theme/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, View } from 'react-native';
import type { CategoryStat } from '../data/mock-statistics';
import { formatCompactAmount, formatPercentage } from '../lib/format-stat-amount';

interface Props {
  categories: CategoryStat[];
  totalSpent: number;
}

const CategoryBreakdown = ({ categories, totalSpent }: Props) => {
  const categoryCount = categories.length;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>By Category</Text>
      <Text style={styles.subtitle}>
        {categoryCount} Categories · {totalSpent.toLocaleString('en-US')} EGP total
      </Text>

      <View style={styles.list}>
        {categories.map((item, index) => {
          const category = EXPENSE_CATEGORIES.find((entry) => entry.id === item.categoryId);
          const label = item.label ?? category?.label ?? item.categoryId;
          const icon = item.icon ?? category?.icon;
          const color = item.color ?? category?.color ?? colors.textSecondary;
          const iconBackground = `${color}1A`;

          return (
            <View
              key={`${item.categoryId}-${index}`}
              style={[styles.row, index < categories.length - 1 && styles.rowBorder]}
            >
              <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
                {icon ? (
                  <HugeiconsIcon icon={icon} size={18} color={color} />
                ) : null}
              </View>

              <View style={styles.content}>
                <View style={styles.topLine}>
                  <Text style={styles.name}>{label}</Text>
                  <Text style={styles.meta}>
                    {formatCompactAmount(item.amount)}{' '}
                    {formatPercentage(item.percentage)}
                  </Text>
                </View>
                <ProgressBar progress={item.percentage / 100} />
              </View>
            </View>
          );
        })}
      </View>
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
