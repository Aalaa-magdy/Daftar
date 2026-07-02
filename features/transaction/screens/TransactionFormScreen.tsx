import { buildCreateTransactionPayload } from '@/features/transactions/lib/build-create-transaction-payload';
import {
  buildUpdateTransactionPayload,
  mapTransactionToForm,
} from '@/features/transactions/lib/transaction-form-mappers';
import { useRequireAuth } from '@/features/auth/hooks';
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransaction,
  useUpdateTransaction,
} from '@/features/transactions/hooks';
import { getApiErrorMessage } from '@/lib/api-error';
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
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CategoryGrid from '@/features/categories/components/CategoryGrid';
import DeleteDialogue from '../components/DeleteDialogue';
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
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isAuthenticated, isAuthChecking } = useRequireAuth();
  const { id, kind: initialKind, isEdit } = useTransactionFormMode();
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const {
    data: existingTransaction,
    isLoading: isLoadingTransaction,
    isError: isTransactionLoadError,
    refetch: refetchTransaction,
  } = useTransaction(isEdit ? id : null);

  const [kind, setKind] = useState<TransactionKind>(initialKind);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [incomeType, setIncomeType] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [repeat, setRepeat] = useState('monthly');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerKey>(null);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const incomeTypeLabels = useMemo(
    () => INCOME_TYPES.map((key) => t(`transaction.incomeTypes.${key}`)),
    [t]
  );

  const repeatLabels = useMemo(
    () =>
      REPEAT_OPTIONS.map((key) =>
        key === 'monthly' ? t('common.monthly') : t('common.oneTime')
      ),
    [t]
  );

  const incomeTypeDisplay = useMemo(() => {
    const index = INCOME_TYPES.indexOf(
      incomeType as (typeof INCOME_TYPES)[number]
    );
    return index >= 0 ? incomeTypeLabels[index] : '';
  }, [incomeType, incomeTypeLabels]);

  const repeatDisplay = useMemo(() => {
    const index = REPEAT_OPTIONS.indexOf(
      repeat as (typeof REPEAT_OPTIONS)[number]
    );
    return index >= 0 ? repeatLabels[index] : '';
  }, [repeat, repeatLabels]);

  useEffect(() => {
    setKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    if (!isEdit || !existingTransaction) return;

    const formValues = mapTransactionToForm(existingTransaction);
    setKind(formValues.kind);
    setAmount(formValues.amount);
    setCategoryId(formValues.categoryId ?? null);
    setIncomeType(formValues.incomeType ?? '');
    setDate(formValues.date);
    setRepeat(formValues.repeat ?? 'monthly');
    setNote(formValues.note ?? '');
  }, [isEdit, existingTransaction]);

  const dateDisplay = date ? formatDisplayDate(date) : '';

  const isFormComplete = useMemo(() => {
    if (!amount.trim() || !date) return false;

    if (kind === 'expense') {
      return Boolean(categoryId);
    }

    return Boolean(incomeType);
  }, [amount, date, kind, categoryId, incomeType]);

  const headerTitle = isEdit
    ? kind === 'income'
      ? t('transaction.editIncome')
      : t('transaction.editExpense')
    : t('transaction.addTitle');

  const saveLabel = isEdit
    ? t('common.saveChanges')
    : kind === 'income'
      ? t('transaction.saveIncome')
      : t('transaction.saveExpense');

  const isSaving = isCreating || isUpdating || isDeleting;

  if (!fontsLoaded || isAuthChecking || !isAuthenticated) {
    return null;
  }

  if (isEdit && isLoadingTransaction) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isEdit && isTransactionLoadError) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingWrap}>
          <Button title={t('common.retry')} onPress={() => refetchTransaction()} />
        </View>
      </SafeAreaView>
    );
  }

  const togglePicker = (key: Exclude<PickerKey, null>) => {
    setActivePicker((current) => (current === key ? null : key));
  };

  const handleSubmit = () => {
    if (!isFormComplete || !date) return;

    if (isEdit) {
      try {
        const payload = buildUpdateTransactionPayload({
          kind,
          amount,
          categoryId,
          incomeType,
          date,
          repeat,
          note,
        });

        updateTransaction(
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
      return;
    }

    try {
      const payload = buildCreateTransactionPayload({
        kind,
        amount,
        categoryId,
        incomeType,
        date,
        repeat,
        note,
      });

      createTransaction(payload, {
        onSuccess: () => router.back(),
        onError: (error) => {
          Alert.alert(t('common.error'), getApiErrorMessage(error));
        },
      });
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('common.error'),
      );
    }
  };

  const handleDelete = () => {
    deleteTransaction(id, {
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.scrollHost}>
          <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            enableOnAndroid
            enableAutomaticScroll
            nestedScrollEnabled
            extraHeight={120}
            extraScrollHeight={120}
            bounces
          >
            <TransactionHeader
              title={headerTitle}
              onBack={() => router.back()}
              onDelete={isEdit ? () => setShowDeleteDialogue(true) : undefined}
            />

            {!isEdit ? (
              <TransactionTypeToggle value={kind} onChange={setKind} />
            ) : null}

            {kind === 'income' ? (
              <>
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
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      setActivePicker(null);
                      setShowDatePicker(true);
                    }}
                  >
                    <View pointerEvents="none">
                      <Input
                        placeholder={t('common.datePlaceholder')}
                        value={dateDisplay}
                        editable={false}
                        icon={fieldIcon(Calendar03Icon)}
                        containerStyle={styles.fieldInput}
                      />
                    </View>
                  </TouchableOpacity>
                </FormField>

                <FormField label={t('transaction.repeat')} required>
                  <SelectField
                    value={repeatDisplay}
                    placeholder={t('common.monthly')}
                    options={repeatLabels}
                    onSelect={(label) => {
                      const index = repeatLabels.indexOf(label);
                      if (index >= 0) setRepeat(REPEAT_OPTIONS[index]);
                    }}
                    icon={fieldIcon(RepeatIcon)}
                    open={activePicker === 'repeat'}
                    onToggle={() => togglePicker('repeat')}
                  />
                </FormField>
              </>
            ) : (
              <>
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

                <CategoryGrid selectedId={categoryId} onSelect={setCategoryId} />

                <FormField label={t('transaction.date')} required>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      setActivePicker(null);
                      setShowDatePicker(true);
                    }}
                  >
                    <View pointerEvents="none">
                      <Input
                        placeholder={t('common.datePlaceholder')}
                        value={dateDisplay}
                        editable={false}
                        icon={fieldIcon(Calendar03Icon)}
                        containerStyle={styles.fieldInput}
                      />
                    </View>
                  </TouchableOpacity>
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
              </>
            )}
          </KeyboardAwareScrollView>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 36 }]}>
          <Button
            title={saveLabel}
            onPress={handleSubmit}
            disabled={!isFormComplete || isSaving}
          />
        </View>
      </KeyboardAvoidingView>

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

      <DeleteDialogue
        visible={showDeleteDialogue}
        kind={kind}
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollHost: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  fieldInput: {
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
