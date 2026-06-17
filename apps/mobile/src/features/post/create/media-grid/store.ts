import { useState } from "react";
import { createStore } from "rostra";

import { isPreviewableImage } from "../lib/media-type";
import { useCreateStore } from "../store";

function useInternalStore() {
  const items = useCreateStore((store) => store.items);
  const imageItems = items.filter(isPreviewableImage);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  function openPreview(itemId: string) {
    const imageIndex = imageItems.findIndex((item) => item.id === itemId);
    if (imageIndex !== -1) {
      setPreviewIndex(imageIndex);
    }
  }

  function closePreview() {
    setPreviewIndex(null);
  }

  return {
    closePreview,
    imageItems,
    items,
    openPreview,
    previewIndex,
  };
}

export const { Store: MediaGridStore, useStore: useMediaGridStore } =
  createStore(useInternalStore);
