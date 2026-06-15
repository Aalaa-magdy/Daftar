import { resolveInitialRoute } from '@/features/auth/lib/app-session';
import { colors } from '@/theme/colors';
import { Redirect, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

/** Native Android splash only — routing happens here after session check. */
export default function Index() {
  const [initialRoute, setInitialRoute] = useState<Href | null>(null);

  useEffect(() => {
    resolveInitialRoute().then(setInitialRoute);
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={initialRoute} />;
}

const styles = {
  loader: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.background,
  },
};
