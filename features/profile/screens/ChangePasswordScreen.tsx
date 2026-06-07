import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import ResetHeader from '@/features/reset-password/components/ResetHeader';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import SquareLockPasswordIcon from '@hugeicons/core-free-icons/SquareLockPasswordIcon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const ChangePasswordScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleUpdate = () => {
    router.replace({ pathname: '/profile', params: { passwordChanged: 'true' } });
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
            {t('profile.currentPassword')} <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
          />
        </View>

        <View style={[styles.fieldGroup, styles.fieldGroupSpaced]}>
          <Text style={styles.label}>
            {t('profile.newPassword')} <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
          />
        </View>

        <View style={[styles.fieldGroup, styles.fieldGroupSpaced]}>
          <Text style={styles.label}>
            {t('profile.confirmNewPassword')} <Text style={styles.star}>{t('common.required')}</Text>
          </Text>
          <PasswordInput
            placeholder={t('common.passwordPlaceholder')}
            icon={fieldIcon(SquareLockPasswordIcon)}
            containerStyle={styles.fieldInput}
          />
        </View>

        <View style={styles.buttonWrap}>
          <Button title={t('profile.updatePassword')} onPress={handleUpdate} />
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
