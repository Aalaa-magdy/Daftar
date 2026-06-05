import Navbar from '@/features/home/components/Navbar';
import { useNavbarNavigation } from '@/features/home/hooks/useNavbarNavigation';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBreakdown from '../components/CategoryBreakdown';
import DateNavigator from '../components/DateNavigator';
import PeriodToggle from '../components/PeriodToggle';
import SummaryCards from '../components/SummaryCards';
import TrendBarChart from '../components/TrendBarChart';
import {
  STATISTICS_BY_PERIOD,
  type StatisticsPeriod,
} from '../data/mock-statistics';

const Statistics = () => {
  const { onTabPress, onAddPress } = useNavbarNavigation('statistics');
  const [period, setPeriod] = useState<StatisticsPeriod>('month');
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const stats = useMemo(() => STATISTICS_BY_PERIOD[period], [period]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Statistics</Text>

        <PeriodToggle value={period} onChange={setPeriod} />

        <DateNavigator label={stats.dateLabel} />

        <SummaryCards
          totalSpent={stats.totalSpent}
          totalIncome={stats.totalIncome}
        />

        <CategoryBreakdown
          categories={stats.categories}
          totalSpent={stats.totalSpent}
        />

        <TrendBarChart
          title={stats.trendTitle}
          subtitle={stats.trendSubtitle}
          maxValue={stats.trendMax}
          data={stats.trend}
        />
      </ScrollView>

      <Navbar
        activeTab="statistics"
        onTabPress={onTabPress}
        onAddPress={onAddPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    marginTop: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96,
    gap: 16,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 28,
    color: colors.black,
    marginBottom: 8,
  },
});

export default Statistics;
