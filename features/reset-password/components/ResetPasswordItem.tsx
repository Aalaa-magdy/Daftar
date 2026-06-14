import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import TextLinkButton from '@/components/ui/TextLinkButton';
import { colors } from '@/theme/colors';
import { getApiErrorMessage } from '@/lib/api-error';
import Mail01Icon from '@hugeicons/core-free-icons/Mail01Icon';
import SquareLockPasswordIcon from '@hugeicons/core-free-icons/SquareLockPasswordIcon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { PasswordDataType } from '../data/passwordData';
import ResetHeader from './ResetHeader';
import VerificationCodeInput from './VerificationCodeInput';
import { useTranslation } from 'react-i18next';
import {
  useForgotPassword,
  useVerifyResetCode,
  useResetPassword,
  useResendResetCode,
} from '../hooks';

const MIN_PASSWORD_LENGTH = 6;
const CODE_PATTERN = /^\d{4}$/;

interface Props {
  item: PasswordDataType;
  email: string;
  code: string;
  onEmailChange: (email: string) => void;
  onCodeChange: (code: string) => void;
  onBackPress?: () => void;
  onNext?: () => void;
  onDone?: () => void;
}

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const ResetPasswordItem: React.FC<Props> = ({
  item,
  email,
  code,
  onEmailChange,
  onCodeChange,
  onBackPress,
  onNext,
  onDone,
}) => {
  const { t } = useTranslation();

  const [emailError, setEmailError] = useState<string | undefined>();
  const { mutate: forgotPassword, isPending: isForgotPending } = useForgotPassword();

  const [codeError, setCodeError] = useState<string | undefined>();
  const { mutate: verifyCode, isPending: isVerifyPending } = useVerifyResetCode();
  const { mutate: resendCode, isPending: isResendPending } = useResendResetCode();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const { mutate: resetPassword, isPending: isResetPending } = useResetPassword();

  const trimmedEmail = email.trim();

  const handleForgotSubmit = () => {
    if (!trimmedEmail) {
      setEmailError(t('auth.emailRequired'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError(t('auth.invalidEmail'));
      return;
    }

    setEmailError(undefined);
    onEmailChange(trimmedEmail);
    onCodeChange('');

    forgotPassword(
      { email: trimmedEmail },
      {
        onSuccess: () => onNext?.(),
        onError: (error: AxiosError) => {
          setEmailError(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleVerifySubmit = () => {
    if (!trimmedEmail) {
      setCodeError(t('auth.emailRequired'));
      return;
    }
    if (!CODE_PATTERN.test(code)) {
      setCodeError(t('resetPassword.invalidCode'));
      return;
    }

    setCodeError(undefined);

    verifyCode(
      { email: trimmedEmail, code },
      {
        onSuccess: (data) => {
          if (data.success) {
            onNext?.();
            return;
          }
          setCodeError(data.message || t('resetPassword.invalidCode'));
        },
        onError: (error: AxiosError) => {
          setCodeError(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleResend = () => {
    if (isResendPending || !trimmedEmail) return;

    resendCode(
      { email: trimmedEmail },
      {
        onSuccess: () => {
          onCodeChange('');
          setCodeError(undefined);
          Alert.alert(t('common.success'), t('resetPassword.codeSentAgain'));
        },
        onError: (error: AxiosError) =>
          Alert.alert(t('common.error'), getApiErrorMessage(error)),
      },
    );
  };

  const handleResetSubmit = () => {
    if (!trimmedEmail || !CODE_PATTERN.test(code)) {
      setPasswordErrors({
        newPassword: t('resetPassword.sessionExpired'),
      });
      return;
    }

    const errors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      errors.newPassword = t('auth.passwordRequired');
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = t('auth.passwordMinLength');
    }

    if (!confirmPassword) {
      errors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    if (Object.keys(errors).length) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});

    resetPassword(
      { email: trimmedEmail, code, newPassword },
      {
        onSuccess: (data) => {
          Alert.alert(
            t('common.success'),
            data.message || t('resetPassword.success'),
            [{ text: t('common.continue'), onPress: () => onDone?.() }],
            { cancelable: false },
          );
        },
        onError: (error: AxiosError) => {
          setPasswordErrors({ newPassword: getApiErrorMessage(error) });
        },
      },
    );
  };

  const renderStepBody = () => {
    switch (item.type) {
      case 'forget':
        return (
          <View style={styles.stepBody}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('common.email')}{' '}
                <Text style={styles.star}>{t('common.required')}</Text>
              </Text>
              <Input
                placeholder={t('common.emailPlaceholder')}
                keyboardType="email-address"
                icon={fieldIcon(Mail01Icon)}
                containerStyle={styles.fieldInput}
                value={email}
                onChangeText={(text) => {
                  onEmailChange(text);
                  setEmailError(undefined);
                }}
                invalid={Boolean(emailError)}
                error={emailError}
              />
            </View>
            <View style={styles.buttonWrap}>
              <Button
                title={t('resetPassword.resetPassword')}
                onPress={handleForgotSubmit}
                disabled={isForgotPending}
              />
            </View>
          </View>
        );

      case 'check':
        return (
          <View style={styles.stepBody}>
            <VerificationCodeInput
              value={code}
              onChange={(val) => {
                onCodeChange(val);
                setCodeError(undefined);
              }}
              error={codeError}
            />
            <View style={styles.buttonWrap}>
              <Button
                title={t('resetPassword.verifyEmail')}
                onPress={handleVerifySubmit}
                disabled={isVerifyPending}
              />
            </View>
            <View style={styles.resendRow}>
              <Text style={styles.resendMuted}>
                {t('resetPassword.didntReceiveEmail')}{' '}
              </Text>
              <TextLinkButton
                title={t('common.resend')}
                variant="inline"
                onPress={handleResend}
              />
            </View>
          </View>
        );

      case 'verify':
        return (
          <View style={styles.stepBody}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('common.password')}{' '}
                <Text style={styles.star}>{t('common.required')}</Text>
              </Text>
              <PasswordInput
                placeholder={t('common.passwordPlaceholder')}
                icon={fieldIcon(SquareLockPasswordIcon)}
                containerStyle={styles.fieldInput}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                invalid={Boolean(passwordErrors.newPassword)}
                error={passwordErrors.newPassword}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t('common.confirmPassword')}{' '}
                <Text style={styles.star}>{t('common.required')}</Text>
              </Text>
              <PasswordInput
                placeholder={t('common.passwordPlaceholder')}
                icon={fieldIcon(SquareLockPasswordIcon)}
                containerStyle={styles.fieldInput}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                invalid={Boolean(passwordErrors.confirmPassword)}
                error={passwordErrors.confirmPassword}
              />
            </View>
            <View style={styles.buttonWrap}>
              <Button
                title={t('resetPassword.resetPasswordButton')}
                onPress={handleResetSubmit}
                disabled={isResetPending}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ResetHeader
        title={t(item.titleKey)}
        description={t(item.subtitleKey)}
        icon={item.icon}
        onBackPress={onBackPress}
        highlightText={item.type === 'check' ? trimmedEmail : undefined}
      />

      <KeyboardAwareScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={24}
      >
        {renderStepBody()}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    gap: 8,
    paddingBottom: 24,
  },
  stepBody: {
    gap: 8,
  },
  fieldGroup: {
    gap: 8,
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
    color: 'red',
  },
  buttonWrap: {
    marginTop: 16,
    width: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  resendMuted: {
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.captionMuted,
  },
});

export default ResetPasswordItem;
