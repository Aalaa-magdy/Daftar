import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CATEGORY_COLOR_OPTIONS,
  type CategoryDialogueMode,
  type ExpenseCategory,
} from '../data/form-options';
import {
  CATEGORY_PICKER_ICONS,
  DEFAULT_CATEGORY_ICON,
} from '../data/category-icons';
import FormField from './FormField';

interface Props {
  visible: boolean;
  mode: CategoryDialogueMode;
  category?: ExpenseCategory | null;
  onClose: () => void;
  onSave?: (payload: {
    name: string;
    color: string;
    icon: IconSvgElement;
  }) => void;
}

const ICON_COLUMNS = 8;

const CategoryDialogue = ({
  visible,
  mode,
  category,
  onClose,
  onSave,
}: Props) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(
    CATEGORY_COLOR_OPTIONS[0]
  );
  const [selectedIcon, setSelectedIcon] =
    useState<IconSvgElement>(DEFAULT_CATEGORY_ICON);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Category' : 'Add Category';

  useEffect(() => {
    if (!visible) {
      setShowIconPicker(false);
      return;
    }

    if (isEdit && category) {
      setName(category.label);
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
      return;
    }

    setName('');
    setSelectedColor(CATEGORY_COLOR_OPTIONS[0]);
    setSelectedIcon(DEFAULT_CATEGORY_ICON);
  }, [visible, isEdit, category]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });
    onClose();
  };

  const handleSelectIcon = (icon: IconSvgElement) => {
    setSelectedIcon(icon);
    setShowIconPicker(false);
  };

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

          <Text style={styles.title}>{title}</Text>

          <FormField label="Category Name" required>
            <Input
              placeholder="Enter category name"
              value={name}
              onChangeText={setName}
              icon={
                <HugeiconsIcon
                  icon={selectedIcon}
                  size={22}
                  color={
                    name.trim().length > 0 ? selectedColor : colors.captionMuted
                  }
                />
              }
              containerStyle={styles.fieldInput}
            />
          </FormField>

          <FormField label="Icon" required>
            <View style={styles.iconFieldWrap}>
              {showIconPicker ? (
                <View style={styles.iconPicker}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    style={styles.iconPickerScroll}
                    contentContainerStyle={styles.iconPickerContent}
                  >
                    <View style={styles.iconGrid}>
                      {CATEGORY_PICKER_ICONS.map((icon, index) => {
                        const isSelected = selectedIcon === icon;

                        return (
                          <TouchableOpacity
                            key={`category-icon-${index}`}
                            style={styles.iconCell}
                            onPress={() => handleSelectIcon(icon)}
                            activeOpacity={0.7}
                          >
                            <HugeiconsIcon
                              icon={icon}
                              size={22}
                              color={
                                isSelected ? colors.primary : colors.textSecondary
                              }
                              strokeWidth={isSelected ? 2 : 1.5}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowIconPicker((current) => !current)}
              >
                <View pointerEvents="none">
                  <Input
                    placeholder="Choose Icon"
                    value=""
                    icon={
                      <HugeiconsIcon
                        icon={selectedIcon}
                        size={22}
                        color={colors.primary}
                      />
                    }
                    containerStyle={styles.fieldInput}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </FormField>

          <FormField label="Color" required>
            <View style={styles.colors}>
              {CATEGORY_COLOR_OPTIONS.map((color) => {
                const isSelected = selectedColor === color;

                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      isSelected && styles.colorSwatchSelected,
                    ]}
                    onPress={() => {
                      setSelectedColor(color);
                      setShowIconPicker(false);
                    }}
                    activeOpacity={0.85}
                  />
                );
              })}
            </View>
          </FormField>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.saveWrap}>
              <Button
                title="Save"
                onPress={handleSave}
                disabled={!canSave}
              />
            </View>
          </View>
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
    backgroundColor: colors.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    gap: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  fieldInput: {
    marginBottom: 0,
  },
  iconFieldWrap: {
    position: 'relative',
    zIndex: 20,
  },
  iconPicker: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 8,
    backgroundColor: colors.backgroundColor,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    zIndex: 2,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  iconPickerScroll: {
    maxHeight: 264,
  },
  iconPickerContent: {
    paddingBottom: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconCell: {
    width: `${100 / ICON_COLUMNS}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchSelected: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
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
  saveWrap: {
    flex: 1,
  },
});

export default CategoryDialogue;
