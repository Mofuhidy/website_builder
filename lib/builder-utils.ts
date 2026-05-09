import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_PAGE_SETTINGS,
  type BuilderBlock,
  type FontFamily,
  type PageSettings,
  type ThemeColors,
} from "@/store/builder-store";
import {
  type EditableField,
  type JsonValue,
  type ListItemField,
  type SectionType,
  findSectionRegistryItem,
  isSectionType,
} from "@/lib/section-registry";

const DEFAULT_THEME_COLORS: ThemeColors = {
  accent: "#f05151",
  background: "#ffffff",
  foreground: "#111827",
  muted: "#f9fafb",
};

const SUPPORTED_FONT_FAMILIES: FontFamily[] = ["system", "cairo", "tajawal", "almarai"];
const MAX_CUSTOM_CSS_LENGTH = 12000;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function formatSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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

export function normalizeFontFamily(value: unknown): FontFamily {
  if (typeof value === "string" && SUPPORTED_FONT_FAMILIES.includes(value as FontFamily)) {
    return value as FontFamily;
  }

  return DEFAULT_FONT_FAMILY;
}

function normalizeColorToken(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  const nextValue = value.trim();
  if (nextValue.length === 0 || nextValue.length > 64) return fallback;

  return nextValue;
}

export function normalizeThemeColors(value: unknown): ThemeColors {
  if (!isRecord(value)) return DEFAULT_THEME_COLORS;

  return {
    accent: normalizeColorToken(value.accent, DEFAULT_THEME_COLORS.accent),
    background: normalizeColorToken(value.background, DEFAULT_THEME_COLORS.background),
    foreground: normalizeColorToken(value.foreground, DEFAULT_THEME_COLORS.foreground),
    muted: normalizeColorToken(value.muted, DEFAULT_THEME_COLORS.muted),
  };
}

export function normalizeCustomCss(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .replace(/<\/style/gi, "<\\/style")
    .replace(/@import\s+[^;]+;/gi, "")
    .trim()
    .slice(0, MAX_CUSTOM_CSS_LENGTH);
}

function normalizeScalarField(
  field: EditableField | ListItemField,
  value: unknown,
  fallback: JsonValue,
): JsonValue {
  switch (field.type) {
    case "text":
    case "textarea":
    case "image":
      return typeof value === "string" ? value : typeof fallback === "string" ? fallback : "";
    default:
      return fallback;
  }
}

function normalizeListItem(
  value: unknown,
  listFields: ListItemField[],
  defaultItem: Record<string, JsonValue> | undefined,
) {
  const baseItem = isRecord(defaultItem) ? structuredClone(defaultItem) : {};
  if (!isRecord(value)) return null;

  const nextItem: Record<string, JsonValue> = { ...baseItem };

  for (const field of listFields) {
    nextItem[field.key] = normalizeScalarField(field, value[field.key], nextItem[field.key] ?? "");
  }

  return nextItem;
}

export function normalizeBlockData(type: SectionType, value: unknown) {
  const registryItem = findSectionRegistryItem(type);
  if (!registryItem) return {};

  const defaults = structuredClone(registryItem.defaultData);
  if (!isRecord(value)) return defaults;

  const nextData: Record<string, JsonValue> = { ...defaults };

  for (const field of registryItem.editableFields) {
    const fallback = defaults[field.key];
    const rawValue = value[field.key];

    if (field.type === "list") {
      const fallbackList = Array.isArray(fallback) ? structuredClone(fallback) : [];
      if (!Array.isArray(rawValue)) {
        nextData[field.key] = fallbackList;
        continue;
      }

      const listFields = field.listFields ?? [];
      const normalizedItems = rawValue
        .map((item) => normalizeListItem(item, listFields, field.defaultItem))
        .filter((item): item is Record<string, JsonValue> => item !== null);

      nextData[field.key] = normalizedItems.length > 0 || rawValue.length === 0 ? normalizedItems : fallbackList;
      continue;
    }

    nextData[field.key] = normalizeScalarField(field, rawValue, fallback);
  }

  return nextData;
}

