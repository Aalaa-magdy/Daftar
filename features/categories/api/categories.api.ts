import { apiClient } from '@/lib/axios';
import { normalizeCategory, normalizeCategoryList } from '@/features/categories/lib/normalize-category';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/features/categories/types/categories.types';

function unwrapCategory(data: unknown): Category {
  if (data && typeof data === 'object' && 'data' in data) {
    const nested = normalizeCategory((data as { data: unknown }).data);
    if (nested) return nested;
  }

  const category = normalizeCategory(data);
  if (!category) {
    throw new Error('Invalid category response');
  }

  return category;
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const response = await apiClient.get<unknown>('/categories');
    return normalizeCategoryList(response.data);
  },

  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<unknown>(`/categories/${id}`);
    return unwrapCategory(response.data);
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<unknown>('/categories', data);
    return unwrapCategory(response.data);
  },

  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.patch<unknown>(`/categories/${id}`, data);
    return unwrapCategory(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
