import { colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { StatisticsPeriod } from '../types/statistics.types';

interface Props {
  value: StatisticsPeriod;
  onChange: (value: StatisticsPeriod) => void;
}

const OPTIONS: { id: StatisticsPeriod; labelKey: string }[] = [
  { id: 'week', labelKey: 'statistics.week' },
  { id: 'month', labelKey: 'statistics.month' },
  { id: 'year', labelKey: 'statistics.year' },
];

const PeriodToggle = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  return (
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
              {t(option.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

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
