import { colors } from '@/theme/colors';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { Category } from '@/features/categories/types/categories.types';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LIST_MAX_HEIGHT = Dimensions.get('window').height * 0.52;

interface Props {
  visible: boolean;
  categories: Category[];
  isLoading?: boolean;
  onClose: () => void;
  onEditCategory: (category: Category) => void;
  onAddCategory: () => void;
  onDeleteCategory?: (category: Category) => void;
}

const EditCategoriesDialogue = ({
  visible,
  categories,
  isLoading = false,
  onClose,
  onEditCategory,
  onAddCategory,
  onDeleteCategory,
}: Props) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 44 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('transaction.editCategories')}</Text>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {categories.map((category) => (
                <View key={category.id} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <HugeiconsIcon
                      icon={resolveCategoryIcon(category.icon)}
                      size={20}
                      color={category.color}
                    />
                    <Text style={[styles.rowLabel, { color: category.color }]}>
                      {category.name}
                    </Text>
                  </View>

                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.85}
                      onPress={() => onEditCategory(category)}
                      accessibilityLabel={t('transaction.editCategoryA11y', {
                        name: category.name,
                      })}
                    >
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        size={20}
                        color={colors.textGray}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.85}
                      onPress={() => onDeleteCategory?.(category)}
                      accessibilityLabel={t('transaction.deleteCategoryA11y', {
                        name: category.name,
                      })}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        size={20}
                        color={colors.red}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.addChip}
            activeOpacity={0.85}
            onPress={onAddCategory}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} color={colors.primary} />
            <Text style={styles.addChipText}>{t('transaction.addCategory')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 10, 0.25)',
  },
  sheet: {
    maxHeight: '85%',
    backgroundColor: colors.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  listContent: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: colors.secondary,
  },
  addChipText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.primary,
  },
  cancelButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundColor,
  },
  cancelText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.primary,
  },
});

export default EditCategoriesDialogue;
