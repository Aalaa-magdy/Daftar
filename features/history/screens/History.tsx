import TransactionCard, {
  TransactionDateHeader,
} from '@/features/home/components/TransactionCard';
import Navbar from '@/features/home/components/Navbar';
import { useNavbarNavigation } from '@/features/home/hooks/useNavbarNavigation';
import TransactionTypeToggle, {
  type TransactionFilter,
} from '@/features/transaction/components/TransactionTypeToggle';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import FilterIcon from '@hugeicons/core-free-icons/FilterIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HISTORY_TRANSACTIONS } from '../data/mock-transactions';
import { groupTransactionsByDate } from '../lib/group-transactions';

const History = () => {
  const { onTabPress, onAddPress } = useNavbarNavigation('history');
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return HISTORY_TRANSACTIONS;
    return HISTORY_TRANSACTIONS.filter((item) => item.type === filter);
  }, [filter]);

  const groups = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions],
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Filter transactions"
        >
          <HugeiconsIcon icon={FilterIcon} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleWrap}>
        <TransactionTypeToggle
          value={filter}
          onChange={setFilter}
          includeAll
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group, index) => (
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
              />
            ))}
          </View>
        ))}
      </ScrollView>

      <Navbar
        activeTab="history"
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
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 22,
    lineHeight: 28,
    color: colors.black,
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
    paddingHorizontal: 20,
  },
  dateHeader: {
    marginTop: 6,
    marginBottom: 8,
  },
  dateHeaderSpaced: {
    marginTop: 12,
  },
});

export default History;
