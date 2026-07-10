import Button from '@/components/ui/Button';
import TransactionHeader from '@/features/transaction/components/TransactionHeader';
import { changeAppLanguage } from '@/lib/i18n';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageNoteCard from '@/features/profile/components/LanguageNoteCard';
import LanguageOptionRow from '@/features/profile/components/LanguageOptionRow';
import { LANGUAGE_OPTIONS, type LanguageId } from '@/features/profile/data/languages';
import i18n from '@/lib/i18n';

const LanguageScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(
    i18n.language === 'ar' ? 'ar' : 'en',
  );

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    setSelectedLanguage(i18n.language === 'ar' ? 'ar' : 'en');
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSave = async () => {
    await changeAppLanguage(selectedLanguage);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransactionHeader
          title={t('profile.languageTitle')}
          onBack={() => router.back()}
        />

        <LanguageNoteCard />

        <View style={styles.list}>
          {LANGUAGE_OPTIONS.map((option, index) => (
            <LanguageOptionRow
              key={option.id}
              label={t(option.labelKey)}
              selected={selectedLanguage === option.id}
              onPress={() => setSelectedLanguage(option.id)}
              showDivider={index < LANGUAGE_OPTIONS.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 44 }]}>
        <Button title={t('common.saveChanges')} onPress={handleSave} />
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
    backgroundColor: colors.white,
  },
});

export default LanguageScreen;
