import { colors } from '@/theme/colors';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import MinusSignIcon from '@hugeicons/core-free-icons/MinusSignIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import type { FaqItemData } from '../data/faq-items';

interface Props {
  item: FaqItemData;
  expanded: boolean;
  onToggle: () => void;
  showDivider?: boolean;
}

const FaqItem = ({ item, expanded, onToggle, showDivider = true }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={styles.iconCircle}>
          <HugeiconsIcon
            icon={expanded ? MinusSignIcon : Add01Icon}
            size={16}
            color={colors.textSecondary}
          />
        </View>
        <Text style={styles.question}>{t(item.questionKey)}</Text>
      </TouchableOpacity>

      {expanded ? <Text style={styles.answer}>{t(item.answerKey)}</Text> : null}

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  question: {
    flex: 1,
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  answer: {
    marginTop: 10,
    marginLeft: 40,
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    paddingBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 16,
  },
});

export default FaqItem;
