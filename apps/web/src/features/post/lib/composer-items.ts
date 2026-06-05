import { arrayMove } from "@dnd-kit/sortable";

import type { ComposerItem } from "../types";

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export function isMediaFile(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export function getFileValidationError(files: File[], mediaFiles: File[]) {
  if (mediaFiles.length !== files.length) {
    return "Only photos and videos can be added to a post.";
  }
  if (mediaFiles.some((file) => file.size > MAX_UPLOAD_SIZE_BYTES)) {
    return "Files must be 10 MB or smaller.";
  }
  return null;
}

export function createComposerItem(file: File) {
  return {
    file,
    id: crypto.randomUUID(),
    previewUrl: URL.createObjectURL(file),
    status: "ready" as const,
  };
}

export function reorderItems(
  items: ComposerItem[],
  activeId: string,
  overId: string,
) {
  if (activeId === overId) return items;
  const fromIndex = items.findIndex((item) => item.id === activeId);
  const toIndex = items.findIndex((item) => item.id === overId);
  if (fromIndex < 0 || toIndex < 0) return items;
  return arrayMove(items, fromIndex, toIndex);
}
