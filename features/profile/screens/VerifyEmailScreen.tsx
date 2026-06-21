import Button from '@/components/ui/Button';
import TextLinkButton from '@/components/ui/TextLinkButton';
import { getApiErrorMessage } from '@/lib/api-error';
import ResetHeader from '@/features/reset-password/components/ResetHeader';
import VerificationCodeInput from '@/features/reset-password/components/VerificationCodeInput';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import NewReleasesIcon from '@hugeicons/core-free-icons/NewReleasesIcon';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile, useRequestEmailVerification, useVerifyEmail } from '../hooks';

const CODE_PATTERN = /^\d{4}$/;

const VerifyEmailScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const { data: profile } = useProfile();

  const displayEmail = (emailParam ?? profile?.email ?? '').trim();
  const isAlreadyVerified =
    Boolean(profile?.isEmailVerified) &&
    displayEmail === (profile?.email.trim() ?? '');

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const hasRequestedRef = useRef(false);

  const { mutate: requestVerification, isPending: isRequestingVerification } =
    useRequestEmailVerification();
  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail();

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    if (!displayEmail || hasRequestedRef.current || isAlreadyVerified) return;

    hasRequestedRef.current = true;
    requestVerification(
      { email: displayEmail },
      {
        onError: (error: AxiosError) => {
          const message = getApiErrorMessage(error, '');

          if (message.toLowerCase().includes('already verified')) {
            Alert.alert(t('common.success'), t('profile.emailVerifiedSuccess'), [
              { text: 'OK', onPress: () => router.back() },
            ]);
            return;
          }

          Alert.alert(
            t('common.error'),
            getApiErrorMessage(error, t('profile.requestVerificationError')),
          );
        },
      },
    );
  }, [displayEmail, isAlreadyVerified, requestVerification, router, t]);

  if (!fontsLoaded) {
    return null;
  }

  const handleVerifySubmit = () => {
    if (!CODE_PATTERN.test(code)) {
      setCodeError(t('resetPassword.invalidCode'));
      return;
    }

    setCodeError(undefined);
    verifyEmail(
      {
        code,
        pendingEmail:
          profile && displayEmail !== profile.email.trim()
            ? displayEmail
            : undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('profile.emailVerifiedSuccess'), [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: (error: AxiosError) => {
          setCodeError(getApiErrorMessage(error, t('profile.verifyEmailError')));
        },
      },
    );
  };

  const handleResend = () => {
    if (!displayEmail || isAlreadyVerified) return;

    requestVerification(
      { email: displayEmail },
      {
        onSuccess: () => {
          Alert.alert(t('common.success'), t('resetPassword.codeSentAgain'));
        },
        onError: (error: AxiosError) => {
          const message = getApiErrorMessage(error, '');

          if (message.toLowerCase().includes('already verified')) {
            Alert.alert(t('common.success'), t('profile.emailVerifiedSuccess'), [
              { text: 'OK', onPress: () => router.back() },
            ]);
            return;
          }

          Alert.alert(
            t('common.error'),
            getApiErrorMessage(error, t('profile.requestVerificationError')),
          );
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <ResetHeader
          title={t('resetPassword.checkEmailTitle')}
          description={t('resetPassword.checkEmailSubtitle')}
          icon={NewReleasesIcon}
          onBackPress={() => router.back()}
          highlightText={displayEmail}
          whiteBackground
        />

        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <VerificationCodeInput
            value={code}
            onChange={(value) => {
              setCode(value);
              setCodeError(undefined);
            }}
            error={codeError}
          />
          <View style={styles.buttonWrap}>
            <Button
              title={t('profile.verifyEmail')}
              onPress={handleVerifySubmit}
              disabled={isVerifyingEmail || isRequestingVerification}
            />
          </View>
          <View style={styles.resendRow}>
            <Text style={styles.resendMuted}>{t('resetPassword.didntReceiveEmail')} </Text>
            <TextLinkButton
              title={t('common.resend')}
              variant="inline"
              onPress={handleResend}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    gap: 8,
    paddingBottom: 24,
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

export default VerifyEmailScreen;
