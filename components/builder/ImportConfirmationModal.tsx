"use client";

import { useEffect, useId } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ImportConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ImportConfirmationModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: ImportConfirmationModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        dir="rtl"
        className="relative w-full max-w-[460px] rounded-2xl border border-gray-100 bg-white p-6 text-right shadow-2xl shadow-black/20"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="إلغاء الاستيراد"
          className="absolute left-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-accent">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>

        <h2 id={titleId} className="text-xl font-semibold text-gray-950">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border-color bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            تأكيد الاستيراد
          </button>
        </div>
      </div>
    </div>
  );
}
