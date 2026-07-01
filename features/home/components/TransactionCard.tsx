import { editTransactionHref } from '@/features/transaction/lib/transaction-links';
import type { TransactionKind } from '@/features/transaction/types';
import { colors } from '@/theme/colors';
import {
    Changa_400Regular,
    Changa_500Medium,
    useFonts,
} from '@expo-google-fonts/changa';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import RepeatIcon from '@hugeicons/core-free-icons/RepeatIcon';
import Time04Icon from '@hugeicons/core-free-icons/Time04Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

interface Props {
  id: string;
  type: TransactionKind;
  title?: string;
  amount?: number;
  time?: string;
  note?: string;
  repeat?: string;
  categoryIcon?: IconSvgElement;
  categoryIconColor?: string;
  iconBackgroundColor?: string;
  dateLabel?: string;
  showDateHeader?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

function formatAmount(value: number, type: TransactionKind, currency: string) {
  const formatted = value.toLocaleString('en-US');
  return `${type === 'income' ? '+' : '-'}${formatted} ${currency}`;
}

function formatExpenseNote(note: string) {
  const trimmed = note.trim();
  if (trimmed.length <= 25) {
    return trimmed;
  }
  return `${trimmed.slice(0, 25)}...`;
}

export const TransactionDateHeader = ({
  dateLabel,
  style,
}: {
  dateLabel: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.dateHeader, style]}>
    <HugeiconsIcon icon={Calendar03Icon} size={20} color={colors.textSecondary} />
    <Text style={styles.date}>{dateLabel}</Text>
  </View>
);

const TransactionCard = ({
  id,
  type,
  title,
  amount = type === 'income' ? 3000 : 4000,
  time,
  note,
  repeat,
  categoryIcon = Calendar03Icon,
  categoryIconColor = '#9176F9',
  iconBackgroundColor = '#ede9fa',
  dateLabel = '01 June 2025',
  showDateHeader = true,
  containerStyle,
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const isIncome = type === 'income';
  const displayTitle = title ?? t('home.defaultTransactionTitle');
  const displayRepeat = repeat ?? t('home.defaultRepeat');
  const expenseNote = note?.trim() || undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {showDateHeader ? <TransactionDateHeader dateLabel={dateLabel} /> : null}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push(editTransactionHref(id, type))}
      >
        <View style={styles.card}>
          {!isIncome && categoryIcon ? (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: iconBackgroundColor, borderColor: iconBackgroundColor },
              ]}
            >
              <HugeiconsIcon
                icon={categoryIcon}
                size={24}
                color={categoryIconColor}
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
                {displayTitle}
              </Text>
              <Text
                style={[
                  styles.money,
                  isIncome ? styles.incomeMoney : styles.expenseMoney,
                ]}
              >
                {formatAmount(amount, type, t('common.egp'))}
              </Text>
            </View>
            <View style={styles.section}>
              <View style={styles.metaRow}>
                <HugeiconsIcon
                  icon={Time04Icon}
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaText}>{time}</Text>
              </View>
              {!isIncome && expenseNote ? (
                <View style={styles.noteWrap}>
                  <Text
                    style={styles.expenseCategory}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatExpenseNote(expenseNote)}
                  </Text>
                </View>
              ) : null}
              {isIncome && repeat ? (
                <View style={[styles.metaRow, styles.metaRowSpaced]}>
                  <HugeiconsIcon
                    icon={RepeatIcon}
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.metaText}>{displayRepeat}</Text>
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
  dateHeader: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  date: {
    color: colors.textSecondary,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
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
    overflow: 'hidden',
  },
  iconWrapper: {
    padding: 8,
    borderWidth: 2,
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
    minWidth: 0,
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
    alignItems: 'center',
    padding: 2,
    gap: 8,
    minWidth: 0,
  },
  noteWrap: {
    flex: 1,
    minWidth: 0,
  },
  expenseCategory: {
    fontFamily: 'Changa_400Regular',
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flexShrink: 0,
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
