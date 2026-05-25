import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import MoneyBag01Icon from '@hugeicons/core-free-icons/MoneyBag01Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


const patternSource = require('@/assets/images/background-pattern-decorative.png');

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

function formatPayday(date: Date): string {
 
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const SetSalary = () => {
   const router = useRouter()
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const [salary, setSalary] = useState('');
  const [payday, setPayday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const paydayDisplay = payday ? formatPayday(payday) : '';

  const isFormComplete = useMemo(
    () => salary.trim().length > 0 && payday !== null,
    [salary, payday]
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={patternSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Let's set your monthly salary"
          subtitle="This helps us understand your spending and organize your finances better."
        />

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Monthly Salary <Text style={styles.star}>*</Text>
            </Text>
            <Input
              placeholder="Enter amount"
              keyboardType="numeric"
              value={salary}
              onChangeText={setSalary}
              icon={fieldIcon(MoneyBag01Icon)}
              containerStyle={styles.fieldInput}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Payday <Text style={styles.star}>*</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowDatePicker((open) => !open)}
            >
              <View pointerEvents="none">
                <Input
                  placeholder="DD/MM/YYYY"
                  value={paydayDisplay}
                  icon={fieldIcon(Calendar03Icon)}
                  containerStyle={styles.fieldInput}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Your balance resets on this day each month.
            </Text>
          </View>

          <View style={styles.buttonWrap}>
            <Button
              title="Continue"
              disabled={!isFormComplete}
              onPress={() => {
                if (!isFormComplete) return;
                router.push("/home")
                // TODO: persist salary + payday and navigate onward
              }}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.pickerModalRoot}>
          <Pressable
            style={styles.pickerBackdrop}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.pickerOverlay} pointerEvents="box-none">
            <DatePicker
              value={payday}
              onChange={(date) => {
                setPayday(date);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    height: '60%',
    width: '100%',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 8,
  },
  form: {
    gap: 8,
    marginTop: 8,
  },
  fieldGroup: {
    gap: 8,
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
    color: 'red',
  },
  helperText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textGray,
  },
  buttonWrap: {
    marginTop: 16,
    width: '100%',
  },
  pickerModalRoot: {
    flex: 1,
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 10, 0.25)',
  },
  pickerOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default SetSalary;
