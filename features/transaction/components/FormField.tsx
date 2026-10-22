import { colors } from '@/theme/colors';
import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

interface Props {
  label: string;
  required?: boolean;
  helper?: string;
  children: ReactNode;
}

const FormField = ({ label, required, helper, children }: Props) => (
  <View style={styles.group}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.star}> *</Text> : null}
    </Text>
    {children}
    {helper ? <Text style={styles.helper}>{helper}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  label: {
    fontFamily: 'Changa_400Regular',
    color: colors.black,
    fontSize: 17,
    lineHeight: 20,
  },
  star: {
    color: colors.red,
  },
  helper: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textGray,
  },
});

export default FormField;
