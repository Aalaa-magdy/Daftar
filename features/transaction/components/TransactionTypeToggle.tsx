import { colors } from '@/theme/colors';
import type { TransactionKind } from '../types';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

export type TransactionFilter = TransactionKind | 'all';

type BaseProps = {
  includeAll?: false;
  value: TransactionKind;
  onChange: (value: TransactionKind) => void;
};

type FilterProps = {
  includeAll: true;
  value: TransactionFilter;
  onChange: (value: TransactionFilter) => void;
};

type Props = BaseProps | FilterProps;

const TransactionTypeToggle = (props: Props) => {
  const { t } = useTranslation();
  const includeAll = props.includeAll === true;

  return (
    <View style={styles.track}>
      {includeAll ? (
        <TouchableOpacity
          style={[styles.tab, props.value === 'all' && styles.tabActive]}
          onPress={() => props.onChange('all')}
          activeOpacity={0.85}
        >
          <Text
            style={[styles.tabText, props.value === 'all' && styles.tabTextActive]}
          >
            {t('common.all')}
          </Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        style={[styles.tab, props.value === 'expense' && styles.tabActive]}
        onPress={() => props.onChange('expense')}
        activeOpacity={0.85}
      >
        <Text
          style={[styles.tabText, props.value === 'expense' && styles.tabTextActive]}
        >
          {t('common.expense')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, props.value === 'income' && styles.tabActive]}
        onPress={() => props.onChange('income')}
        activeOpacity={0.85}
      >
        <Text
          style={[styles.tabText, props.value === 'income' && styles.tabTextActive]}
        >
          {t('common.income')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
});

export default TransactionTypeToggle;
