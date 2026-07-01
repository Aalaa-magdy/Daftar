import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoriesApi } from '@/features/categories/api/categories.api';
import { buildCategoryColorPayload } from '@/features/categories/lib/category-colors';
import { DEFAULT_CATEGORY_DEFINITIONS } from '@/features/categories/lib/default-categories';
import type { Category } from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

const SEED_STORAGE_KEY = '@daftr/default-categories-seeded';

type Params = {
  categories: Category[] | undefined;
  isSuccess: boolean;
  isAuthenticated: boolean;
};

export function useSeedDefaultCategories({
  categories,
  isSuccess,
  isAuthenticated,
}: Params) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isRunning = useRef(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isSuccess ||
      categories === undefined ||
      categories.length > 0 ||
      isRunning.current
    ) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const alreadySeeded = await AsyncStorage.getItem(SEED_STORAGE_KEY);
      if (alreadySeeded === 'true' || cancelled) {
        return;
      }

      isRunning.current = true;
      setIsSeeding(true);

      try {
        await Promise.all(
          DEFAULT_CATEGORY_DEFINITIONS.map((definition) => {
            const colorFields = buildCategoryColorPayload(definition.color);

            return categoriesApi.create({
              name: t(`transaction.categories.${definition.nameKey}`),
              icon: definition.faIcon,
              ...colorFields,
            });
          }),
        );

        if (cancelled) {
          return;
        }

        await AsyncStorage.setItem(SEED_STORAGE_KEY, 'true');
        await queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      } catch {
        // Leave unseeded so the next successful fetch can retry.
      } finally {
        isRunning.current = false;
        if (!cancelled) {
          setIsSeeding(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categories, isAuthenticated, isSuccess, queryClient, t]);

  return { isSeeding };
}
