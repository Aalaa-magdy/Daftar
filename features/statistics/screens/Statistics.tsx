import { useRequireAuth } from '@/features/auth/hooks';
import { colors } from '@/theme/colors';
import { screenLayout } from '@/theme/screen-layout';
import {
    Changa_400Regular,
    Changa_500Medium,
    useFonts,
} from '@expo-google-fonts/changa';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryBreakdown from '../components/CategoryBreakdown';
import DailyCategoryReport from '../components/DailyCategoryReport';
import DailyOverviewCards from '../components/DailyOverviewCards';
import DateNavigator from '../components/DateNavigator';
import PeriodToggle from '../components/PeriodToggle';
import SummaryCards from '../components/SummaryCards';
import TrendBarChart from '../components/TrendBarChart';
import { useDailyReport } from '../hooks/useDailyReport';
import { useStatistics } from '../hooks/useStatistics';
import { formatTrendLabel } from '../lib/format-trend-label';
import { isCurrentOrFuturePeriod, shiftPeriodAnchor } from '../lib/period-range';
import type { StatisticsPeriod } from '../types/statistics.types';

const Statistics = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAuthChecking } = useRequireAuth();
  const [period, setPeriod] = useState<StatisticsPeriod>('month');
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const isDayPeriod = period === 'day';
  const { stats, isLoading: isStatsLoading } = useStatistics(period, anchorDate);
  const { report, isLoading: isDailyLoading } = useDailyReport(
    anchorDate,
    isDayPeriod,
  );
  const isLoading = isDayPeriod ? isDailyLoading : isStatsLoading;

  const dailyReportTitle = report.isToday
    ? t('statistics.todaysReport')
    : t('statistics.dayReport', {
        day: anchorDate.toLocaleDateString(
          i18n.language === 'ar' ? 'ar-EG' : 'en-US',
          { weekday: 'long' },
        ),
      });

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const trendData = useMemo(
    () =>
      stats.trend.map((point) => ({
        ...point,
        label: formatTrendLabel(point, t),
        tooltipTitle: point.tooltipTitle
          ? formatTrendLabel({ ...point, label: point.tooltipTitle }, t)
          : undefined,
      })),
    [stats.trend, t],
  );

  const handlePeriodChange = (nextPeriod: StatisticsPeriod) => {
    setPeriod(nextPeriod);
    setAnchorDate(new Date());
  };

  const isNextDisabled = isCurrentOrFuturePeriod(anchorDate, period);

  const handleNext = () => {
    if (isNextDisabled) return;
    setAnchorDate((current) => shiftPeriodAnchor(current, period, 1));
  };

  if (!fontsLoaded || isAuthChecking || !isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={screenLayout.header}>
        <Text style={screenLayout.title}>{t('statistics.title')}</Text>
      </View>

      <View style={styles.toggleWrap}>
        <PeriodToggle value={period} onChange={handlePeriodChange} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DateNavigator
          label={isDayPeriod ? report.dateLabel : stats.dateLabel}
          onPrevious={() =>
            setAnchorDate((current) => shiftPeriodAnchor(current, period, -1))
          }
          onNext={handleNext}
          isNextDisabled={isNextDisabled}
        />

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : isDayPeriod ? (
          <>
            <DailyOverviewCards
              totalSpent={report.totalSpent}
              topCategoryName={report.topCategoryName}
            />

            <DailyCategoryReport
              title={dailyReportTitle}
              expenseCount={report.expenseCount}
              categories={report.categories}
            />
          </>
        ) : (
          <>
            <SummaryCards
              totalSpent={stats.totalSpent}
              totalIncome={stats.totalIncome}
            />

            <CategoryBreakdown
              categories={stats.categories}
              totalSpent={stats.periodTotalSpent}
            />

            <TrendBarChart
              title={t(stats.titleKey)}
              subtitle={stats.trendSubtitle}
              maxValue={stats.trendMax}
              data={trendData}
              currency={t('common.egp')}
              isWeeklyChart={period === 'week'}
              isMonthlyChart={period === 'month'}
              isYearlyChart={period === 'year'}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  toggleWrap: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 96,
    gap: 16,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Statistics;
