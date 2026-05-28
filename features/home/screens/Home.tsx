import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../components/HomeHeader';
import HomeInfo from '../components/HomeInfo';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import TextLinkButton from '@/components/ui/TextLinkButton';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <HomeInfo />
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.actionButton, styles.expenseButton]} activeOpacity={0.8}>
            <HugeiconsIcon icon={Add01Icon} size={24} color={colors.primary} />
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.incomeButton]} activeOpacity={0.8}>
            <HugeiconsIcon icon={Add01Icon} size={24} color={colors.primary} />
            <Text style={styles.buttonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.intro}>
          <Text style={styles.introText}>History</Text>
          <View style={styles.viewAllButton}>
            <TextLinkButton title="View All" />
          </View>
        </View>
        <TransactionCard type="expense" />
        <TransactionCard type="income" />
      </ScrollView>
      <Navbar activeTab="home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    width: '90%',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',   
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  expenseButton: {
    borderColor: colors.border,
  },
  incomeButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
  },
  intro: {
    width: "94%",
    flexDirection: "row",
    justifyContent: "space-between", // Changed from alignContent to justifyContent
    alignItems: "center", // Added to vertically center items
    marginTop: 10,
    paddingHorizontal:12,
  },
  introText: {
    fontFamily: "Changa_500Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  viewAllButton: {
    // Ensures the button aligns to the right
    alignSelf: "flex-end",
  }
});

export default Home;