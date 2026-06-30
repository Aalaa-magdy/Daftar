import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { INCOME_TYPES } from '@/features/transaction/data/form-options';
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
import { useEffect, useMemo, useRef, useState } from 'react';
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
} from '../lib/recurring-form-mappers';
import type { RecurringFrequency } from '../types/recurring-transaction.types';

type PickerKey = 'incomeType' | null;

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} color={colors.captionMuted} />
);

function resolveParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function frequencyLabelKey(frequency: RecurringFrequency): string {
  return frequency === 'one-time' ? 'common.oneTime' : 'common.monthly';
}

function parseDayOfMonthInput(text: string): number | null {
  const digits = text.replace(/\D/g, '');
  if (!digits) return null;

  const value = Number(digits);
  if (!Number.isFinite(value)) return null;

  return Math.min(Math.max(Math.trunc(value), 1), 31);
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
  const [dayOfMonth, setDayOfMonth] = useState('');
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

  const incomeTypeDisplay = useMemo(() => {
    const index = INCOME_TYPES.indexOf(
      incomeType as (typeof INCOME_TYPES)[number],
    );
    return index >= 0 ? incomeTypeLabels[index] : '';
  }, [incomeType, incomeTypeLabels]);

  const frequencyDisplay = useMemo(() => {
    if (!recurringIncome) return '';
    return t(frequencyLabelKey(recurringIncome.frequency));
  }, [recurringIncome, t]);

  const parsedDayOfMonth = useMemo(() => parseDayOfMonthInput(dayOfMonth), [dayOfMonth]);
  const hydratedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    hydratedKeyRef.current = null;
  }, [id]);

  useEffect(() => {
    if (!recurringIncome) return;

    const hydrationKey = [
      recurringIncome.id,
      recurringIncome.updatedAt ?? '',
      recurringIncome.dayOfMonth ?? '',
      recurringIncome.amount,
      recurringIncome.notes ?? '',
      recurringIncome.incomeType ?? '',
    ].join(':');

    if (hydratedKeyRef.current === hydrationKey) return;

    const formValues = mapRecurringTransactionToForm(recurringIncome);
    setIncomeType(formValues.incomeType);
    setAmount(formValues.amount);
    setDayOfMonth(String(formValues.dayOfMonth));
    setNote(formValues.note);
    hydratedKeyRef.current = hydrationKey;
  }, [recurringIncome]);

  const isFormComplete = useMemo(
    () => Boolean(amount.trim() && incomeType && parsedDayOfMonth != null),
    [amount, incomeType, parsedDayOfMonth],
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
    if (!isFormComplete || parsedDayOfMonth == null) return;

    try {
      const payload = buildUpdateRecurringIncomePayload({
        incomeType,
        amount,
        dayOfMonth: parsedDayOfMonth,
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
            required
            helper={t('transaction.paydayHelper')}
          >
            <Input
              placeholder={t('manageIncome.dayOfMonthPlaceholder')}
              value={dayOfMonth}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 2);
                if (!digits) {
                  setDayOfMonth('');
                  return;
                }

                const value = Number(digits);
                if (value > 31) {
                  setDayOfMonth('31');
                  return;
                }

                setDayOfMonth(String(value));
              }}
              keyboardType="number-pad"
              maxLength={2}
              icon={fieldIcon(Calendar03Icon)}
              containerStyle={styles.fieldInput}
            />
          </FormField>

          <FormField
            label={t('transaction.repeat')}
            helper={t('manageIncome.frequencyReadOnlyHelper')}
          >
            <Input
              placeholder={t('common.monthly')}
              value={frequencyDisplay}
              editable={false}
              icon={fieldIcon(RepeatIcon)}
              containerStyle={styles.fieldInput}
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