interface NormalizedBlocksResult {
  blocks: BuilderBlock[];
  skippedMalformed: number;
  skippedUnsupported: number;
  dedupedIds: number;
}

function createUniqueBlockId(id: string, type: SectionType, usedIds: Set<string>) {
  const baseId = id.trim() || `${type}-${usedIds.size + 1}`;

  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return { id: baseId, wasDeduped: false };
  }

  let attempt = 2;
  let nextId = `${baseId}-${attempt}`;
  while (usedIds.has(nextId)) {
    attempt += 1;
    nextId = `${baseId}-${attempt}`;
  }

  usedIds.add(nextId);
  return { id: nextId, wasDeduped: true };
}

export function normalizeImportedBlocks(value: unknown): NormalizedBlocksResult {
  if (!Array.isArray(value)) {
    return {
      blocks: [],
      skippedMalformed: 0,
      skippedUnsupported: 0,
      dedupedIds: 0,
    };
  }

  const usedIds = new Set<string>();
  const blocks: BuilderBlock[] = [];
  let skippedMalformed = 0;
  let skippedUnsupported = 0;
  let dedupedIds = 0;

  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.type !== "string") {
      skippedMalformed += 1;
      continue;
    }

    if (!isSectionType(item.type)) {
      skippedUnsupported += 1;
      continue;
    }

    const { id, wasDeduped } = createUniqueBlockId(item.id, item.type, usedIds);
    if (wasDeduped) {
      dedupedIds += 1;
    }

    blocks.push({
      id,
      type: item.type,
      data: normalizeBlockData(item.type, item.data),
    });
  }

  return {
    blocks,
    skippedMalformed,
    skippedUnsupported,
    dedupedIds,
  };
}

function buildImportWarningMessage(result: NormalizedBlocksResult, cssWasSanitized: boolean) {
  const messages: string[] = [];

  if (result.skippedUnsupported > 0) {
    messages.push(`تم تجاهل ${result.skippedUnsupported} قسم غير مدعوم`);
  }

  if (result.skippedMalformed > 0) {
    messages.push(`تم تجاهل ${result.skippedMalformed} عنصر غير صالح`);
  }

  if (result.dedupedIds > 0) {
    messages.push(`تم إصلاح ${result.dedupedIds} معرف مكرر`);
  }

  if (cssWasSanitized) {
    messages.push("تم تنظيف CSS المخصص قبل تطبيقه");
  }

  return messages.length > 0 ? messages.join("، ") : undefined;
}

export function scopePreviewCss(css: string, scopeSelector = "[data-preview-canvas]") {
  const normalizedCss = normalizeCustomCss(css);
  if (!normalizedCss) return "";

  return scopeCssBlocks(normalizedCss, scopeSelector);
}

