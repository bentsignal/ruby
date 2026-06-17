import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { useCreateStore } from "../store";
import { AddMoreMediaTile } from "./add-more-media-tile";
import { ImagePreviewDialog } from "./image-preview-dialog";
import { PreviewTile } from "./media-grid-tile";

export function MediaGrid() {
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

  if (items.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const imageIndex = imageItems.findIndex(
              (current) => current.id === item.id,
            );

            return (
              <PreviewTile
                index={index}
                itemId={item.id}
                key={item.id}
                onPreview={
                  imageIndex === -1
                    ? undefined
                    : () => setPreviewIndex(imageIndex)
                }
              />
            );
          })}
          <AddMoreMediaTile />
        </div>
      </SortableContext>
      <ImagePreviewDialog
        activeIndex={previewIndex}
        items={imageItems}
        onIndexChange={setPreviewIndex}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPreviewIndex(null);
        }}
      />
    </DndContext>
  );
}
