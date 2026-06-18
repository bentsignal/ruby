import { closestCenter, DndContext } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import { AddMoreMediaTile } from "./components/add-more-tile";
import { ImagePreviewDialog } from "./components/image-preview-dialog";
import { PreviewTile } from "./components/tile";
import { MediaGridStore, useMediaGridStore } from "./store";

export function MediaGrid() {
  return (
    <MediaGridStore>
      <MediaGridContent />
    </MediaGridStore>
  );
}

function MediaGridContent() {
  const handleDragEnd = useMediaGridStore((store) => store.handleDragEnd);
  const itemIds = useMediaGridStore((store) => store.itemIds);
  const items = useMediaGridStore((store) => store.items);
  const sensors = useMediaGridStore((store) => store.sensors);

  if (items.length === 0) return null;

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <PreviewTile index={index} itemId={item.id} key={item.id} />
          ))}
          <AddMoreMediaTile />
        </div>
      </SortableContext>
      <ImagePreviewDialog />
    </DndContext>
  );
}
