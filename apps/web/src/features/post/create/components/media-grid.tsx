import type { DragEndEvent } from "@dnd-kit/core";
import type { HTMLAttributes } from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, LoaderCircle, Plus, Trash2, X } from "lucide-react";

import { cn } from "@acme/std/cn";
import * as Tooltip from "@acme/ui-web/tooltip";

import { useCreateStore } from "../store";
import { ImagePreviewDialog } from "./image-preview-dialog";

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

function AddMoreMediaTile() {
  const inputRef = useCreateStore((store) => store.inputRef);

  return (
    <button
      type="button"
      className="border-border text-muted-foreground hover:bg-accent hover:text-foreground flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <Plus className="size-6" />
      <span className="text-sm font-semibold">Add more</span>
    </button>
  );
}

function PreviewTile({
  index,
  itemId,
  onPreview,
}: {
  index: number;
  itemId: string;
  onPreview?: () => void;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border bg-card relative aspect-[4/5] overflow-hidden rounded-lg border",
        isDragging && "z-10 opacity-70",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <PreviewMedia itemId={itemId} onPreview={onPreview} />
      <PreviewToolbar
        attributes={attributes}
        index={index}
        itemId={itemId}
        listeners={listeners}
      />
      <UploadState itemId={itemId} />
    </div>
  );
}

function PreviewMedia({
  itemId,
  onPreview,
}: {
  itemId: string;
  onPreview?: () => void;
}) {
  const item = useComposerItem(itemId);
  if (!item) return null;

  if (item.file.type.startsWith("video/")) {
    return (
      <video
        className="size-full object-cover"
        controls
        muted
        playsInline
        src={item.previewUrl}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="Preview image"
      className="size-full cursor-pointer bg-cover bg-center"
      style={{ backgroundImage: `url(${item.previewUrl})` }}
      onClick={onPreview}
    />
  );
}

function PreviewToolbar({
  attributes,
  index,
  itemId,
  listeners,
}: {
  attributes: HTMLAttributes<HTMLElement>;
  index: number;
  itemId: string;
  listeners?: HTMLAttributes<HTMLElement>;
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/45 p-2 text-white">
      <button
        type="button"
        aria-label="Drag media"
        className="flex cursor-grab touch-none items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
        {index + 1}
      </button>
      <RemoveMediaButton
        isConfirming={isConfirming}
        itemId={itemId}
        setIsConfirming={setIsConfirming}
      />
    </div>
  );
}

function RemoveMediaButton(props: {
  isConfirming: boolean;
  itemId: string;
  setIsConfirming: (isConfirming: boolean) => void;
}) {
  const removeItem = useCreateStore((store) => store.removeItem);

  if (props.isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold">Remove?</span>
        <Tooltip.Container>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label="Cancel remove"
              className="flex size-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/60"
              onClick={() => props.setIsConfirming(false)}
            >
              <X className="size-4" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Cancel</Tooltip.Content>
        </Tooltip.Container>
        <Tooltip.Container>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label="Remove media"
              className="flex size-8 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
              onClick={() => removeItem(props.itemId)}
            >
              <Trash2 className="size-4" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Remove media</Tooltip.Content>
        </Tooltip.Container>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label="Remove media"
      className="flex size-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/60"
      onClick={() => props.setIsConfirming(true)}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

function UploadState({ itemId }: { itemId: string }) {
  const item = useComposerItem(itemId);
  if (!item) return null;

  if (item.status === "uploading") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4 text-center text-sm font-semibold text-white">
        <span className="flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          Uploading
        </span>
      </div>
    );
  }

  if (item.status === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4 text-center text-sm font-semibold text-white">
        {item.error ?? "Upload failed"}
      </div>
    );
  }

  return null;
}

function useComposerItem(itemId: string) {
  return useCreateStore((store) =>
    store.items.find((item) => item.id === itemId),
  );
}
