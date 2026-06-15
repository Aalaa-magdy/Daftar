import { colors } from '@/theme/colors';
import {
  getCategorySelectedStyles,
  getCategoryUnselectedStyles,
} from '@/features/categories/lib/category-colors';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type {
  Category,
  CategoryDialogueMode,
} from '@/features/categories/types/categories.types';
import {
  useCategories,
  useDeleteCategory,
} from '@/features/categories/hooks';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getApiErrorMessage } from '@/lib/api-error';
import CategoryDeleteDialogue from './CategoryDeleteDialogue';
import CategoryDialogue from './CategoryDialogue';
import EditCategoriesDialogue from './EditCategoriesDialogue';

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryChip = ({ category, isSelected, onPress }: CategoryChipProps) => {
  const chipColors = isSelected
    ? getCategorySelectedStyles(category.color)
    : getCategoryUnselectedStyles();

  return (
    <TouchableOpacity
      style={[styles.chip, chipColors]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <HugeiconsIcon
        icon={resolveCategoryIcon(category.icon)}
        size={18}
        color={category.color}
      />
      <Text style={[styles.chipText, { color: category.color }]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const CategoryGrid = ({ selectedId, onSelect }: Props) => {
  const { t } = useTranslation();
  const {
    data: categories = [],
    isLoading,
    isError,
    isAuthRequired,
    error,
    refetch,
  } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [listVisible, setListVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<CategoryDialogueMode>('add');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openForm = (mode: CategoryDialogueMode, category: Category | null) => {
    setFormMode(mode);
    setEditingCategory(category);
    setFormVisible(true);
  };

  const handleEditFromList = (category: Category) => {
    setListVisible(false);
    setTimeout(() => openForm('edit', category), 280);
  };

  const handleAddFromList = () => {
    setListVisible(false);
    setTimeout(() => openForm('add', null), 280);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || isDeleting) return;

    deleteCategory(deleteTarget.id, {
      onSuccess: () => {
        if (selectedId === deleteTarget.id) {
          onSelect(null);
        }
        setDeleteTarget(null);
      },
      onError: (error) => {
        Alert.alert(t('common.error'), getApiErrorMessage(error));
      },
    });
  };

  const handleCategorySaved = (category: Category) => {
    onSelect(category.id);
  };

  const loadErrorMessage = useMemo(() => {
    if (isAuthRequired || error?.response?.status === 401) {
      return t('transaction.signInForCategoryList');
    }

    if (error) {
      return getApiErrorMessage(error, t('transaction.categoryListFailed'));
    }

    return t('transaction.categoryListFailed');
  }, [error, isAuthRequired, t]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {t('transaction.category')}
          <Text style={styles.star}> {t('common.required')}</Text>
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.85}
          onPress={() => setListVisible(true)}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={16} color={colors.primary} />
          <Text style={styles.editText}>{t('transaction.edit')}</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
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
      ) : (
        <View style={styles.grid}>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              isSelected={selectedId === category.id}
              onPress={() => onSelect(category.id)}
            />
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addChip}
        activeOpacity={0.8}
        onPress={() => openForm('add', null)}
      >
        <HugeiconsIcon icon={Add01Icon} size={18} color={colors.primary} />
        <Text style={styles.addChipText} numberOfLines={1}>
          {t('transaction.addCategory')}
        </Text>
      </TouchableOpacity>

      <EditCategoriesDialogue
        visible={listVisible}
        categories={categories}
        isLoading={isLoading}
        onClose={() => setListVisible(false)}
        onEditCategory={handleEditFromList}
        onAddCategory={handleAddFromList}
        onDeleteCategory={(category) => {
          setListVisible(false);
          setTimeout(() => setDeleteTarget(category), 280);
        }}
      />

      <CategoryDialogue
        visible={formVisible}
        mode={formMode}
        category={formMode === 'edit' ? editingCategory : null}
        onClose={() => setFormVisible(false)}
        onSaved={handleCategorySaved}
      />

      <CategoryDeleteDialogue
        visible={Boolean(deleteTarget)}
        categoryName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Changa_400Regular',
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
  },
  star: {
    color: colors.red,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.secondary,
  },
  addChipText: {
    flexShrink: 0,
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
  },
});

export default CategoryGrid;
