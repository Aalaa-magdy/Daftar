import { colors } from '@/theme/colors';
import { useAppDirection } from '@/hooks/useAppDirection';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { TrendPoint } from '../types/statistics.types';

interface Props {
  title: string;
  subtitle: string;
  maxValue: number;
  data: TrendPoint[];
  tooltipPeriodLabel?: string;
  currency?: string;
  isWeeklyChart?: boolean;
  isMonthlyChart?: boolean;
  isYearlyChart?: boolean;
}

const CHART_HEIGHT = 200;
const X_LABEL_HEIGHT = 32;

function buildTicks(maxValue: number): number[] {
  const step =
    maxValue <= 8000
      ? 1000
      : maxValue <= 12000
        ? 2000
        : maxValue <= 50000
          ? 10000
          : 20000;
  const ticks: number[] = [];

  for (let value = maxValue; value >= 0; value -= step) {
    ticks.push(value);
  }

  return ticks;
}

function formatTick(value: number): string {
  if (value >= 1000) {
    return `${value / 1000}k`;
  }

  return String(value);
}

const TrendBarChart = ({
  title,
  subtitle,
  maxValue,
  data,
  tooltipPeriodLabel,
  currency = 'EGP',
  isWeeklyChart = false,
  isMonthlyChart = false,
  isYearlyChart = false,
}: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();
  const ticks = buildTicks(maxValue);
  const showTooltip = Boolean(tooltipPeriodLabel && (isWeeklyChart || isYearlyChart));

  const renderBarColumn = (point: TrendPoint, index: number) => {
    const columnKey = `${point.label ?? 'point'}-${index}`;
    const columnStyle = [
      styles.barColumn,
      isWeeklyChart && styles.barColumnWeekly,
      isYearlyChart && styles.barColumnYearly,
      isMonthlyChart && styles.barColumnMonthly,
    ];
    const labelStyle = [
      styles.xLabel,
      isMonthlyChart && styles.xLabelMonthly,
      isRTL && styles.xLabelRtl,
    ];

    if (point.variant === 'placeholder') {
      return (
        <View key={columnKey} style={columnStyle}>
          <View style={styles.barArea}>
            <View style={styles.placeholderDot} />
          </View>
          <Text
            style={labelStyle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {point.label}
          </Text>
        </View>
      );
    }

    const barHeight = Math.max(6, (point.value / maxValue) * CHART_HEIGHT);
    const barColor =
      point.variant === 'active' ? colors.primary : colors.light;

    return (
      <View key={columnKey} style={columnStyle}>
        <View style={styles.barArea}>
          {showTooltip && point.variant === 'active' ? (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipPeriod}>{tooltipPeriodLabel}</Text>
              <Text style={styles.tooltipAmount}>
                {t('statistics.trendAmount', {
                  amount: point.value.toLocaleString('en-US'),
                  currency,
                })}
              </Text>
            </View>
          ) : null}
          <View
            style={[
              styles.bar,
              isWeeklyChart && styles.barWeekly,
              isYearlyChart && styles.barYearly,
              isMonthlyChart && styles.barMonthly,
              {
                height: barHeight,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
        <Text
          style={labelStyle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {point.label}
        </Text>
      </View>
    );
  };

  const barsRow = (
    <View
      style={[
        styles.barsRow,
        isWeeklyChart && styles.barsRowWeekly,
        isYearlyChart && styles.barsRowYearly,
        isMonthlyChart && styles.barsRowMonthly,
      ]}
    >
      {data.map((point, index) => renderBarColumn(point, index))}
    </View>
  );

  const plotContent = (
    <View style={styles.plotArea}>
      {ticks.map((tick) => (
        <View
          key={`grid-${tick}`}
          style={[
            styles.gridLine,
            { bottom: `${(tick / maxValue) * 100}%` },
          ]}
        />
      ))}
      {barsRow}
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={[styles.chartWrap, { direction: 'ltr' }]}>
        <View style={styles.yAxis}>
          {ticks.map((tick) => (
            <Text key={tick} style={styles.yLabel}>
              {formatTick(tick)}
            </Text>
          ))}
        </View>

        <View style={styles.plotAreaFlex}>{plotContent}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
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
  chartWrap: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    minHeight: CHART_HEIGHT + X_LABEL_HEIGHT,
  },
  yAxis: {
    width: 32,
    height: CHART_HEIGHT + X_LABEL_HEIGHT,
    justifyContent: 'space-between',
    paddingBottom: X_LABEL_HEIGHT,
  },
  yLabel: {
    fontFamily: 'Changa_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  plotAreaFlex: {
    flex: 1,
  },
  plotArea: {
    height: CHART_HEIGHT + X_LABEL_HEIGHT,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  barsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: X_LABEL_HEIGHT,
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  barsRowWeekly: {
    justifyContent: 'flex-start',
    gap: 18,
  },
  barsRowYearly: {
    justifyContent: 'flex-start',
    gap: 24,
  },
  barsRowMonthly: {
    gap: 0,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  barColumnWeekly: {
    flex: 0,
    width: 36,
  },
  barColumnYearly: {
    flex: 0,
    width: 48,
  },
  barColumnMonthly: {
    flex: 1,
    minWidth: 0,
  },
  barArea: {
    height: CHART_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    minWidth: 140,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    gap: 2,
    zIndex: 2,
  },
  tooltipPeriod: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tooltipAmount: {
    fontFamily: 'Changa_500Medium',
    fontSize: 13,
    lineHeight: 18,
    color: colors.black,
    textAlign: 'center',
  },
  bar: {
    width: '70%',
    minWidth: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  barWeekly: {
    width: 28,
    minWidth: 28,
  },
  barYearly: {
    width: 36,
    minWidth: 36,
  },
  barMonthly: {
    width: 10,
    minWidth: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  placeholderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.progressInactive,
    marginBottom: 2,
  },
  xLabel: {
    marginTop: 8,
    width: '100%',
    minHeight: 20,
    fontFamily: 'Changa_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  xLabelMonthly: {
    fontSize: 10,
    lineHeight: 14,
    minHeight: 18,
    paddingHorizontal: 0,
  },
  xLabelRtl: {
    writingDirection: 'rtl',
  },
});

export default TrendBarChart;
