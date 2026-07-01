import TransactionCard, {
  TransactionDateHeader,
} from '@/features/home/components/TransactionCard';
import TransactionTypeToggle, {
  type TransactionFilter,
} from '@/features/transaction/components/TransactionTypeToggle';
import { colors } from '@/theme/colors';
import { screenLayout } from '@/theme/screen-layout';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import FilterIcon from '@hugeicons/core-free-icons/FilterIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useMemo, useState } from 'react';
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
import HistoryFilterDialogue from '../components/HistoryFilterDialogue';
import { groupTransactionsByDate } from '../lib/group-transactions';
import { DEFAULT_HISTORY_FILTER } from '../types/history-filter';
import { useRequireAuth } from '@/features/auth/hooks';
import { useTransactionHistoryList } from '@/features/transactions/hooks';

const History = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isAuthChecking } = useRequireAuth();

  const [typeFilter, setTypeFilter] = useState<TransactionFilter>('all');
  const [historyFilter, setHistoryFilter] = useState(DEFAULT_HISTORY_FILTER);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);

  const { items, isLoading, isEmpty, isError, hasActiveFilters, refetch } =
    useTransactionHistoryList({
      typeFilter,
      historyFilter,
    });

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const groups = useMemo(
    () => groupTransactionsByDate(items),
    [items],
  );

  if (!fontsLoaded || isAuthChecking || !isAuthenticated) {
    return null;
  }

  const showFilteredEmpty = !isLoading && isEmpty && hasActiveFilters;
  const showEmpty = !isLoading && isEmpty && !hasActiveFilters;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={screenLayout.header}>
        <Text style={screenLayout.title}>{t('history.title')}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('history.filterTransactions')}
          onPress={() => setFilterDialogVisible(true)}
        >
          <HugeiconsIcon icon={FilterIcon} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleWrap}>
        <TransactionTypeToggle
          value={typeFilter}
          onChange={setTypeFilter}
          includeAll
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('history.transactionsLoadError')}</Text>
            <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7}>
              <Text style={styles.retryText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : showEmpty ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('history.noTransactions')}</Text>
          </View>
        ) : showFilteredEmpty ? (
          <View style={styles.stateWrap}>
            <Text style={styles.emptyText}>{t('history.noFilteredResults')}</Text>
          </View>
        ) : (
          groups.map((group, index) => (
            <View key={group.dateKey} style={styles.group}>
              <TransactionDateHeader
                dateLabel={group.dateLabel}
                style={[
                  styles.dateHeader,
                  index > 0 ? styles.dateHeaderSpaced : undefined,
                ]}
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

      <HistoryFilterDialogue
        visible={filterDialogVisible}
        value={historyFilter}
        onClose={() => setFilterDialogVisible(false)}
        onSave={setHistoryFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterButton: {
    padding: 4,
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
    paddingBottom: 96,
  },
  group: {
    width: '100%',
    paddingHorizontal: 10,
  },
  dateHeader: {
    marginTop: 6,
    marginBottom: 8,
  },
  dateHeaderSpaced: {
    marginTop: 12,
  },
  transactionCard: {
    width: '95%',
    paddingHorizontal: 0,
  },
  stateWrap: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    marginTop: 8,
  },
});

export default History;
