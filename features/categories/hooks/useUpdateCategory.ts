import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { categoriesApi } from '@/features/categories/api/categories.api';
import {
  Category,
  UpdateCategoryRequest,
} from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

type UpdateCategoryVariables = {
  id: string;
  data: UpdateCategoryRequest;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError, UpdateCategoryVariables>({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
};
