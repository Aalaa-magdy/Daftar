import {
  getCategorySelectedStyles,
  getCategoryUnselectedStyles,
} from '@/features/categories/lib/category-colors';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { Category } from '@/features/categories/types/categories.types';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryChip = ({ category, isSelected, onPress }: Props) => {
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

const styles = StyleSheet.create({
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
});

export default CategoryChip;
