import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormField from '@/features/transaction/components/FormField';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import Mail01Icon from '@hugeicons/core-free-icons/Mail01Icon';
import PencilEdit02Icon from '@hugeicons/core-free-icons/PencilEdit02Icon';
import User03Icon from '@hugeicons/core-free-icons/User03Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteAccountDialogue from '../components/DeleteAccountDialogue';
import {
  useDeleteAccount,
  useProfile,
  useUploadProfilePicture,
} from '../hooks';
import { pickProfilePicture } from '../lib/pick-profile-picture';
import { resolveProfileAvatarSource } from '../lib/profile-avatar';

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const EditProfileScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { mutate: uploadProfilePicture, isPending: isUploadingPicture } =
    useUploadProfilePicture();
  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setAvatarUri(profile.profilePicture ?? null);
  }, [profile]);

  if (!fontsLoaded) {
    return null;
  }

  const isEmailVerified = profile?.isEmailVerified ?? false;

  const goToVerifyEmail = () => {
    router.push({ pathname: '/verify-email', params: { email } });
  };

  const handleSave = () => {
    goToVerifyEmail();
  };

  const handleChangePhoto = async () => {
    const result = await pickProfilePicture();

    if (result.status === 'cancelled') {
      return;
    }

    if (result.status === 'permission_denied') {
      Alert.alert(
        t('common.error'),
        t('profile.profilePicturePermissionDenied'),
      );
      return;
    }

    uploadProfilePicture(result.asset, {
      onSuccess: (updatedProfile) => {
        setAvatarUri(updatedProfile.profilePicture ?? result.asset.uri);
      },
      onError: () => {
        Alert.alert(t('common.error'), t('profile.profilePictureUploadError'));
      },
    });
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        setDeleteVisible(false);
        router.replace('/signin' as Href);
      },
      onError: () => {
        setDeleteVisible(false);
        Alert.alert(t('common.error'), t('profile.deleteAccountError'));
      },
    });
  };

  const avatarSource = resolveProfileAvatarSource(avatarUri);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TransactionHeader
          title={t('profile.editProfileTitle')}
          onBack={() => router.back()}
        />

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            {isProfileLoading ? (
              <ActivityIndicator color={colors.primary} style={styles.avatarLoader} />
            ) : (
              <Image source={avatarSource} style={styles.avatar} />
            )}
            {isUploadingPicture ? (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.changePhotoButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('profile.changeProfilePictureA11y')}
            onPress={handleChangePhoto}
            disabled={isUploadingPicture}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={16} color={colors.primary} />
            <Text style={styles.changePhotoText}>{t('profile.changeProfilePicture')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <FormField label={t('common.name')}>
            <Input
              value={name}
              onChangeText={setName}
              icon={fieldIcon(User03Icon)}
              containerStyle={styles.inputNoMargin}
            />
          </FormField>

          <FormField label={t('common.email')}>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={fieldIcon(Mail01Icon)}
              containerStyle={styles.inputNoMargin}
            />
            <View style={styles.emailStatusRow}>
              {isEmailVerified ? (
                <Text style={styles.verifiedText}>{t('common.verified')}</Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  accessibilityRole="link"
                  accessibilityLabel={t('profile.verifyEmailA11y')}
                  onPress={goToVerifyEmail}
                >
                  <Text style={styles.verifyLink}>{t('profile.verifyEmail')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </FormField>
        </View>

        <TouchableOpacity
          style={styles.deleteAccount}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('profile.deleteAccountA11y')}
          onPress={() => setDeleteVisible(true)}
          disabled={isDeletingAccount}
        >
          <HugeiconsIcon icon={Delete02Icon} size={20} color={colors.red} />
          <Text style={styles.deleteAccountText}>{t('profile.deleteAccount')}</Text>
        </TouchableOpacity>

        <Button title={t('common.saveChanges')} onPress={handleSave} />
      </ScrollView>

      <DeleteAccountDialogue
        visible={deleteVisible}
        onClose={() => !isDeletingAccount && setDeleteVisible(false)}
        onConfirm={handleDeleteAccount}
        isConfirming={isDeletingAccount}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 10,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarLoader: {
    flex: 1,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
  form: {
    gap: 20,
    marginBottom: 28,
  },
  inputNoMargin: {
    marginBottom: 0,
  },
  emailStatusRow: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  verifiedText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  verifyLink: {
    fontFamily: 'Changa_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  deleteAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
    paddingVertical: 8,
  },
  deleteAccountText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.red,
    textDecorationLine: 'underline',
  },
});

export default EditProfileScreen;
