import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";

import type { ComposerItem } from "../types";
import { Image } from "~/components/image";

export function ImagePreviewDialog({
  activeIndex,
  items,
  onIndexChange,
  onOpenChange,
}: {
  activeIndex: number | null;
  items: ComposerItem[];
  onIndexChange: (index: number) => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const activeItem = activeIndex === null ? undefined : items[activeIndex];
  const isOpen = activeIndex !== null && !!activeItem;

  return (
    <Dialog.Container open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content
        className="max-h-[calc(100vh-2rem)] max-w-5xl gap-4 overflow-hidden border-white/10 bg-black p-4 text-white sm:max-w-5xl"
        showCloseButton
      >
        <Dialog.Title className="sr-only">Image preview</Dialog.Title>
        <ImagePreviewContent
          activeIndex={activeIndex}
          activeItem={activeItem}
          items={items}
          onIndexChange={onIndexChange}
        />
      </Dialog.Content>
    </Dialog.Container>
  );
}

function ImagePreviewContent({
  activeIndex,
  activeItem,
  items,
  onIndexChange,
}: {
  activeIndex: number | null;
  activeItem: ComposerItem | undefined;
  items: ComposerItem[];
  onIndexChange: (index: number) => void;
}) {
  if (!activeItem || activeIndex === null) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center text-sm font-bold text-white/85">
        {activeIndex + 1} of {items.length}
      </div>
      <div className="grid min-h-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <ImageNavButton
          direction="previous"
          disabled={activeIndex === 0}
          onClick={() => onIndexChange(activeIndex - 1)}
        />
        <div className="flex min-h-0 items-center justify-center">
          <Image
            alt={activeItem.file.name || "Selected image"}
            className="max-h-[68vh] max-w-full rounded-md object-contain"
            height={900}
            src={activeItem.previewUrl}
            width={1200}
          />
        </div>
        <ImageNavButton
          direction="next"
          disabled={activeIndex === items.length - 1}
          onClick={() => onIndexChange(activeIndex + 1)}
        />
      </div>
      <ThumbnailStrip
        activeIndex={activeIndex}
        items={items}
        onSelect={onIndexChange}
      />
    </>
  );
}

function ImageNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <Button
      aria-label={direction === "previous" ? "Previous image" : "Next image"}
      className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-20"
      disabled={disabled}
      size="icon"
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      <Icon className="size-6" />
    </Button>
  );
}

function ThumbnailStrip({
  activeIndex,
  items,
  onSelect,
}: {
  activeIndex: number;
  items: ComposerItem[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex max-w-full gap-2 overflow-x-auto px-1 py-1">
      {items.map((item, index) => (
        <button
          type="button"
          aria-label={`Show image ${index + 1}`}
          className={cn(
            "size-16 shrink-0 overflow-hidden rounded-md border bg-white/5 transition",
            index === activeIndex
              ? "border-white ring-2 ring-white/45"
              : "border-white/25 opacity-70 hover:opacity-100",
          )}
          key={item.id}
          onClick={() => onSelect(index)}
        >
          <Image
            alt=""
            className="size-full object-cover"
            height={64}
            src={item.previewUrl}
            width={64}
          />
        </button>
      ))}
    </div>
  );
}
