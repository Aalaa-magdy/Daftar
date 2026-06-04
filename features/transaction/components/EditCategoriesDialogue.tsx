import { colors } from '@/theme/colors';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../data/form-options';

const LIST_MAX_HEIGHT = Dimensions.get('window').height * 0.52;

interface Props {
  visible: boolean;
  onClose: () => void;
  onEditCategory: (category: ExpenseCategory) => void;
  onAddCategory: () => void;
  onDeleteCategory?: (category: ExpenseCategory) => void;
}

const EditCategoriesDialogue = ({
  visible,
  onClose,
  onEditCategory,
  onAddCategory,
  onDeleteCategory,
}: Props) => {
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

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Edit Categories</Text>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {EXPENSE_CATEGORIES.map((category) => (
              <View key={category.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <HugeiconsIcon
                    icon={category.icon}
                    size={20}
                    color={category.color}
                  />
                  <Text style={[styles.rowLabel, { color: category.color }]}>
                    {category.label}
                  </Text>
                </View>

                <View style={styles.rowActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.85}
                    onPress={() => onEditCategory(category)}
                    accessibilityLabel={`Edit ${category.label}`}
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
                    accessibilityLabel={`Delete ${category.label}`}
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

          <TouchableOpacity
            style={styles.addChip}
            activeOpacity={0.85}
            onPress={onAddCategory}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} color={colors.primary} />
            <Text style={styles.addChipText}>Add Category</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
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
    paddingBottom: 24,
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
