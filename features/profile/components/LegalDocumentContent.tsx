import { colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import type { LegalDocumentConfig } from '../data/legal-documents';

interface Props {
  document: LegalDocumentConfig;
}

const LegalDocumentContent = ({ document }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.documentTitle}>{t(document.documentTitleKey)}</Text>
      <Text style={styles.intro}>{t(document.introKey)}</Text>

      {document.sections.map((section) => (
        <View key={section.number} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {section.number}. {t(section.titleKey)}
          </Text>

          {section.introKey ? (
            <Text style={styles.sectionIntro}>{t(section.introKey)}</Text>
          ) : null}

          {section.bulletKeys.map((bulletKey) => (
            <View key={bulletKey} style={styles.bulletRow}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletText}>{t(bulletKey)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  documentTitle: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 26,
    color: colors.black,
  },
  intro: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  sectionIntro: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 4,
  },
  bulletMarker: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});

export default LegalDocumentContent;
