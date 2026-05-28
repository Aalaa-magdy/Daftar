import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import AnalyticsUpIcon from '@hugeicons/core-free-icons/AnalyticsUpIcon';
import DollarCircleIcon from '@hugeicons/core-free-icons/DollarCircleIcon';
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon';
import User03Icon from '@hugeicons/core-free-icons/User03Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NavTab = 'home' | 'history' | 'statistics' | 'profile';

interface Props {
  activeTab?: NavTab;
  onTabPress?: (tab: NavTab) => void;
  onAddPress?: () => void;
}

type TabConfig = {
  id: NavTab;
  label: string;
  icon: IconSvgElement;
};

const LEFT_TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: Home01Icon },
  { id: 'history', label: 'History', icon: DollarCircleIcon },
];

const RIGHT_TABS: TabConfig[] = [
  { id: 'statistics', label: 'Statistics', icon: AnalyticsUpIcon },
  { id: 'profile', label: 'Profile', icon: User03Icon },
];

const ICON_SIZE = 24;

const Navbar = ({
  activeTab = 'history',
  onTabPress,
  onAddPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<NavTab>(activeTab);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  if (!fontsLoaded) {
    return null;
  }

  const handleTabPress = (tab: NavTab) => {
    setSelectedTab(tab);
    onTabPress?.(tab);
  };

  const renderTab = (tab: TabConfig) => {
    const isActive = selectedTab === tab.id;

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => handleTabPress(tab.id)}
      >
        <HugeiconsIcon
          icon={tab.icon}
          size={ICON_SIZE}
          color={isActive ? colors.primary : colors.textSecondary}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.fabNotch} pointerEvents="none" />
      <View style={styles.bar}>
        <View style={styles.side}>{LEFT_TABS.map(renderTab)}</View>
        <View style={styles.side}>{RIGHT_TABS.map(renderTab)}</View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add transaction"
        android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 28 }}
      >
        <HugeiconsIcon icon={Add01Icon} size={36} color={colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabNotch: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 50,
    height: 36,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 0,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 56,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Changa_400Regular',
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: 'Changa_500Medium',
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  fabPressed: {
    opacity: 0.9,
  },
});

export default Navbar;
 