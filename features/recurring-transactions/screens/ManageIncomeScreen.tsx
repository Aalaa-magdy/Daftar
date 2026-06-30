import Button from '@/components/ui/Button';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import { addTransactionHref } from '@/features/transaction/lib/transaction-links';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
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
import RecurringIncomeCard from '../components/RecurringIncomeCard';
import { editRecurringIncomeHref } from '../lib/recurring-links';
import { useRequireAuth } from '@/features/auth/hooks';
import { useRecurringIncomeList } from '../hooks';

const ManageIncomeScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isAuthChecking } = useRequireAuth();
  const { items, isLoading, isEmpty, isError, refetch } =
    useRecurringIncomeList();

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (!fontsLoaded || isAuthChecking || !isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransactionHeader
          title={t('manageIncome.title')}
          onBack={() => router.back()}
        />

        {isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateText}>{t('manageIncome.loadError')}</Text>
            <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7}>
              <Text style={styles.retryText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : isEmpty ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateText}>{t('manageIncome.empty')}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <RecurringIncomeCard
                key={item.id}
                item={item}
                onEdit={() => router.push(editRecurringIncomeHref(item.id))}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('home.addIncome')}
          onPress={() => router.push(addTransactionHref('income'))}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  list: {
    gap: 12,
    paddingHorizontal: 2,
  },
  footer: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.backgroundColor,
  },
  stateWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stateText: {
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
  },
});

export default ManageIncomeScreen;
