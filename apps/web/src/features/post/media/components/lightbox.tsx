import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";

import { Image } from "~/components/image";
import { useMediaStore } from "../store";

export function PostMediaLightbox() {
  const closeLightbox = useMediaStore((store) => store.closeLightbox);
  const isLightboxOpen = useMediaStore((store) => store.isLightboxOpen);

  return (
    <Dialog.Container
      open={isLightboxOpen}
      onOpenChange={(open) => !open && closeLightbox()}
    >
      <Dialog.Content
        className="h-[min(86vh,760px)] max-h-[calc(100vh-2rem)] max-w-[min(96vw,1120px)] overflow-hidden border-white/10 bg-black p-4 text-white sm:max-w-[min(96vw,1120px)]"
        showCloseButton
      >
        <Dialog.Title className="sr-only">Media viewer</Dialog.Title>
        <LightboxContent />
      </Dialog.Content>
    </Dialog.Container>
  );
}

function LightboxContent() {
  const activeIndex = useMediaStore((store) => store.activeIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setActiveIndex);

  const activeItem = mediaItems[activeIndex];
  if (!activeItem) return null;

  return (
    <div className="grid h-full min-h-0 grid-rows-[24px_minmax(0,1fr)_80px] gap-3">
      <div className="flex min-h-0 items-center justify-center text-sm font-bold text-white/85">
        {activeIndex + 1} of {mediaItems.length}
      </div>
      <div className="grid min-h-0 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 overflow-hidden">
        <NavButton
          direction="previous"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(activeIndex - 1)}
        />
        <div className="flex h-full min-h-0 items-center justify-center overflow-hidden">
          <ActiveLightboxMedia />
        </div>
        <NavButton
          direction="next"
          disabled={activeIndex === mediaItems.length - 1}
          onClick={() => setActiveIndex(activeIndex + 1)}
        />
      </div>
      <ThumbnailStripHost />
    </div>
  );
}

function ActiveLightboxMedia() {
  const activeIndex = useMediaStore((store) => store.activeIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const naturalSizes = useMediaStore((store) => store.naturalSizes);
  const reportNaturalSize = useMediaStore((store) => store.reportNaturalSize);

  const media = mediaItems[activeIndex];
  if (!media) return null;
  const naturalSize = naturalSizes[activeIndex] ?? {
    height: 1200,
    width: 1600,
  };

  if (media.mediaType === "video") {
    return (
      <video
        className="h-auto max-h-full w-auto max-w-full rounded-md object-contain"
        controls
        playsInline
        src={media.url}
      />
    );
  }

  return (
    <Image
      alt={media.alt}
      className="!h-auto !max-h-full !w-auto !max-w-full rounded-md object-contain"
      height={naturalSize.height}
      layout="constrained"
      src={media.url}
      width={naturalSize.width}
      onLoad={(event) => {
        const target = event.currentTarget;
        reportNaturalSize(
          activeIndex,
          target.naturalWidth,
          target.naturalHeight,
        );
      }}
    />
  );
}

function ThumbnailStripHost() {
  const mediaItems = useMediaStore((store) => store.mediaItems);

  if (mediaItems.length <= 1) return null;

  return <ThumbnailStrip />;
}

function NavButton({
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
      aria-label={direction === "previous" ? "Previous item" : "Next item"}
      className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-20"
      disabled={disabled}
      onClick={onClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-6" />
    </Button>
  );
}

function ThumbnailStrip() {
  const activeIndex = useMediaStore((store) => store.activeIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setActiveIndex);

  return (
    <div className="flex h-20 max-w-full items-center justify-center gap-2 overflow-x-auto px-1 py-1">
      {mediaItems.map((media, index) => (
        <button
          aria-label={`Show item ${index + 1}`}
          className={cn(
            "size-16 shrink-0 overflow-hidden rounded-md border bg-white/5 transition",
            index === activeIndex
              ? "border-white ring-2 ring-white/45"
              : "border-white/25 opacity-60 hover:opacity-100",
          )}
          key={`${media.url}-${index}`}
          onClick={() => setActiveIndex(index)}
          type="button"
        >
          <ThumbnailMedia media={media} />
        </button>
      ))}
    </div>
  );
}

function ThumbnailMedia({
  media,
}: {
  media: { mediaType: string; url: string };
}) {
  if (media.mediaType === "video") {
    return (
      <span className="grid size-full place-items-center bg-white/10">
        <Play className="size-5 text-white" />
      </span>
    );
  }

  return (
    <Image
      alt=""
      className="size-full object-cover"
      height={64}
      src={media.url}
      width={64}
    />
  );
}
