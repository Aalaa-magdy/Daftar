import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import { CATEGORY_COLOR_OPTIONS, buildCategoryColorPayload } from '@/features/categories/lib/category-colors';
import {
  CATEGORY_ICON_OPTIONS,
  DEFAULT_CATEGORY_ICON,
  resolveCategoryIcon,
  resolveFaIcon,
} from '@/features/categories/lib/category-icons';
import type {
  Category,
  CategoryDialogueMode,
} from '@/features/categories/types/categories.types';
import MoneyBag01Icon from '@hugeicons/core-free-icons/MoneyBag01Icon';
import GridViewIcon from '@hugeicons/core-free-icons/GridViewIcon';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormField from '@/features/transaction/components/FormField';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/features/categories/hooks';

const ICON_COLUMNS = 8;

interface Props {
  visible: boolean;
  mode: CategoryDialogueMode;
  category?: Category | null;
  onClose: () => void;
  onSaved?: (category: Category) => void;
}

const CategoryDialogue = ({
  visible,
  mode,
  category,
  onClose,
  onSaved,
}: Props) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(
    CATEGORY_COLOR_OPTIONS[0],
  );
  const [selectedIcon, setSelectedIcon] =
    useState<IconSvgElement>(DEFAULT_CATEGORY_ICON);
  const [hasChosenIcon, setHasChosenIcon] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isEdit = mode === 'edit';
  const isPending = isCreating || isUpdating;
  const title = isEdit
    ? t('transaction.editCategory')
    : t('transaction.addCategory');

  useEffect(() => {
    if (!visible) {
      setShowIconPicker(false);
      return;
    }

    if (isEdit && category) {
      setName(category.name);
      setSelectedColor(category.color);
      setSelectedIcon(resolveCategoryIcon(category.icon));
      setHasChosenIcon(true);
      return;
    }

    setName('');
    setSelectedColor(CATEGORY_COLOR_OPTIONS[0]);
    setSelectedIcon(DEFAULT_CATEGORY_ICON);
    setHasChosenIcon(false);
  }, [visible, isEdit, category]);

  const canSave = useMemo(
    () => name.trim().length > 0 && hasChosenIcon && !isPending,
    [name, hasChosenIcon, isPending],
  );

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    if (!canSave) return;

    const colorFields = buildCategoryColorPayload(selectedColor);

    const payload = {
      name: name.trim(),
      icon: resolveFaIcon(selectedIcon),
      ...colorFields,
    };

    if (isEdit && category) {
      updateCategory(
        { id: category.id, data: payload },
        {
          onSuccess: (saved) => {
            onSaved?.(saved);
            onClose();
          },
          onError: (error) => {
            Alert.alert(t('common.error'), getApiErrorMessage(error));
          },
        },
      );
      return;
    }

    createCategory(payload, {
      onSuccess: (saved) => {
        onSaved?.(saved);
        onClose();
      },
      onError: (error) => {
        Alert.alert(t('common.error'), getApiErrorMessage(error));
      },
    });
  };

  const handleSelectIcon = (icon: IconSvgElement) => {
    setSelectedIcon(icon);
    setHasChosenIcon(true);
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
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />

        <KeyboardAwareScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetScrollContent}
          enableOnAndroid
          enableAutomaticScroll
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'ios' ? 24 : 80}
          extraHeight={120}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 44 }]}>
              <View style={styles.handle} />

              <Text style={styles.title}>{title}</Text>

              <FormField label={t('transaction.categoryName')} required>
                <Input
                  placeholder={t('transaction.enterCategoryName')}
                  value={name}
                  onChangeText={setName}
                  icon={
                    <HugeiconsIcon
                      icon={MoneyBag01Icon}
                      size={22}
                      color={colors.captionMuted}
                    />
                  }
                  containerStyle={styles.fieldInput}
                />
              </FormField>

              <FormField label={t('transaction.icon')} required>
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
                          {CATEGORY_ICON_OPTIONS.map((option, index) => {
                            const isSelected = selectedIcon === option.icon;

                            return (
                              <TouchableOpacity
                                key={`category-icon-${index}`}
                                style={styles.iconCell}
                                onPress={() => handleSelectIcon(option.icon)}
                                activeOpacity={0.7}
                              >
                                <HugeiconsIcon
                                  icon={option.icon}
                                  size={22}
                                  color={
                                    isSelected
                                      ? colors.primary
                                      : colors.textSecondary
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
                        placeholder={t('transaction.chooseIcon')}
                        value=""
                        icon={
                          <HugeiconsIcon
                            icon={hasChosenIcon ? selectedIcon : GridViewIcon}
                            size={22}
                            color={
                              hasChosenIcon ? selectedColor : colors.captionMuted
                            }
                          />
                        }
                        containerStyle={styles.fieldInput}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </FormField>

              <FormField label={t('transaction.color')} required>
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
                  disabled={isPending}
                >
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <View style={styles.saveWrap}>
                  {isPending ? (
                    <View style={styles.pendingWrap}>
                      <ActivityIndicator color={colors.primary} />
                    </View>
                  ) : (
                    <Button
                      title={t('common.save')}
                      onPress={handleSave}
                      disabled={!canSave}
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
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
  sheetScroll: {
    maxHeight: '92%',
  },
  sheetScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
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
  pendingWrap: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryDialogue;
