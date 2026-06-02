import { editTransactionHref } from '@/features/transaction/lib/transaction-links';
import type { TransactionKind } from '@/features/transaction/types';
import { colors } from '@/theme/colors';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import Time04Icon from '@hugeicons/core-free-icons/Time04Icon';
import RepeatIcon from '@hugeicons/core-free-icons/RepeatIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  id: string;
  type: TransactionKind;
}

const TransactionCard = ({ id, type }: Props) => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const isIncome = type === 'income';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={20}
            color={colors.textSecondary}
          />
        </View>
        <Text style={styles.date}>01 June 2025</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(editTransactionHref(id, type))}
      >
        <View style={styles.card}>
          {!isIncome ? (
            <View style={styles.iconWrapper}>
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={24}
                color="#9176F9"
              />
            </View>
          ) : null}
          <View style={styles.info}>
            <View style={styles.firstRow}>
              <Text
                style={[
                  styles.title,
                  isIncome ? styles.incomeTitle : styles.expenseTitle,
                ]}
              >
                Shopping
              </Text>
              {isIncome ? (
                <Text style={[styles.money, styles.incomeMoney]}>+3000 EGP</Text>
              ) : (
                <Text style={[styles.money, styles.expenseMoney]}>-4000 EGP</Text>
              )}
            </View>
            <View style={styles.section}>
         
              <View style={styles.metaRow}>
                <HugeiconsIcon
                  icon={Time04Icon}
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaText}>4:45</Text>
              </View>
                   {!isIncome ? (
                <Text style={styles.expenseCategory}>React Native Course</Text>
              ) : null}
              {isIncome ? (
                <View style={[styles.metaRow, styles.metaRowSpaced]}>
                  <HugeiconsIcon
                    icon={RepeatIcon}
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.metaText}>Monthly</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 12,
  },
  content: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  date: {
    color: colors.textSecondary,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginRight: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 6,
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 8,
    backgroundColor: '#ede9fa',
    borderWidth: 2,
    borderColor: '#ede9fa',
    borderRadius: 8,
    marginTop: 2,
  },
  title: {
    fontFamily: 'Changa_500Medium',
  },
  expenseTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  incomeTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 5,
  },
  info: {
    flex: 1,
  },
  firstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  money: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  expenseMoney: {
    color: colors.red,
  },
  incomeMoney: {
    color: colors.green,
  },
  section: {
    flexDirection: 'row',
    padding: 2,
  },
  expenseCategory: {
    fontFamily: 'Changa_400Regular',
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginRight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  metaRowSpaced: {
    marginTop: 3,
  },
  metaText: {
    color: colors.textSecondary,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginRight: 10,
  },
});

export default TransactionCard;
