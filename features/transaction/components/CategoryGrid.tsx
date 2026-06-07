import { colors } from '@/theme/colors';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  EXPENSE_CATEGORIES,
  getCategoryLabelKey,
  type CategoryDialogueMode,
  type ExpenseCategory,
} from '../data/form-options';
import CategoryDialogue from './CategoryDialogue';
import EditCategoriesDialogue from './EditCategoriesDialogue';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CategoryGrid = ({ selectedId, onSelect }: Props) => {
  const { t } = useTranslation();
  const [listVisible, setListVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<CategoryDialogueMode>('add');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(
    null
  );

  const openForm = (mode: CategoryDialogueMode, category: ExpenseCategory | null) => {
    setFormMode(mode);
    setEditingCategory(category);
    setFormVisible(true);
  };

  const handleEditFromList = (category: ExpenseCategory) => {
    setListVisible(false);
    setTimeout(() => openForm('edit', category), 280);
  };

  const handleAddFromList = () => {
    setListVisible(false);
    setTimeout(() => openForm('add', null), 280);
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

      <View style={styles.grid}>
        {EXPENSE_CATEGORIES.map((category) => {
          const isSelected = selectedId === category.id;
          const label = t(
            `transaction.categories.${getCategoryLabelKey(category.id)}`
          );

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(category.id)}
              activeOpacity={0.8}
            >
              <HugeiconsIcon icon={category.icon} size={18} color={category.color} />
              <Text style={[styles.chipText, { color: category.color }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
        onClose={() => setListVisible(false)}
        onEditCategory={handleEditFromList}
        onAddCategory={handleAddFromList}
        onDeleteCategory={() => {
          // TODO: delete category
        }}
      />

      <CategoryDialogue
        visible={formVisible}
        mode={formMode}
        category={formMode === 'edit' ? editingCategory : null}
        onClose={() => setFormVisible(false)}
        onSave={() => {
          // TODO: persist category create/update
        }}
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
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
