import { colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  totalSpent: number;
  topCategoryName: string | null;
}

const DailyOverviewCards = ({ totalSpent, topCategoryName }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.label}>{t('statistics.totalSpent')}</Text>
        <Text style={styles.spent}>
          -{totalSpent.toLocaleString('en-US')}{' '}
          <Text style={styles.currency}>{t('common.egp')}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t('statistics.topCategory')}</Text>
        <Text style={styles.topCategory} numberOfLines={1}>
          {topCategoryName ?? t('statistics.noCategoryData')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  label: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  spent: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.red,
  },
  currency: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  topCategory: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
});

export default DailyOverviewCards;
