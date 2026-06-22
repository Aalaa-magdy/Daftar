import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenLayout } from '@/theme/screen-layout';
import HomeHeader from '../components/HomeHeader';
import HomeInfo from '../components/HomeInfo';
import { colors } from '@/theme/colors';
import { addTransactionHref } from '@/features/transaction/lib/transaction-links';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import { PreferenceHorizontalIcon } from '@hugeicons/core-free-icons';
import TextLinkButton from '@/components/ui/TextLinkButton';
import TransactionCard, {
  TransactionDateHeader,
} from '../components/TransactionCard';
import Navbar from '../components/Navbar';
import { useNavbarNavigation } from '../hooks/useNavbarNavigation';
import { useRecentTransactions } from '@/features/transactions/hooks';
import { groupTransactionsByDate } from '@/features/history/lib/group-transactions';

const Home = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { onTabPress, onAddPress } = useNavbarNavigation('home');
  const { items, isLoading, isEmpty, isError, isGuest, refetch } =
    useRecentTransactions();

  useFocusEffect(
    useCallback(() => {
      if (!isGuest) {
        refetch();
      }
    }, [isGuest, refetch]),
  );

  const groups = useMemo(() => groupTransactionsByDate(items), [items]);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <HomeInfo />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.expenseButton]}
            activeOpacity={0.8}
            onPress={() => router.push(addTransactionHref('expense'))}
          >
            <HugeiconsIcon icon={Add01Icon} size={24} color={colors.primary} />
            <Text style={styles.buttonText}>{t('home.addExpense')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.incomeButton]}
            activeOpacity={0.8}
            onPress={() => router.push(addTransactionHref('income'))}
          >
            <HugeiconsIcon icon={Add01Icon} size={24} color={colors.primary} />
            <Text style={styles.buttonText}>{t('home.addIncome')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.manageIncomeButton}
          activeOpacity={0.8}
          onPress={() => router.push('/manage-income')}
        >
          <HugeiconsIcon
            icon={PreferenceHorizontalIcon}
            size={24}
            color={colors.primary}
          />
          <Text style={styles.buttonText}>{t('home.manageIncome')}</Text>
        </TouchableOpacity>

        <View style={styles.intro}>
          <Text style={styles.introText}>{t('home.history')}</Text>
          <View style={styles.viewAllButton}>
            <TextLinkButton
              title={t('home.viewAll')}
              variant="inline"
              onPress={() => router.push('/history')}
            />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : isGuest ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('home.signInForTransactions')}</Text>
          </View>
        ) : isError ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('home.transactionsLoadError')}</Text>
            <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7}>
              <Text style={styles.retryText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : isEmpty ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('home.noTransactions')}</Text>
          </View>
        ) : (
          groups.map((group, index) => (
            <View key={group.dateKey} style={styles.group}>
              <TransactionDateHeader
                dateLabel={group.dateLabel}
                style={index > 0 ? styles.dateHeaderSpaced : undefined}
              />
              {group.items.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  id={transaction.id}
                  type={transaction.type}
                  title={transaction.title}
                  amount={transaction.amount}
                  time={transaction.time}
                  note={transaction.note}
                  repeat={transaction.repeat}
                  categoryIcon={transaction.categoryIcon}
                  categoryIconColor={transaction.categoryIconColor}
                  iconBackgroundColor={transaction.iconBackgroundColor}
                  showDateHeader={false}
                  containerStyle={styles.transactionCard}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
      <Navbar
        activeTab="home"
        onTabPress={onTabPress}
        onAddPress={onAddPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  expenseButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  incomeButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
  },
  manageIncomeButton: {
    width: '90%',
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  intro: {
    width: '94%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  introText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  viewAllButton: {
    alignSelf: 'flex-end',
  },
  group: {
    width: '94%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  transactionCard: {
    width: '100%',
    paddingHorizontal: 0,
  },
  dateHeaderSpaced: {
    marginTop: 8,
  },
  stateWrap: {
    width: '94%',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    marginTop: 8,
  },
});

export default Home;