function findMatchingBrace(input: string, openBraceIndex: number) {
  let depth = 0;
  let stringChar: '"' | "'" | null = null;
  let inComment = false;

  for (let index = openBraceIndex; index < input.length; index += 1) {
    const char = input[index];
    const nextChar = input[index + 1];

    if (inComment) {
      if (char === "*" && nextChar === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (stringChar) {
      if (char === "\\") {
        index += 1;
        continue;
      }

      if (char === stringChar) {
        stringChar = null;
      }
      continue;
    }

    if (char === "/" && nextChar === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      stringChar = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function scopeSingleSelector(selector: string, scopeSelector: string) {
  const trimmedSelector = selector.trim();
  if (!trimmedSelector) return scopeSelector;
  if (trimmedSelector.includes(scopeSelector)) return trimmedSelector;

  if (trimmedSelector === ":root" || trimmedSelector === "html" || trimmedSelector === "body") {
    return scopeSelector;
  }

  if (trimmedSelector.startsWith("body ") || trimmedSelector.startsWith("html ") || trimmedSelector.startsWith(":root ")) {
    return `${scopeSelector}${trimmedSelector.slice(trimmedSelector.indexOf(" "))}`;
  }

  return `${scopeSelector} ${trimmedSelector}`;
}

function scopeSelectorList(selectors: string, scopeSelector: string) {
  return selectors
    .split(",")
    .map((selector) => scopeSingleSelector(selector, scopeSelector))
    .join(", ");
}

function scopeCssBlocks(input: string, scopeSelector: string) {
  let output = "";
  let index = 0;

  while (index < input.length) {
    const ruleStart = index;
    let inComment = false;
    let stringChar: '"' | "'" | null = null;
    let blockStart = -1;
    let statementEnd = -1;

    while (index < input.length) {
      const char = input[index];
      const nextChar = input[index + 1];

      if (inComment) {
        if (char === "*" && nextChar === "/") {
          inComment = false;
          index += 2;
          continue;
        }
        index += 1;
        continue;
      }

      if (stringChar) {
        if (char === "\\") {
          index += 2;
          continue;
        }
        if (char === stringChar) {
          stringChar = null;
        }
        index += 1;
        continue;
      }

      if (char === "/" && nextChar === "*") {
        inComment = true;
        index += 2;
        continue;
      }

      if (char === '"' || char === "'") {
        stringChar = char;
        index += 1;
        continue;
      }

      if (char === "{") {
        blockStart = index;
        break;
      }

      if (char === ";") {
        statementEnd = index;
        break;
      }

      index += 1;
    }

    if (statementEnd !== -1) {
      output += input.slice(ruleStart, statementEnd + 1);
      index = statementEnd + 1;
      continue;
    }

    if (blockStart === -1) {
      output += input.slice(ruleStart);
      break;
    }

    const ruleHeader = input.slice(ruleStart, blockStart);
    const blockEnd = findMatchingBrace(input, blockStart);
    if (blockEnd === -1) {
      output += input.slice(ruleStart);
      break;
    }

    const trimmedHeader = ruleHeader.trim();
    const blockBody = input.slice(blockStart + 1, blockEnd);

    if (trimmedHeader.startsWith("@")) {
      const atRuleName = trimmedHeader.slice(1).split(/\s+/)[0].toLowerCase();
      const shouldScopeNestedRules = ["media", "supports", "container", "layer"].includes(atRuleName);

      output += shouldScopeNestedRules
        ? `${ruleHeader}{${scopeCssBlocks(blockBody, scopeSelector)}}`
        : `${ruleHeader}{${blockBody}}`;
    } else {
      output += `${scopeSelectorList(ruleHeader, scopeSelector)}{${blockBody}}`;
    }

    index = blockEnd + 1;
  }

  return output;
}

export interface PendingImport {
  blocks: BuilderBlock[];
  themeColors: ThemeColors;
  customCss: string;
  pageSettings: PageSettings;
  hasPage: boolean;
  fontFamily: FontFamily;
  successMessage: string;
  warningMessage?: string;
}

export function createPendingImport(parsed: unknown): PendingImport | null {
  if (Array.isArray(parsed)) {
    const normalizedBlocks = normalizeImportedBlocks(parsed);

    return {
      blocks: normalizedBlocks.blocks,
      themeColors: DEFAULT_THEME_COLORS,
      customCss: "",
      pageSettings: DEFAULT_PAGE_SETTINGS,
      hasPage: true,
      fontFamily: DEFAULT_FONT_FAMILY,
      successMessage: "تم استيراد التصميم بنجاح (الإصدار القديم).",
      warningMessage: buildImportWarningMessage(normalizedBlocks, false),
    };
  }

  if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.blocks)) {
    return null;
  }

  const normalizedBlocks = normalizeImportedBlocks(parsed.blocks);
  const normalizedCustomCss = normalizeCustomCss(parsed.customCss);
  const rawCustomCss = typeof parsed.customCss === "string" ? parsed.customCss : "";

  return {
    blocks: normalizedBlocks.blocks,
    themeColors: normalizeThemeColors(parsed.themeColors),
    customCss: normalizedCustomCss,
    pageSettings: normalizePageSettings(parsed.pageSettings),
    hasPage: typeof parsed.hasPage === "boolean" ? parsed.hasPage : true,
    fontFamily: normalizeFontFamily(parsed.fontFamily),
    successMessage: "تم استيراد التصميم بنجاح.",
    warningMessage: buildImportWarningMessage(
      normalizedBlocks,
      rawCustomCss !== normalizedCustomCss,
    ),
  };
}
