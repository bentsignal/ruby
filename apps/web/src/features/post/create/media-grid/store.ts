import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createStore } from "rostra";

import { useCreateStore } from "../store";

function useInternalStore() {
  const items = useCreateStore((store) => store.items);
  const moveItem = useCreateStore((store) => store.moveItem);
  const imageItems = items.filter(
    (item) => !item.file.type.startsWith("video/"),
  );
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveItem(String(active.id), String(over.id));
    }
  }

  function openPreview(itemId: string) {
    const imageIndex = imageItems.findIndex((item) => item.id === itemId);
    if (imageIndex !== -1) {
      setPreviewIndex(imageIndex);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setPreviewIndex(null);
    }
  }

  const activeItem =
    previewIndex === null ? undefined : imageItems[previewIndex];
  const isPreviewOpen = previewIndex !== null && !!activeItem;

  return {
    activeItem,
    handleDragEnd,
    handleOpenChange,
    imageItems,
    isPreviewOpen,
    itemIds: items.map((item) => item.id),
    items,
    openPreview,
    previewIndex,
    sensors,
    setPreviewIndex,
  };
}

export const { Store: MediaGridStore, useStore: useMediaGridStore } =
  createStore(useInternalStore);
