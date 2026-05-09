import { 
  type BuilderBlock, 
  type PageSettings, 
  type ThemeColors, 
  type FontFamily,
  DEFAULT_PAGE_SETTINGS,
  DEFAULT_FONT_FAMILY
} from "@/store/builder-store";

/**
 * Checks if a value is a plain object
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Formats a string into a URL-friendly slug
 */
export function formatSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalizes page settings with defaults and validation
 */
export function normalizePageSettings(value: unknown): PageSettings {
  if (!isRecord(value)) return DEFAULT_PAGE_SETTINGS;

  return {
    title:
      typeof value.title === "string" && value.title.trim().length > 0
        ? value.title.trim()
        : DEFAULT_PAGE_SETTINGS.title,
    slug:
      typeof value.slug === "string" && value.slug.trim().length > 0
        ? formatSlug(value.slug) || DEFAULT_PAGE_SETTINGS.slug
        : DEFAULT_PAGE_SETTINGS.slug,
    seoDescription:
      typeof value.seoDescription === "string"
        ? value.seoDescription.slice(0, 160)
        : DEFAULT_PAGE_SETTINGS.seoDescription,
    showHeader:
      typeof value.showHeader === "boolean"
        ? value.showHeader
        : DEFAULT_PAGE_SETTINGS.showHeader,
    showFooter:
      typeof value.showFooter === "boolean"
        ? value.showFooter
        : DEFAULT_PAGE_SETTINGS.showFooter,
  };
}

/**
 * Normalizes font family to supported options
 */
export function normalizeFontFamily(value: unknown): FontFamily {
  const supported: FontFamily[] = ["system", "cairo", "tajawal", "almarai"];
  if (typeof value === "string" && supported.includes(value as FontFamily)) {
    return value as FontFamily;
  }
  return DEFAULT_FONT_FAMILY;
}

/**
 * Normalizes theme colors with defaults
 */
const DEFAULT_THEME_COLORS: ThemeColors = {
  accent: "#f05151",
  background: "#ffffff",
  foreground: "#111827",
  muted: "#f9fafb",
};

export function normalizeThemeColors(value: unknown): ThemeColors {
  if (!isRecord(value)) return DEFAULT_THEME_COLORS;

  return {
    accent: typeof value.accent === "string" ? value.accent : DEFAULT_THEME_COLORS.accent,
    background: typeof value.background === "string" ? value.background : DEFAULT_THEME_COLORS.background,
    foreground: typeof value.foreground === "string" ? value.foreground : DEFAULT_THEME_COLORS.foreground,
    muted: typeof value.muted === "string" ? value.muted : DEFAULT_THEME_COLORS.muted,
  };
}

/**
 * Validates the shape of a block during import
 */
export function isImportBlock(value: unknown): value is BuilderBlock {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    isRecord(value.data)
  );
}

export interface PendingImport {
  blocks: BuilderBlock[];
  themeColors: ThemeColors;
  customCss: string;
  pageSettings: PageSettings;
  hasPage: boolean;
  fontFamily: FontFamily;
  successMessage: string;
}

/**
 * Creates a normalized import object from parsed JSON
 */
export function createPendingImport(parsed: unknown): PendingImport | null {
  // Legacy format (array of blocks)
  if (Array.isArray(parsed) && parsed.every(isImportBlock)) {
    return {
      blocks: parsed,
      themeColors: DEFAULT_THEME_COLORS,
      customCss: "",
      pageSettings: DEFAULT_PAGE_SETTINGS,
      hasPage: true,
      fontFamily: "system",
      successMessage: "تم استيراد التصميم بنجاح (الإصدار القديم).",
    };
  }

  // V1 format (object with version)
  if (
    isRecord(parsed) &&
    parsed.version === 1 &&
    Array.isArray(parsed.blocks) &&
    parsed.blocks.every(isImportBlock)
  ) {
    return {
      blocks: parsed.blocks,
      themeColors: normalizeThemeColors(parsed.themeColors),
      customCss: typeof parsed.customCss === "string" ? parsed.customCss : "",
      pageSettings: normalizePageSettings(parsed.pageSettings),
      hasPage: typeof parsed.hasPage === "boolean" ? parsed.hasPage : true,
      fontFamily: normalizeFontFamily(parsed.fontFamily),
      successMessage: "تم استيراد التصميم بنجاح.",
    };
  }

  return null;
}
