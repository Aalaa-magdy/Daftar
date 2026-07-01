import ProgressBar from '@/components/ui/ProgressBar';
import {
  formatBalanceAmount,
  getDaysRemainingInMonth,
  getExpenseProgress,
} from '@/features/transactions/lib/format-balance-amount';
import { useBalanceSummary } from '@/features/transactions/hooks';
import { colors } from '@/theme/colors';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import ViewIcon from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import ArrowUpLeft01Icon from '@hugeicons/core-free-icons/ArrowUpLeft01Icon';
import ArrowDownRight01Icon from '@hugeicons/core-free-icons/ArrowDownRight01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MASK = '******';

const HomeInfo = () => {
  const { t } = useTranslation();
  const [amountsVisible, setAmountsVisible] = useState(true);
  const { data, isLoading } = useBalanceSummary();
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
  const spentDisplay = amountsVisible
    ? t('home.spent', { amount: formatBalanceAmount(summary.totalExpense) })
    : t('home.spent', { amount: MASK });
  const daysRemaining = getDaysRemainingInMonth();
  const progress = getExpenseProgress(summary.totalExpense, summary.totalIncome);

  return (
    <View style={styles.container}>
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
      <View style={styles.secondRow}>
        {isLoading ? (
          <ActivityIndicator color={colors.white} style={styles.loader} />
        ) : (
          <View style={styles.balanceRow}>
            <Text style={styles.balance}>{balanceDisplay}</Text>
            <Text style={styles.currency}>{egp}</Text>
          </View>
        )}
      </View>
      <View style={styles.thirdRow}>
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
            <HugeiconsIcon
              icon={ArrowUpLeft01Icon}
              size={20}
              color="#F04438"
            />
          </View>
          <View>
            <Text style={styles.type}>{t('home.expense')}</Text>
            <Text style={styles.amount}>{expenseDisplay}</Text>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.lastRow}>
          <Text style={styles.spans}>{spentDisplay}</Text>
          <Text style={styles.spans}>
            {t('home.daysRemaining', { count: daysRemaining })}
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          color={colors.secondary}
          trackColor="#144718"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
    height: 230,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
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
  },
  secondRow: {
    marginBottom: 20,
    minHeight: 52,
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
    fontSize: 36,
    fontFamily: 'Changa_500Medium',
    lineHeight: 52,
    color: colors.white,
  },
  currency: {
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.white,
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
    gap: 20,
    marginBottom: 22,
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
    paddingVertical: 2,
  },
  spans: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Changa_400Regular',
    lineHeight: 20,
  },
});

export default HomeInfo;
