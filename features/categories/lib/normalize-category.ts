import { Category } from '@/features/categories/types/categories.types';

export function normalizeCategory(raw: unknown): Category | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = record.id ?? record._id;

  if (id == null || id === '') return null;

  return {
    id: String(id),
    name: String(record.name ?? ''),
    color: String(record.color ?? '#717680'),
    icon: String(record.icon ?? ''),
    backgroundColor:
      record.backgroundColor != null ? String(record.backgroundColor) : undefined,
    borderColor:
      record.borderColor != null ? String(record.borderColor) : undefined,
    createdAt:
      record.createdAt != null ? String(record.createdAt) : undefined,
    updatedAt:
      record.updatedAt != null ? String(record.updatedAt) : undefined,
  };
}

export function normalizeCategoryList(data: unknown): Category[] {
  const list = extractCategoryArray(data);

  const seen = new Set<string>();
  const normalized: Category[] = [];

  for (const item of list) {
    const category = normalizeCategory(item);
    if (!category || seen.has(category.id)) continue;
    seen.add(category.id);
    normalized.push(category);
  }

  return normalized;
}

function extractCategoryArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const nested = record.data ?? record.categories ?? record.items;

    if (Array.isArray(nested)) return nested;
  }

  return [];
}
