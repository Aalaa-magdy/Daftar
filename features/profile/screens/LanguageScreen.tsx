import Button from '@/components/ui/Button';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LanguageNoteCard from '@/features/profile/components/LanguageNoteCard';
import LanguageOptionRow from '@/features/profile/components/LanguageOptionRow';
import { LANGUAGE_OPTIONS, type LanguageId } from '@/features/profile/data/languages';

const LanguageScreen = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('en');

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransactionHeader title="Language" onBack={() => router.back()} />

        <LanguageNoteCard />

        <View style={styles.list}>
          {LANGUAGE_OPTIONS.map((option, index) => (
            <LanguageOptionRow
              key={option.id}
              label={option.label}
              selected={selectedLanguage === option.id}
              onPress={() => setSelectedLanguage(option.id)}
              showDivider={index < LANGUAGE_OPTIONS.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save Changes" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    gap: 16,
  },
  list: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
});

export default LanguageScreen;
