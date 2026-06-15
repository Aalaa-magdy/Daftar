import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { categoriesApi } from '@/features/categories/api/categories.api';
import { Category } from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

export const useCategory = (id: string | null) => {
  return useQuery<Category, AxiosError>({
    queryKey: categoryKeys.detail(id ?? ''),
    queryFn: () => categoriesApi.getById(id!),
    enabled: Boolean(id),
  });
};
