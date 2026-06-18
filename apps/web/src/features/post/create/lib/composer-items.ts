import { arrayMove } from "@dnd-kit/sortable";

import {
  POST_UPLOAD_ALLOWED_MEDIA_LABEL,
  POST_UPLOAD_BLOCKED_CONTENT_TYPES,
  POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH,
  POST_UPLOAD_FILE_NAME_MAX_LENGTH,
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
  POST_UPLOAD_MEDIA_TYPES,
} from "@acme/config/posts";

import type { ComposerItem } from "../types";

export function isMediaFile(file: File) {
  const contentType = normalizeContentType(file.type);
  return (
    !POST_UPLOAD_BLOCKED_CONTENT_TYPES.some((type) => type === contentType) &&
    POST_UPLOAD_MEDIA_TYPES.some((mediaType) =>
      contentType.startsWith(`${mediaType}/`),
    )
  );
}

export function getFileValidationError(files: File[], mediaFiles: File[]) {
  if (mediaFiles.length !== files.length) {
    return `Only ${POST_UPLOAD_ALLOWED_MEDIA_LABEL} can be added to a post.`;
  }
  if (mediaFiles.some((file) => file.size > POST_UPLOAD_MAX_SIZE_BYTES)) {
    return `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller.`;
  }
  if (
    mediaFiles.some(
      (file) =>
        file.name.length > POST_UPLOAD_FILE_NAME_MAX_LENGTH ||
        file.type.length > POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH,
    )
  ) {
    return "One or more files cannot be uploaded.";
  }
  return null;
}

function normalizeContentType(contentType: string) {
  return contentType.split(";")[0]?.trim().toLowerCase() ?? "";
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
