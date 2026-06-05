import Navbar from '@/features/home/components/Navbar';
import { useNavbarNavigation } from '@/features/home/hooks/useNavbarNavigation';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Logout03Icon from '@hugeicons/core-free-icons/Logout03Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutDialogue from '../components/LogoutDialogue';
import ProfileMenuSection from '../components/ProfileMenuSection';
import ProfileUserCard from '../components/ProfileUserCard';
import { PROFILE_MENU_SECTIONS } from '../data/profile-menu';

const Profile = () => {
  const router = useRouter();
  const { onTabPress, onAddPress } = useNavbarNavigation('profile');
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogout = () => {
    setLogoutVisible(false);
    router.replace('/signin');
  };

  const handleMenuPress = (itemId: string) => {
    if (itemId === 'edit-profile') {
      router.push('/edit-profile');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <ProfileUserCard />

        {PROFILE_MENU_SECTIONS.map((section) => (
          <ProfileMenuSection
            key={section.id}
            section={section}
            onItemPress={handleMenuPress}
          />
        ))}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={() => setLogoutVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutText}>Log out</Text>
          <HugeiconsIcon icon={Logout03Icon} size={20} color={colors.red} />
        </TouchableOpacity>
      </ScrollView>

      <Navbar
        activeTab="profile"
        onTabPress={onTabPress}
        onAddPress={onAddPress}
      />

      <LogoutDialogue
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
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
    paddingTop: 8,
    paddingBottom: 96,
    gap: 20,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 28,
    color: colors.black,
    marginBottom: 4,
    marginLeft: 4,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: `${colors.red}66`,
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  logoutText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.red,
  },
});

export default Profile;
