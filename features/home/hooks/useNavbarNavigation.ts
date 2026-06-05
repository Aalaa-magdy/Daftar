import { addTransactionHref } from '@/features/transaction/lib/transaction-links';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { NavTab } from '../components/Navbar';

const TAB_ROUTES: Partial<Record<NavTab, Href>> = {
  home: '/home',
  history: '/history',
  statistics: '/statistics',
};

export function useNavbarNavigation(activeTab: NavTab) {
  const router = useRouter();

  const onTabPress = (tab: NavTab) => {
    if (tab === activeTab) return;

    const href = TAB_ROUTES[tab];
    if (href) {
      router.push(href);
    }
  };

  const onAddPress = () => {
    router.push(addTransactionHref('expense'));
  };

  return { onTabPress, onAddPress };
}
