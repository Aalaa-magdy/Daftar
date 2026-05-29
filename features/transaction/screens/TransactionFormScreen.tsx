import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import ArrowUpLeft01Icon from '@hugeicons/core-free-icons/ArrowUpLeft01Icon';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import MoneyBag01Icon from '@hugeicons/core-free-icons/MoneyBag01Icon';
import RepeatIcon from '@hugeicons/core-free-icons/RepeatIcon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryGrid from '../components/CategoryGrid';
import FormField from '../components/FormField';
import SelectField from '../components/SelectField';
import TransactionHeader from '../components/TransactionHeader';
import TransactionTypeToggle from '../components/TransactionTypeToggle';
import { INCOME_TYPES, REPEAT_OPTIONS } from '../data/form-options';
import { useTransactionFormMode } from '../hooks/useTransactionFormMode';
import { formatDisplayDate } from '../lib/format-date';
import type { TransactionKind } from '../types';

type PickerKey = 'incomeType' | 'repeat' | null;

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} color={colors.captionMuted} />
);

const TransactionFormScreen = () => {
  const router = useRouter();
  const { kind: initialKind, isEdit, title } = useTransactionFormMode();

  const [kind, setKind] = useState<TransactionKind>(initialKind);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [incomeType, setIncomeType] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [repeat, setRepeat] = useState('Monthly');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerKey>(null);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    setKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    if (!isEdit) return;

    if (initialKind === 'expense') {
      setAmount('3000');
      setCategoryId('education');
      setDate(new Date(2026, 4, 27));
      setNote('');
      return;
    }

    setIncomeType('Part Time');
    setAmount('10000');
    setDate(new Date(2026, 5, 1));
    setRepeat('Monthly');
  }, [isEdit, initialKind]);

  const dateDisplay = date ? formatDisplayDate(date) : '';

  const isFormComplete = useMemo(() => {
    if (!amount.trim() || !date) return false;

    if (kind === 'expense') {
      return Boolean(categoryId);
    }

    return Boolean(incomeType);
  }, [amount, date, kind, categoryId, incomeType]);

  const saveLabel =
    kind === 'income' ? 'Save Income' : 'Save Expense';

  if (!fontsLoaded) {
    return null;
  }

  const togglePicker = (key: Exclude<PickerKey, null>) => {
    setActivePicker((current) => (current === key ? null : key));
  };

  const handleSubmit = () => {
    if (!isFormComplete) return;
    // TODO: persist — create when !isEdit, update when isEdit (id)
    router.back();
  };

  const handleDelete = () => {
    // TODO: delete transaction by id
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TransactionHeader
          title={title}
          onBack={() => router.back()}
          onDelete={isEdit ? handleDelete : undefined}
        />

        <TransactionTypeToggle value={kind} onChange={setKind} />

        {kind === 'income' ? (
          <>
            <FormField label="Income Type" required>
              <SelectField
                value={incomeType}
                placeholder="Choose income type"
                options={INCOME_TYPES}
                onSelect={setIncomeType}
                icon={fieldIcon(ArrowUpLeft01Icon)}
                open={activePicker === 'incomeType'}
                onToggle={() => togglePicker('incomeType')}
              />
            </FormField>

            <FormField label="Amount" required>
              <Input
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                icon={fieldIcon(MoneyBag01Icon)}
                containerStyle={styles.fieldInput}
              />
            </FormField>

            <FormField
              label="Payday"
              required
              helper="Your balance resets on this day each month."
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setActivePicker(null);
                  setShowDatePicker(true);
                }}
              >
                <View pointerEvents="none">
                  <Input
                    placeholder="DD/MM/YYYY"
                    value={dateDisplay}
                    icon={fieldIcon(Calendar03Icon)}
                    containerStyle={styles.fieldInput}
                  />
                </View>
              </TouchableOpacity>
            </FormField>

            <FormField label="Repeat" required>
              <SelectField
                value={repeat}
                placeholder="Monthly"
                options={REPEAT_OPTIONS}
                onSelect={setRepeat}
                icon={fieldIcon(RepeatIcon)}
                open={activePicker === 'repeat'}
                onToggle={() => togglePicker('repeat')}
              />
            </FormField>
          </>
        ) : (
          <>
            <FormField label="Amount" required>
              <Input
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                icon={fieldIcon(MoneyBag01Icon)}
                containerStyle={styles.fieldInput}
              />
            </FormField>

            <FormField label="Category" required>
              <CategoryGrid
                selectedId={categoryId}
                onSelect={setCategoryId}
              />
            </FormField>

            <FormField label="Date" required>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setActivePicker(null);
                  setShowDatePicker(true);
                }}
              >
                <View pointerEvents="none">
                  <Input
                    placeholder="DD/MM/YYYY"
                    value={dateDisplay}
                    icon={fieldIcon(Calendar03Icon)}
                    containerStyle={styles.fieldInput}
                  />
                </View>
              </TouchableOpacity>
            </FormField>

            <FormField label="Note">
              <Input
                placeholder="Optional"
                value={note}
                onChangeText={setNote}
                multiline
                containerStyle={styles.fieldInput}
              />
            </FormField>
          </>
        )}

        <View style={styles.buttonWrap}>
          <Button
            title={saveLabel}
            onPress={handleSubmit}
            disabled={!isFormComplete}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.pickerModalRoot}>
          <Pressable
            style={styles.pickerBackdrop}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.pickerOverlay} pointerEvents="box-none">
            <DatePicker
              value={date}
              onChange={(nextDate) => {
                setDate(nextDate);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap:12,
  },
  fieldInput: {
    marginBottom: 4,
  },
  buttonWrap: {
    marginTop: 24,
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

export default TransactionFormScreen;
