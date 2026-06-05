import { colors } from '@/theme/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { StatisticsPeriod } from '../data/mock-statistics';

interface Props {
  value: StatisticsPeriod;
  onChange: (value: StatisticsPeriod) => void;
}

const OPTIONS: { id: StatisticsPeriod; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

const PeriodToggle = ({ value, onChange }: Props) => (
  <View style={styles.track}>
    {OPTIONS.map((option) => {
      const isActive = value === option.id;

      return (
        <TouchableOpacity
          key={option.id}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onChange(option.id)}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
});

export default PeriodToggle;
