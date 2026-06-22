import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { INCOME_TYPES } from '@/features/transaction/data/form-options';
import { formatDisplayDate } from '@/features/transaction/lib/format-date';
import FormField from '@/features/transaction/components/FormField';
import SelectField from '@/features/transaction/components/SelectField';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import { getApiErrorMessage } from '@/lib/api-error';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeleteRecurringIncomeDialogue from '../components/DeleteRecurringIncomeDialogue';
import {
  useDeleteRecurringTransaction,
  useRecurringTransaction,
  useUpdateRecurringTransaction,
} from '../hooks';
import {
  buildUpdateRecurringIncomePayload,
  mapRecurringTransactionToForm,
  RECURRING_FREQUENCY_OPTIONS,
} from '../lib/recurring-form-mappers';
import type { RecurringFrequency } from '../types/recurring-transaction.types';

type PickerKey = 'incomeType' | 'frequency' | null;

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} color={colors.captionMuted} />
);

function resolveParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function frequencyLabelKey(frequency: RecurringFrequency): string {
  if (frequency === 'monthly') return 'common.monthly';
  if (frequency === 'weekly') return 'manageIncome.scheduleWeekly';
  if (frequency === 'yearly') return 'manageIncome.scheduleYearly';
  return 'common.oneTime';
}

const EditRecurringIncomeScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = resolveParam(rawId) ?? '';

  const {
    data: recurringIncome,
    isLoading,
    isError,
    refetch,
  } = useRecurringTransaction(id || null);
  const { mutate: updateRecurringIncome, isPending: isUpdating } =
    useUpdateRecurringTransaction();
  const { mutate: deleteRecurringIncome, isPending: isDeleting } =
    useDeleteRecurringTransaction();

  const [incomeType, setIncomeType] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [note, setNote] = useState('');
  const [activePicker, setActivePicker] = useState<PickerKey>(null);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const incomeTypeLabels = useMemo(
    () => INCOME_TYPES.map((key) => t(`transaction.incomeTypes.${key}`)),
    [t],
  );

  const frequencyLabels = useMemo(
    () => RECURRING_FREQUENCY_OPTIONS.map((key) => t(frequencyLabelKey(key))),
    [t],
  );

  const incomeTypeDisplay = useMemo(() => {
    const index = INCOME_TYPES.indexOf(
      incomeType as (typeof INCOME_TYPES)[number],
    );
    return index >= 0 ? incomeTypeLabels[index] : '';
  }, [incomeType, incomeTypeLabels]);

  const frequencyDisplay = useMemo(() => {
    const index = RECURRING_FREQUENCY_OPTIONS.indexOf(frequency);
    return index >= 0 ? frequencyLabels[index] : '';
  }, [frequency, frequencyLabels]);

  const paydayDisplay = useMemo(() => {
    if (!recurringIncome) return '';
    const parsed = new Date(recurringIncome.startDate || recurringIncome.nextRunDate);
    return Number.isNaN(parsed.getTime()) ? '' : formatDisplayDate(parsed);
  }, [recurringIncome]);

  useEffect(() => {
    if (!recurringIncome) return;

    const formValues = mapRecurringTransactionToForm(recurringIncome);
    setIncomeType(formValues.incomeType);
    setAmount(formValues.amount);
    setFrequency(formValues.frequency);
    setNote(formValues.note);
  }, [recurringIncome]);

  const isFormComplete = useMemo(
    () => Boolean(amount.trim() && incomeType),
    [amount, incomeType],
  );

  const isSaving = isUpdating || isDeleting;

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !recurringIncome) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingWrap}>
          <Button title={t('common.retry')} onPress={() => refetch()} />
        </View>
      </SafeAreaView>
    );
  }

  const togglePicker = (key: Exclude<PickerKey, null>) => {
    setActivePicker((current) => (current === key ? null : key));
  };

  const handleSubmit = () => {
    if (!isFormComplete) return;

    try {
      const payload = buildUpdateRecurringIncomePayload({
        incomeType,
        amount,
        date: null,
        frequency,
        note,
      });

      updateRecurringIncome(
        { id, data: payload },
        {
          onSuccess: () => router.back(),
          onError: (error) => {
            Alert.alert(t('common.error'), getApiErrorMessage(error));
          },
        },
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('common.error'),
      );
    }
  };

  const handleDelete = () => {
    deleteRecurringIncome(id, {
      onSuccess: () => {
        setShowDeleteDialogue(false);
        router.back();
      },
      onError: (error) => {
        setShowDeleteDialogue(false);
        Alert.alert(t('common.error'), getApiErrorMessage(error));
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          enableAutomaticScroll
          extraHeight={120}
          extraScrollHeight={120}
        >
          <TransactionHeader
            title={t('manageIncome.editTitle')}
            onBack={() => router.back()}
            onDelete={() => setShowDeleteDialogue(true)}
          />

          <FormField label={t('transaction.incomeType')} required>
            <SelectField
              value={incomeTypeDisplay}
              placeholder={t('transaction.chooseIncomeType')}
              options={incomeTypeLabels}
              onSelect={(label) => {
                const index = incomeTypeLabels.indexOf(label);
                if (index >= 0) setIncomeType(INCOME_TYPES[index]);
              }}
              icon={fieldIcon(ArrowUpLeft01Icon)}
              open={activePicker === 'incomeType'}
              onToggle={() => togglePicker('incomeType')}
            />
          </FormField>

          <FormField label={t('transaction.amount')} required>
            <Input
              placeholder={t('common.amountPlaceholder')}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              icon={fieldIcon(MoneyBag01Icon)}
              containerStyle={styles.fieldInput}
            />
          </FormField>

          <FormField
            label={t('transaction.payday')}
            helper={t('manageIncome.paydayReadOnlyHelper')}
          >
            <Input
              placeholder={t('common.datePlaceholder')}
              value={paydayDisplay}
              editable={false}
              icon={fieldIcon(Calendar03Icon)}
              containerStyle={styles.fieldInput}
            />
          </FormField>

          <FormField label={t('transaction.repeat')} required>
            <SelectField
              value={frequencyDisplay}
              placeholder={t('common.monthly')}
              options={frequencyLabels}
              onSelect={(label) => {
                const index = frequencyLabels.indexOf(label);
                if (index >= 0) {
                  setFrequency(RECURRING_FREQUENCY_OPTIONS[index]);
                }
              }}
              icon={fieldIcon(RepeatIcon)}
              open={activePicker === 'frequency'}
              onToggle={() => togglePicker('frequency')}
            />
          </FormField>

          <FormField label={t('transaction.note')}>
            <Input
              placeholder={t('common.optional')}
              value={note}
              onChangeText={setNote}
              multiline
              containerStyle={styles.fieldInput}
            />
          </FormField>

          <View style={styles.buttonWrap}>
            <Button
              title={t('common.saveChanges')}
              onPress={handleSubmit}
              disabled={!isFormComplete || isSaving}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <DeleteRecurringIncomeDialogue
        visible={showDeleteDialogue}
        onClose={() => setShowDeleteDialogue(false)}
        onConfirm={handleDelete}
      />
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
    gap: 12,
  },
  fieldInput: {
    marginBottom: 4,
  },
  buttonWrap: {
    marginTop: 24,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditRecurringIncomeScreen;
