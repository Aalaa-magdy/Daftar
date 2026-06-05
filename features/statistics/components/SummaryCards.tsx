import { colors } from '@/theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import { formatSummaryAmount } from '../lib/format-stat-amount';

interface Props {
  totalSpent: number;
  totalIncome: number;
}

const SummaryCards = ({ totalSpent, totalIncome }: Props) => (
  <View style={styles.row}>
    <View style={styles.card}>
      <Text style={styles.label}>TOTAL SPENT</Text>
      <Text style={styles.spent}>{formatSummaryAmount(totalSpent, 'spent')}</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.label}>TOTAL INCOME</Text>
      <Text style={styles.income}>{formatSummaryAmount(totalIncome, 'income')}</Text>
    </View>
  </View>
);

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
  income: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.green,
  },
});

export default SummaryCards;
