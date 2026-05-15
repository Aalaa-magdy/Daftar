import { colors } from '@/theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Placeholder route for Sign in — replace with real auth screen when ready. */
export default function SignInRoute() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.box}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  box: { alignItems: 'center', gap: 8 },
  title: {
    fontSize: 22,
    fontFamily: 'Changa_500Medium',
    color: colors.primary,
  },
  sub: {
    fontSize: 16,
    fontFamily: 'Changa_400Regular',
    color: colors.textGray,
  },
});
