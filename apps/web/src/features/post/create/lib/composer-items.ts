import { arrayMove } from "@dnd-kit/sortable";

import {
  POST_UPLOAD_ALLOWED_MEDIA_LABEL,
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
  POST_UPLOAD_MEDIA_TYPES,
} from "@acme/config/posts";

import type { ComposerItem } from "../types";

export function isMediaFile(file: File) {
  return POST_UPLOAD_MEDIA_TYPES.some((mediaType) =>
    file.type.startsWith(`${mediaType}/`),
  );
}

export function getFileValidationError(files: File[], mediaFiles: File[]) {
  if (mediaFiles.length !== files.length) {
    return `Only ${POST_UPLOAD_ALLOWED_MEDIA_LABEL} can be added to a post.`;
  }
  if (mediaFiles.some((file) => file.size > POST_UPLOAD_MAX_SIZE_BYTES)) {
    return `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller.`;
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
