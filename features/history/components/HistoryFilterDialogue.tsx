import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input';
import CategorySelectGrid from '@/features/categories/components/CategorySelectGrid';
import FormField from '@/features/transaction/components/FormField';
import { formatDisplayDate } from '@/features/transaction/lib/format-date';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TIME_RANGE_PRESETS } from '../lib/date-ranges';
import {
  DEFAULT_HISTORY_FILTER,
  type HistoryFilterState,
  type TimeRangePreset,
} from '../types/history-filter';

type DateField = 'from' | 'to' | null;

interface Props {
  visible: boolean;
  value: HistoryFilterState;
  onClose: () => void;
  onSave: (value: HistoryFilterState) => void;
}

const HistoryFilterDialogue = ({ visible, value, onClose, onSave }: Props) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<HistoryFilterState>(DEFAULT_HISTORY_FILTER);
  const [activeDateField, setActiveDateField] = useState<DateField>(null);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    if (!visible) {
      setActiveDateField(null);
      return;
    }

    setDraft(value);
  }, [visible, value]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePresetPress = (preset: TimeRangePreset) => {
    setDraft((current) => ({
      ...current,
      preset: current.preset === preset ? null : preset,
      fromDate: null,
      toDate: null,
    }));
  };

  const handleDateChange = (date: Date) => {
    if (activeDateField === 'from') {
      setDraft((current) => ({
        ...current,
        preset: null,
        fromDate: date,
      }));
    }

    if (activeDateField === 'to') {
      setDraft((current) => ({
        ...current,
        preset: null,
        toDate: date,
      }));
    }

    setActiveDateField(null);
  };

  const toggleCategory = (categoryId: string) => {
    setDraft((current) => {
      const isSelected = current.categoryIds.includes(categoryId);

      return {
        ...current,
        categoryIds: isSelected
          ? current.categoryIds.filter((id) => id !== categoryId)
          : [...current.categoryIds, categoryId],
      };
    });
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const activePickerDate =
    activeDateField === 'from'
      ? draft.fromDate
      : activeDateField === 'to'
        ? draft.toDate
        : null;

  return (
    <>
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
            <Text style={styles.title}>{t('history.filterTitle')}</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.presets}>
                {TIME_RANGE_PRESETS.map((preset) => {
                  const isSelected = draft.preset === preset.id;

                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetChip,
                        isSelected && styles.presetChipSelected,
                      ]}
                      onPress={() => handlePresetPress(preset.id)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          isSelected && styles.presetTextSelected,
                        ]}
                      >
                        {t(preset.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('history.customRange')}</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>{t('history.from')}</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setActiveDateField('from')}
                  >
                    <View pointerEvents="none">
                      <Input
                        placeholder={t('common.datePlaceholder')}
                        value={
                          draft.fromDate ? formatDisplayDate(draft.fromDate) : ''
                        }
                        icon={
                          <HugeiconsIcon icon={Calendar03Icon} size={22} />
                        }
                        containerStyle={styles.fieldInput}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateField}>
                  <Text style={styles.dateLabel}>{t('history.to')}</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setActiveDateField('to')}
                  >
                    <View pointerEvents="none">
                      <Input
                        placeholder={t('common.datePlaceholder')}
                        value={draft.toDate ? formatDisplayDate(draft.toDate) : ''}
                        icon={
                          <HugeiconsIcon icon={Calendar03Icon} size={22} />
                        }
                        containerStyle={styles.fieldInput}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <FormField label={t('history.category')}>
                <CategorySelectGrid
                  selectedIds={draft.categoryIds}
                  onToggle={toggleCategory}
                />
              </FormField>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <View style={styles.saveWrap}>
                <Button title={t('common.save')} onPress={handleSave} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeDateField != null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveDateField(null)}
      >
        <View style={styles.pickerModalRoot}>
          <Pressable
            style={styles.pickerBackdrop}
            onPress={() => setActiveDateField(null)}
          />
          <View style={styles.pickerOverlay} pointerEvents="box-none">
            <DatePicker
              value={activePickerDate}
              onChange={handleDateChange}
            />
          </View>
        </View>
      </Modal>
    </>
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
    maxHeight: '88%',
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
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 8,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 72,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundColor,
  },
  presetChipSelected: {
    backgroundColor: colors.primary,
  },
  presetText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary,
    textAlign: 'center',
  },
  presetTextSelected: {
    color: colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    gap: 6,
  },
  dateLabel: {
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
  },
  fieldInput: {
    marginBottom: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
  pickerModalRoot: {
    flex: 1,
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 10, 0.25)',
  },
  pickerOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default HistoryFilterDialogue;
