"use client";

import {
  TrashIcon,
  DocumentDuplicateIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useBuilderStore } from "@/store/builder-store";

interface FloatingSectionToolbarProps {
  blockId: string;
  isFirst: boolean;
  isLast: boolean;
}

export function FloatingSectionToolbar({
  blockId,
  isFirst,
  isLast,
}: FloatingSectionToolbarProps) {
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockUp = useBuilderStore((s) => s.moveBlockUp);
  const moveBlockDown = useBuilderStore((s) => s.moveBlockDown);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(blockId);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateBlock(blockId);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveBlockUp(blockId);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveBlockDown(blockId);
  };

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-lg px-2 py-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleMoveUp}
        disabled={isFirst}
        aria-label="تحريك للأعلى"
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronUpIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={handleMoveDown}
        disabled={isLast}
        aria-label="تحريك للأسفل"
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      <button
        type="button"
        onClick={handleDuplicate}
        aria-label="تكرار القسم"
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <DocumentDuplicateIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      <button
        type="button"
        onClick={handleDelete}
        aria-label="حذف القسم"
        className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
