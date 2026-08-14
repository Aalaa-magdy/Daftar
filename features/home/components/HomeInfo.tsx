import ProgressBar from '@/components/ui/ProgressBar';
import {
  formatBalanceAmount,
  getDaysRemainingInMonth,
  getExpenseProgress,
} from '@/features/transactions/lib/format-balance-amount';
import { useBalanceSummary } from '@/features/transactions/hooks';
import { useAppDirection } from '@/hooks/useAppDirection';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { colors } from '@/theme/colors';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  type LayoutChangeEvent,
} from 'react-native';
import ViewIcon from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import ArrowUpLeft01Icon from '@hugeicons/core-free-icons/ArrowUpLeft01Icon';
import ArrowDownRight01Icon from '@hugeicons/core-free-icons/ArrowDownRight01Icon';
import Note05Icon from '@hugeicons/core-free-icons/Note05Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MASK = '******';
const CARD_RADIUS = 12;
const CARD_PADDING = 16;

const homeCardBackground = require('@/assets/images/home.png');
const homeCardBackgroundAr = require('@/assets/images/home_ar.png');

const HomeInfo = () => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();
  const { homeInfo } = useResponsiveLayout();
  const [amountsVisible, setAmountsVisible] = useState(true);
  const { data, isLoading } = useBalanceSummary();
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const onCardLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCardSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  };
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const summary = useMemo(
    () => ({
      totalBalance: data?.totalBalance ?? 0,
      totalIncome: data?.totalIncome ?? 0,
      totalExpense: data?.totalExpense ?? 0,
    }),
    [data],
  );

  if (!fontsLoaded) {
    return null;
  }

  const egp = t('common.egp');
  const balanceDisplay = amountsVisible
    ? formatBalanceAmount(summary.totalBalance)
    : MASK;
  const incomeDisplay = amountsVisible
    ? `${formatBalanceAmount(summary.totalIncome)} ${egp}`
    : `${MASK} ${egp}`;
  const expenseDisplay = amountsVisible
    ? `${formatBalanceAmount(summary.totalExpense)} ${egp}`
    : `${MASK} ${egp}`;
  const spentAmountDisplay = amountsVisible
    ? formatBalanceAmount(summary.totalExpense)
    : MASK;
  const daysRemaining = getDaysRemainingInMonth();
  const progress = getExpenseProgress(summary.totalExpense, summary.totalIncome);

  return (

    <View style={styles.container} onLayout={onCardLayout}>
      {cardSize.width > 0 && cardSize.height > 0 && (
        <Image
          source={isRTL ? homeCardBackgroundAr : homeCardBackground}
          resizeMode="cover"
          style={[
            styles.backgroundImage,
            { width: cardSize.width, height: cardSize.height },
          ]}
        />
      )}
      <View style={styles.content}>
        <View style={styles.firstRow}>
          <Text style={styles.currentBalance}>{t('home.totalBalance')}</Text>
          <TouchableOpacity
            onPress={() => setAmountsVisible((visible) => !visible)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={
              amountsVisible ? t('home.hideAmounts') : t('home.showAmounts')
            }
          >
            <HugeiconsIcon
              icon={amountsVisible ? ViewIcon : ViewOffIcon}
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.secondRow,
            { minHeight: homeInfo.secondRowMinHeight },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} style={styles.loader} />
          ) : (
            <View style={styles.balanceRow}>
              <Text
                style={[
                  styles.balance,
                  {
                    fontSize: homeInfo.balanceFontSize,
                    lineHeight: homeInfo.balanceLineHeight,
                  },
                ]}
              >
                {balanceDisplay}
              </Text>
              <Text style={styles.currency}>{egp}</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.thirdRow,
            {
              gap: homeInfo.thirdRowGap,
              marginBottom: homeInfo.thirdRowMarginBottom,
            },
          ]}
        >
          <View style={styles.item}>
            <View style={styles.icon}>
              <HugeiconsIcon
                icon={ArrowDownRight01Icon}
                size={20}
                color="#17B26A"
              />
            </View>
            <View>
              <Text style={styles.type}>{t('home.income')}</Text>
              <Text style={styles.amount}>{incomeDisplay}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={[styles.icon, styles.expenseIcon]}>
              <HugeiconsIcon icon={ArrowUpLeft01Icon} size={20} color="#F04438" />
            </View>
            <View>
              <Text style={styles.type}>{t('home.expense')}</Text>
              <Text style={styles.amount}>{expenseDisplay}</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.lastRow}>
            <View style={styles.spentRow}>
              <View style={styles.spentIcon}>
                <HugeiconsIcon icon={Note05Icon} size={14} color={colors.gold} />
              </View>
              <Text style={styles.spans}>
                {t('home.spentLabel')}{' '}
                <Text style={styles.goldText}>{spentAmountDisplay}</Text>
                {' '}
                <Text style={styles.goldText}>{egp}</Text>
              </Text>
            </View>
            <Text style={styles.spans}>
              {t('home.daysRemaining', { count: daysRemaining })}
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color={colors.gold}
            trackColor="#144718"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.primary,
    // Clips the image to the rounded corners. Required on Android.
    overflow: 'hidden',
  },
  // top/left only — width & height come from the onLayout measurement above,
  // as real numbers, so there's no percentage anywhere left to misresolve.
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: CARD_RADIUS,
  },
  // All spacing lives here, on a normal flow child that sits above the image.
  content: {
    padding: CARD_PADDING,
  },
  currentBalance: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Changa_400Regular',
    lineHeight: 20,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondRow: {
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 8,
  },
  loader: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  balance: {
    fontFamily: 'Changa_500Medium',
    color: colors.white,
  },
  currency: {
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.gold,
    marginBottom: 8,
  },
  icon: {
    backgroundColor: '#ECFDF3',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  expenseIcon: {
    backgroundColor: '#FEF3F2',
  },
  thirdRow: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  type: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Changa_400Regular',
    lineHeight: 20,
  },
  amount: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Changa_400Regular',
    lineHeight: 20,
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  spentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spentIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(201, 162, 39, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spans: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Changa_400Regular',
    lineHeight: 20,
  },
  goldText: {
    color: colors.gold,
    fontFamily: 'Changa_500Medium',
  },
});

export default HomeInfo;