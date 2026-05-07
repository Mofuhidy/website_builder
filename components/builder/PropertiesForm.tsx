"use client";

import { useBuilderStore } from "@/store/builder-store";
import { CATEGORY_REGISTRY, EditableField, JsonValue } from "@/lib/section-registry";

function findEditableFields(type: string): EditableField[] {
  for (const category of CATEGORY_REGISTRY) {
    for (const item of category.items) {
      if (item.id === type) return item.editableFields;
    }
  }
  return [];
}

function findSectionName(type: string): string {
  for (const category of CATEGORY_REGISTRY) {
    for (const item of category.items) {
      if (item.id === type) return item.name;
    }
  }
  return type;
}

export function PropertiesForm() {
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);

  const block = blocks.find((b) => b.id === selectedBlockId);
  if (!block) return null;

  const fields = findEditableFields(block.type);
  const sectionName = findSectionName(block.type);

  const handleChange = (key: string, value: JsonValue) => {
    updateBlockData(block.id, { ...block.data, [key]: value });
  };

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <p className="text-sm font-medium text-gray-700">{sectionName}</p>
        <p className="text-xs text-muted-foreground">
          لا توجد خصائص قابلة للتعديل لهذا القسم.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      {fields.map((field) => {
        const currentValue = (block.data[field.key] as string) ?? "";

        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label
              htmlFor={`field-${block.id}-${field.key}`}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={`field-${block.id}-${field.key}`}
                rows={4}
                aria-required="true"
                value={currentValue}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none bg-gray-50 focus:bg-white"
              />
            ) : field.type === "image" ? (
              <input
                id={`field-${block.id}-${field.key}`}
                type="url"
                aria-required="true"
                placeholder="https://..."
                value={currentValue}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-gray-50 focus:bg-white"
              />
            ) : (
              <input
                id={`field-${block.id}-${field.key}`}
                type="text"
                aria-required="true"
                value={currentValue}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-gray-50 focus:bg-white"
              />
            )}
          </div>
        );
      })}
    </form>
  );
}
