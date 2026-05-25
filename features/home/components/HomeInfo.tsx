import ProgressBar from '@/components/ui/ProgressBar';
import { colors } from '@/theme/colors';
import { StyleSheet, View } from 'react-native';

const HomeInfo = () => {
  return (
    <View style={styles.container}>
      <ProgressBar progress={0.5} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

export default HomeInfo;