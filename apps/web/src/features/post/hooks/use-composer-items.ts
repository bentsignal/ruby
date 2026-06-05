import { useRef, useState } from "react";

import type { ComposerItem } from "../types";
import {
  createComposerItem,
  getFileValidationError,
  isMediaFile,
  MAX_UPLOAD_SIZE_BYTES,
  reorderItems,
} from "../lib/composer-items";

export function useComposerItems({
  setError,
}: {
  setError: (error: string | null) => void;
}) {
  const previewUrlsRef = useRef(new Set<string>());
  const [items, setItems] = useState<ComposerItem[]>([]);

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const mediaFiles = files.filter(isMediaFile);
    const validFiles = mediaFiles.filter(
      (file) => file.size <= MAX_UPLOAD_SIZE_BYTES,
    );

    setError(getFileValidationError(files, mediaFiles));
    const newItems = validFiles.map((file) => {
      const item = createComposerItem(file);
      previewUrlsRef.current.add(item.previewUrl);
      return item;
    });
    setItems((current) => [...current, ...newItems]);
  }

  function updateItem(itemId: string, patch: Partial<ComposerItem>) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, ...patch };
      }),
    );
  }

  function removeItem(itemId: string) {
    setItems((current) => {
      const item = current.find((currentItem) => currentItem.id === itemId);
      if (item) revokePreviewUrl(item.previewUrl);
      return current.filter((currentItem) => currentItem.id !== itemId);
    });
  }

  function moveItem(activeId: string, overId: string) {
    setItems((current) => reorderItems(current, activeId, overId));
  }

  function revokeItemPreviewUrls(itemsToRevoke: ComposerItem[]) {
    for (const item of itemsToRevoke) {
      revokePreviewUrl(item.previewUrl);
    }
  }

  function revokePreviewUrl(previewUrl: string) {
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current.delete(previewUrl);
  }

  return {
    addFiles,
    items,
    moveItem,
    removeItem,
    revokeItemPreviewUrls,
    updateItem,
  };
}
