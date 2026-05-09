"use client";

import { useRef, useState } from "react";
import {
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useBuilderStore } from "@/store/builder-store";
import {
  EditableField,
  JsonValue,
  ListItemField,
  findSectionRegistryItem,
} from "@/lib/section-registry";

function getListPreviewLabel(
  item: Record<string, JsonValue>,
  field: EditableField,
  index: number,
) {
  const preferredKeys = ["alt", "caption", "label", "title", "name", "q", "text", "imageUrl"];

  for (const key of preferredKeys) {
    const value = item[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  if (field.listFields) {
    for (const listField of field.listFields) {
      const value = item[listField.key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }
    }
  }

  return `عنصر ${index + 1}`;
}

function ScalarInput({
  field,
  id,
  value,
  onChange,
}: {
  field: ListItemField | EditableField;
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUploadedImage = field.type === "image" && value.startsWith("data:image/");
  const hasImageValue = field.type === "image" && value.trim().length > 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limit to 1MB to prevent localStorage overflow
    if (file.size > 1024 * 1024) {
      import("sonner").then(({ toast }) => {
        toast.error("حجم الصورة كبير جداً. الحد الأقصى هو 1 ميجابايت.");
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none bg-gray-50 focus:bg-white"
      />
    );
  }

  if (field.type === "image") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="url"
            placeholder="https://..."
            value={isUploadedImage ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-w-0 px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-gray-50 focus:bg-white"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border-color bg-white px-3 text-xs font-semibold text-gray-600 hover:border-accent/40 hover:text-accent"
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
            رفع
          </button>
        </div>

        {hasImageValue && (
          <div className="rounded-xl border border-border-color bg-gray-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PhotoIcon className="h-4 w-4" />
                <span>{isUploadedImage ? "تم رفع صورة محلية" : "معاينة الصورة"}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-white hover:text-red-500"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
                إزالة
              </button>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg bg-white">
              <img
                src={value}
                alt=""
                className="h-28 w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      id={id}
      type="text"
      placeholder=""
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors bg-gray-50 focus:bg-white"
    />
  );
}

function ListField({
  field,
  blockId,
  items,
  onUpdate,
}: {
  field: EditableField;
  blockId: string;
  items: Record<string, JsonValue>[];
  onUpdate: (next: Record<string, JsonValue>[]) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleItemChange = (index: number, key: string, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onUpdate(next);
  };

  const handleAdd = () => {
    const next = [...items, { ...(field.defaultItem ?? {}) }];
    onUpdate(next);
    setOpenIndex(next.length - 1);
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onUpdate(next);
    if (openIndex !== null && openIndex >= next.length) setOpenIndex(next.length - 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const previewLabel = getListPreviewLabel(item, field, index);

          return (
            <motion.div
              key={`${blockId}-${field.key}-${index}`}
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto", overflow: "visible" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.2 }}
              className="border border-border-color rounded-xl bg-white"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 cursor-pointer select-none rounded-xl"
              >
                <span className="truncate flex-1 text-right">{previewLabel}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="حذف العنصر"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border-color"
                  >
                    <div className="p-4 flex flex-col gap-4 bg-white">
                      {(field.listFields ?? []).map((subField) => (
                        <div key={subField.key} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {subField.label}
                          </label>
                          <ScalarInput
                            field={subField}
                            id={`${blockId}-${field.key}-${index}-${subField.key}`}
                            value={(item[subField.key] as string) ?? ""}
                            onChange={(v) => handleItemChange(index, subField.key, v)}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border-color rounded-xl text-sm text-gray-500 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        إضافة عنصر
      </button>
    </div>
  );
}

export function PropertiesForm() {
  const editingBlockId = useBuilderStore((s) => s.editingBlockId);
  const block = useBuilderStore((s) =>
    editingBlockId ? s.blocks.find((b) => b.id === editingBlockId) ?? null : null
  );
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);

  if (!block) return null;

  const registryItem = findSectionRegistryItem(block.type);
  if (!registryItem || registryItem.editableFields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        لا توجد خصائص قابلة للتعديل لهذا القسم.
      </p>
    );
  }

  const handleScalarChange = (key: string, value: string) => {
    updateBlockData(block.id, { ...block.data, [key]: value });
  };

  const handleListChange = (key: string, next: Record<string, JsonValue>[]) => {
    updateBlockData(block.id, { ...block.data, [key]: next });
  };

  const scalarFields = registryItem.editableFields.filter((f) => f.type !== "list");
  const listFields = registryItem.editableFields.filter((f) => f.type === "list");

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
      {scalarFields.length > 0 && (
        <section className="flex flex-col gap-4">
          {scalarFields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label
                htmlFor={`field-${block.id}-${field.key}`}
                className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {field.label}
              </label>
              <ScalarInput
                field={field}
                id={`field-${block.id}-${field.key}`}
                value={(block.data[field.key] as string) ?? ""}
                onChange={(v) => handleScalarChange(field.key, v)}
              />
            </div>
          ))}
        </section>
      )}

      {listFields.map((field) => {
        const items = (block.data[field.key] as Record<string, JsonValue>[]) ?? [];
        return (
          <section key={field.key} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {field.label}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <div className="h-px bg-border-color" />
            <ListField
              field={field}
              blockId={block.id}
              items={items}
              onUpdate={(next) => handleListChange(field.key, next)}
            />
          </section>
        );
      })}
    </form>
  );
}
