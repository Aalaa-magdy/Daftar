import type { QueryClient } from '@tanstack/react-query';
import { profileKeys } from '../hooks/query-keys';

export function invalidateProfileQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: profileKeys.me,
    refetchType: 'all',
  });
}
