import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
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
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/features/transaction/components/FormField';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import DeleteAccountDialogue from '../components/DeleteAccountDialogue';
import { PROFILE_USER } from '../data/profile-menu';

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const EditProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState(PROFILE_USER.name);
  const [email, setEmail] = useState(PROFILE_USER.email);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const isEmailVerified =
    email.trim().toLowerCase() === PROFILE_USER.email.toLowerCase();

  const goToVerifyEmail = () => {
    router.push({ pathname: '/verify-email', params: { email } });
  };

  const handleSave = () => {
    goToVerifyEmail();
  };

  const handleDeleteAccount = () => {
    setDeleteVisible(false);
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TransactionHeader
          title="Edit Profile Information"
          onBack={() => router.back()}
        />

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image source={PROFILE_USER.avatar} style={styles.avatar} />
          </View>

          <TouchableOpacity
            style={styles.changePhotoButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={16} color={colors.primary} />
            <Text style={styles.changePhotoText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <FormField label="Name">
            <Input
              value={name}
              onChangeText={setName}
              icon={fieldIcon(User03Icon)}
              containerStyle={styles.inputNoMargin}
            />
          </FormField>

          <FormField label="Email">
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={fieldIcon(Mail01Icon)}
              containerStyle={styles.inputNoMargin}
            />
            <View style={styles.emailStatusRow}>
              {isEmailVerified ? (
                <Text style={styles.verifiedText}>Verified</Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  accessibilityRole="link"
                  accessibilityLabel="Verify email"
                  onPress={goToVerifyEmail}
                >
                  <Text style={styles.verifyLink}>Verify Email</Text>
                </TouchableOpacity>
              )}
            </View>
          </FormField>
        </View>

        <TouchableOpacity
          style={styles.deleteAccount}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Delete account"
          onPress={() => setDeleteVisible(true)}
        >
          <HugeiconsIcon icon={Delete02Icon} size={20} color={colors.red} />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>

        <Button title="Save Changes" onPress={handleSave} />
      </ScrollView>

      <DeleteAccountDialogue
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={handleDeleteAccount}
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
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
