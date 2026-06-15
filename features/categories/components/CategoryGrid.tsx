import { colors } from '@/theme/colors';
import { getCategorySelectedStyles } from '@/features/categories/lib/category-colors';
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
import { useState } from 'react';
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

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const CategoryGrid = ({ selectedId, onSelect }: Props) => {
  const { t } = useTranslation();
  const { data: categories = [], isLoading, isError, refetch } = useCategories();
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
        <TouchableOpacity style={styles.errorWrap} onPress={() => refetch()}>
          <Text style={styles.errorText}>{t('transaction.categoriesLoadError')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.grid}>
          {categories.map((category) => {
            const isSelected = selectedId === category.id;
            const selectedStyles = isSelected
              ? getCategorySelectedStyles(category.color)
              : null;

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.chip,
                  isSelected
                    ? {
                        backgroundColor: selectedStyles!.backgroundColor,
                        borderColor: selectedStyles!.borderColor,
                      }
                    : styles.chipDefault,
                ]}
                onPress={() => onSelect(category.id)}
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
          })}
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
  },
  errorText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    color: colors.red,
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
  chipDefault: {
    backgroundColor: colors.white,
    borderColor: colors.border,
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
