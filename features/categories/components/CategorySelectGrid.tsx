import CategoryChip from '@/features/categories/components/CategoryChip';
import { useCategories } from '@/features/categories/hooks';
import { colors } from '@/theme/colors';
import { getApiErrorMessage } from '@/lib/api-error';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  selectedIds: string[];
  onToggle: (categoryId: string) => void;
}

const CategorySelectGrid = ({ selectedIds, onToggle }: Props) => {
  const { t } = useTranslation();
  const {
    data: categories = [],
    isLoading,
    isError,
    isAuthRequired,
    error,
    refetch,
  } = useCategories();

  const loadErrorMessage = useMemo(() => {
    if (isAuthRequired || error?.response?.status === 401) {
      return t('transaction.signInForCategoryList');
    }

    if (error) {
      return getApiErrorMessage(error, t('transaction.categoryListFailed'));
    }

    return t('transaction.categoryListFailed');
  }, [error, isAuthRequired, t]);

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <TouchableOpacity
        style={styles.errorWrap}
        onPress={() => {
          if (!isAuthRequired) refetch();
        }}
        disabled={isAuthRequired}
      >
        <Text style={styles.errorText}>{loadErrorMessage}</Text>
        {!isAuthRequired ? (
          <Text style={styles.errorHint}>{t('transaction.tapRetryCategoryList')}</Text>
        ) : null}
      </TouchableOpacity>
    );
  }

  if (categories.length === 0) {
    return (
      <Text style={styles.emptyText}>{t('history.noCategories')}</Text>
    );
  }

  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          category={category}
          isSelected={selectedIds.includes(category.id)}
          onPress={() => onToggle(category.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loadingWrap: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWrap: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 4,
  },
  errorText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.red,
    textAlign: 'center',
    flexShrink: 1,
  },
  errorHint: {
    fontFamily: 'Changa_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.captionMuted,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CategorySelectGrid;
