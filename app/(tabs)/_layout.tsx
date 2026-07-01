import Navbar, { type NavTab } from '@/features/home/components/Navbar';
import { addTransactionHref } from '@/features/transaction/lib/transaction-links';
import { Tabs, useRouter } from 'expo-router';

const TAB_ROUTE_NAMES = ['home', 'history', 'statistics', 'profile'] as const;

function isNavTab(name: string): name is NavTab {
  return TAB_ROUTE_NAMES.includes(name as NavTab);
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => {
        const routeName = props.state.routes[props.state.index]?.name ?? 'home';
        const activeTab = isNavTab(routeName) ? routeName : 'home';

        return (
          <Navbar
            activeTab={activeTab}
            onTabPress={(tab) => {
              props.navigation.navigate(tab);
            }}
            onAddPress={() => router.push(addTransactionHref('expense'))}
          />
        );
      }}
      screenOptions={{
        headerShown: false,
        lazy: false,
        animation: 'none',
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
