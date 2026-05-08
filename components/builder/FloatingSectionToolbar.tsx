"use client";

import {
  TrashIcon,
  DocumentDuplicateIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
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
  const setActiveTab = useBuilderStore((s) => s.setActiveTab);
  const selectBlock = useBuilderStore((s) => s.selectBlock);

  const setEditingBlock = useBuilderStore((s) => s.setEditingBlock);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const handleEdit = (e: React.MouseEvent) => {
    stop(e);
    selectBlock(blockId);
    setEditingBlock(blockId);
    setActiveTab("sections");
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    stop(e);
    moveBlockUp(blockId);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    stop(e);
    moveBlockDown(blockId);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    stop(e);
    duplicateBlock(blockId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    stop(e);
    removeBlock(blockId);
  };

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-lg px-2 py-1.5"
      onClick={stop}
    >
      <button
        type="button"
        onClick={handleEdit}
        aria-label="تعديل القسم"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors"
      >
        <PencilSquareIcon className="w-3.5 h-3.5" />
        تعديل
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

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
