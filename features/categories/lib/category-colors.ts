const HEX_SHORT = /^#([0-9A-Fa-f]{3})$/;
const HEX_FULL = /^#([0-9A-Fa-f]{6})$/;

function normalizeHex(color: string): string | null {
  const trimmed = color.trim();

  const shortMatch = trimmed.match(HEX_SHORT);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  const fullMatch = trimmed.match(HEX_FULL);
  if (fullMatch) {
    return `#${fullMatch[1].toUpperCase()}`;
  }

  return null;
}

/** Light tint used when a category chip is selected. */
export function getCategoryBackgroundColor(color: string, alpha = 0.12): string {
  const hex = normalizeHex(color);
  if (!hex) return '#FFFFFF';

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Border color for selected category chip — same as the category color. */
export function getCategoryBorderColor(color: string): string {
  return normalizeHex(color) ?? color.trim();
}

export function getCategorySelectedStyles(color: string) {
  return {
    backgroundColor: getCategoryBackgroundColor(color),
    borderColor: getCategoryBorderColor(color),
  };
}

/** Unselected chip — white background and border (add-transaction grid). */
export function getCategoryUnselectedStyles() {
  return {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  } as const;
}

/** API payload color fields — always strings for create/update requests. */
export function buildCategoryColorPayload(color: string) {
  const borderColor = getCategoryBorderColor(color);
  const backgroundColor = getCategoryBackgroundColor(borderColor);

  return {
    color: borderColor,
    backgroundColor,
    borderColor,
  };
}

export const CATEGORY_COLOR_OPTIONS = [
  '#1B5E20',
  '#C9A227',
  '#F04438',
  '#F63D68',
  '#7A5AF8',
  '#717680',
] as const;
