import { colors } from '@/theme/colors';
import { useAppDirection } from '@/hooks/useAppDirection';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TrendPoint } from '../types/statistics.types';

interface Props {
  title: string;
  subtitle: string;
  maxValue: number;
  data: TrendPoint[];
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

/** Align y-axis labels with grid lines inside the chart layer. */
function getYAxisLabelBottom(value: number, maxValue: number): number {
  const chartOffset = X_LABEL_HEIGHT;
  const scaled = (value / maxValue) * CHART_HEIGHT;
  return chartOffset + scaled - 7;
}

const TrendBarChart = ({
  title,
  subtitle,
  maxValue,
  data,
  currency = 'EGP',
  isWeeklyChart = false,
  isMonthlyChart = false,
  isYearlyChart = false,
}: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(
    null,
  );
  const ticks = buildTicks(maxValue);

  const getBarHeight = (value: number) =>
    Math.min(
      CHART_HEIGHT,
      Math.max(6, (value / maxValue) * CHART_HEIGHT),
    );

  const getScaleBottom = (value: number) =>
    (value / maxValue) * CHART_HEIGHT;

  const columnInteractionProps = (index: number) =>
    Platform.OS === 'web'
      ? {
          onHoverIn: () => setActiveTooltipIndex(index),
          onHoverOut: () => setActiveTooltipIndex(null),
        }
      : {
          onPress: () =>
            setActiveTooltipIndex((current) =>
              current === index ? null : index,
            ),
        };

  const renderTooltip = (point: TrendPoint, index: number) => {
    if (activeTooltipIndex !== index) {
      return null;
    }

    const titleText = point.tooltipTitle ?? point.label ?? '';

    const spentAmount = point.spent ?? point.value;
    const formattedSpent = spentAmount.toLocaleString('en-US');

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipTitle} numberOfLines={2}>
          {titleText}
        </Text>
        <Text style={styles.tooltipSpent}>
          {t('statistics.chartAmount', {
            amount: formattedSpent,
            currency,
          })}
        </Text>
        {point.income != null && point.income > 0 ? (
          <Text style={styles.tooltipIncome}>
            {t('home.income')}: {point.income.toLocaleString('en-US')} {currency}
          </Text>
        ) : null}
      </View>
    );
  };

  const columnStyle = [
    styles.barColumn,
    isWeeklyChart && styles.barColumnWeekly,
    isYearlyChart && styles.barColumnYearly,
    isMonthlyChart && styles.barColumnMonthly,
  ];

  const xLabelColumnStyle = [
    styles.xLabelColumn,
    isWeeklyChart && styles.barColumnWeekly,
    isYearlyChart && styles.barColumnYearly,
    isMonthlyChart && styles.barColumnMonthly,
  ];

  const labelStyle = [
    styles.xLabel,
    isMonthlyChart && styles.xLabelMonthly,
    isRTL && styles.xLabelRtl,
  ];

  const barsRowStyle = [
    styles.barsRow,
    isWeeklyChart && styles.barsRowWeekly,
    isYearlyChart && styles.barsRowYearly,
    isMonthlyChart && styles.barsRowMonthly,
  ];

  const xLabelsRowStyle = [
    styles.xLabelsRow,
    isWeeklyChart && styles.barsRowWeekly,
    isYearlyChart && styles.barsRowYearly,
    isMonthlyChart && styles.barsRowMonthly,
  ];

  const renderBar = (point: TrendPoint, index: number) => {
    const columnKey = `${point.label ?? 'point'}-${index}`;

    if (point.variant === 'placeholder') {
      return (
        <Pressable
          key={columnKey}
          style={columnStyle}
          {...columnInteractionProps(index)}
          accessibilityRole="button"
          accessibilityLabel={point.label}
        >
          <View style={styles.markerWrap}>
            {renderTooltip(point, index)}
            <View style={styles.placeholderDot} />
          </View>
        </Pressable>
      );
    }

    const barHeight = getBarHeight(point.value);
    const barColor =
      point.variant === 'active' ? colors.primary : colors.light;

    return (
      <Pressable
        key={columnKey}
        style={[
          columnStyle,
          activeTooltipIndex === index && styles.barColumnActive,
        ]}
        {...columnInteractionProps(index)}
        accessibilityRole="button"
        accessibilityLabel={point.label}
      >
        <View style={[styles.barWrap, { height: barHeight }]}>
          {renderTooltip(point, index)}
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
      </Pressable>
    );
  };

  const renderXLabel = (point: TrendPoint, index: number) => (
    <View
      key={`label-${point.label ?? 'point'}-${index}`}
      style={xLabelColumnStyle}
    >
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

  const plotContent = (
    <View style={styles.plotArea}>
      <View style={styles.chartLayer}>
        {ticks.map((tick) => (
          <View
            key={`grid-${tick}`}
            style={[styles.gridLine, { bottom: getScaleBottom(tick) }]}
          />
        ))}
        <View style={barsRowStyle}>{data.map(renderBar)}</View>
      </View>
      <View style={xLabelsRowStyle}>{data.map(renderXLabel)}</View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={[styles.chartWrap, { direction: 'ltr' }]}>
        <View style={styles.yAxis}>
          {ticks.map((tick) => (
            <Text
              key={tick}
              style={[
                styles.yLabel,
                { bottom: getYAxisLabelBottom(tick, maxValue) },
              ]}
            >
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
    overflow: 'visible',
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
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    right: 0,
    fontFamily: 'Changa_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  plotAreaFlex: {
    flex: 1,
    overflow: 'visible',
  },
  plotArea: {
    height: CHART_HEIGHT + X_LABEL_HEIGHT,
    overflow: 'visible',
  },
  chartLayer: {
    height: CHART_HEIGHT,
    position: 'relative',
    overflow: 'visible',
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
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  xLabelsRow: {
    height: X_LABEL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 8,
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 0,
    position: 'relative',
  },
  xLabelColumn: {
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
  barColumnActive: {
    zIndex: 20,
  },
  markerWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barWrap: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 6,
    alignSelf: 'center',
    minWidth: 150,
    maxWidth: 220,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'flex-start',
    gap: 4,
    zIndex: 100,
  },
  tooltipTitle: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: colors.black,
    textAlign: 'left',
  },
  tooltipSpent: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.red,
    textAlign: 'left',
  },
  tooltipIncome: {
    fontFamily: 'Changa_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: colors.green,
    textAlign: 'left',
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
    width: 14,
    minWidth: 14,
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
