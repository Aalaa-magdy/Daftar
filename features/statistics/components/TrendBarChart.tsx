import { colors } from '@/theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import type { TrendPoint } from '../data/mock-statistics';

interface Props {
  title: string;
  subtitle: string;
  maxValue: number;
  data: TrendPoint[];
}

const CHART_HEIGHT = 160;
const BAR_MAX_WIDTH = 28;

function buildTicks(maxValue: number): number[] {
  const step = maxValue <= 10000 ? 2000 : maxValue <= 50000 ? 10000 : 20000;
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

const TrendBarChart = ({ title, subtitle, maxValue, data }: Props) => {
  const ticks = buildTicks(maxValue);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.chartWrap}>
        <View style={styles.yAxis}>
          {ticks.map((tick) => (
            <Text key={tick} style={styles.yLabel}>
              {formatTick(tick)}
            </Text>
          ))}
        </View>

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

          <View style={styles.barsRow}>
            {data.map((point) => {
              if (point.variant === 'placeholder') {
                return (
                  <View key={point.label} style={styles.barColumn}>
                    <View style={styles.barArea}>
                      <View style={styles.placeholderDot} />
                    </View>
                    <Text style={styles.xLabel}>{point.label}</Text>
                  </View>
                );
              }

              const barHeight = Math.max(6, (point.value / maxValue) * CHART_HEIGHT);
              const barColor =
                point.variant === 'active' ? colors.primary : colors.light;

              return (
                <View key={point.label} style={styles.barColumn}>
                  <View style={styles.barArea}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                          maxWidth: BAR_MAX_WIDTH,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.xLabel}>{point.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
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
  chartWrap: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  yAxis: {
    width: 32,
    height: CHART_HEIGHT + 24,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  yLabel: {
    fontFamily: 'Changa_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  plotArea: {
    flex: 1,
    height: CHART_HEIGHT + 24,
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
    bottom: 24,
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  barArea: {
    height: CHART_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    minWidth: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    fontFamily: 'Changa_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default TrendBarChart;
