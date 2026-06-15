import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { categoriesApi } from '@/features/categories/api/categories.api';
import {
  Category,
  CreateCategoryRequest,
} from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError, CreateCategoryRequest>({
    mutationFn: (data) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
