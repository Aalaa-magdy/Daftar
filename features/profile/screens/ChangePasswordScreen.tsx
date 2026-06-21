import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import { useChangePassword } from '@/features/auth/hooks';
import ResetHeader from '@/features/reset-password/components/ResetHeader';
import { getApiErrorMessage } from '@/lib/api-error';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import SquareLockPasswordIcon from '@hugeicons/core-free-icons/SquareLockPasswordIcon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_PASSWORD_LENGTH = 6;

type FieldErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const ChangePasswordScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = t('profile.currentPasswordRequired');
    }

    if (!newPassword) {
      nextErrors.newPassword = t('auth.passwordRequired');
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = t('auth.passwordMinLength');
    } else if (newPassword === currentPassword) {
      nextErrors.newPassword = t('profile.newPasswordMustDiffer');
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    changePassword(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          router.replace({
            pathname: '/profile',
            params: { passwordChanged: 'true' },
          });
        },
        onError: (error: AxiosError) => {
          const message = getApiErrorMessage(
            error,
            t('profile.changePasswordError'),
          );

          if (message.toLowerCase().includes('current password')) {
            setErrors((prev) => ({
              ...prev,
              currentPassword: message,
            }));
            return;
          }

          Alert.alert(t('common.error'), message, [{ text: t('common.dismiss') }]);
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ResetHeader
        title={t('resetPassword.setNewPasswordTitle')}
        description={t('resetPassword.setNewPasswordSubtitle')}
        icon={SquareLockPasswordIcon}
        onBackPress={() => router.back()}
        whiteBackground
      />

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            {t('profile.currentPassword')}{' '}
            <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              clearFieldError('currentPassword');
            }}
            invalid={Boolean(errors.currentPassword)}
            error={errors.currentPassword}
          />
        </View>

        <View style={[styles.fieldGroup, styles.fieldGroupSpaced]}>
          <Text style={styles.label}>
            {t('profile.newPassword')}{' '}
            <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              clearFieldError('newPassword');
            }}
            invalid={Boolean(errors.newPassword)}
            error={errors.newPassword}
          />
        </View>

        <View style={[styles.fieldGroup, styles.fieldGroupSpaced]}>
          <Text style={styles.label}>
            {t('profile.confirmNewPassword')}{' '}
            <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearFieldError('confirmPassword');
            }}
            invalid={Boolean(errors.confirmPassword)}
            error={errors.confirmPassword}
          />
        </View>

        <View style={styles.buttonWrap}>
          <Button
            title={t('profile.updatePassword')}
            onPress={handleUpdate}
            disabled={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContent: {
    gap: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldGroupSpaced: {
    marginTop: 8,
  },
  fieldInput: {
    marginBottom: 0,
  },
  label: {
    fontFamily: 'Changa_400Regular',
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
  },
  star: {
    color: colors.red,
  },
  buttonWrap: {
    marginTop: 16,
    width: '100%',
  },
});

export default ChangePasswordScreen;
