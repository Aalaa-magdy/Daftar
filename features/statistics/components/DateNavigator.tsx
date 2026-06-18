import { useAppDirection } from '@/hooks/useAppDirection';
import { colors } from '@/theme/colors';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
}

const DateNavigator = ({ label, onPrevious, onNext }: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();

  const PreviousIcon = isRTL ? ArrowRight01Icon : ArrowLeft01Icon;
  const NextIcon = isRTL ? ArrowLeft01Icon : ArrowRight01Icon;

  return (
    <View style={styles.row}>
      <View style={styles.group}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('statistics.previousPeriod')}
          onPress={onPrevious}
        >
          <HugeiconsIcon icon={PreviousIcon} size={24} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('statistics.nextPeriod')}
          onPress={onNext}
        >
          <HugeiconsIcon icon={NextIcon} size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.black,
  },
});

export default DateNavigator;
