import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { createPortal } from "react-dom";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";

import type { PostMediaItem } from "../../store";
import { Image } from "~/components/image";
import { useMediaStore } from "../store";

export function PostMediaLightbox() {
  const closeLightbox = useMediaStore((store) => store.closeLightbox);
  const isLightboxOpen = useMediaStore((store) => store.isLightboxOpen);

  // eslint-disable-next-line no-restricted-syntax -- The fullscreen viewer must sync body scroll locking and Escape handling with browser APIs.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, isLightboxOpen]);

  if (!isLightboxOpen) return null;

  return createPortal(
    <div
      aria-label="Media viewer"
      aria-modal="true"
      className="animate-in fade-in-0 fixed inset-0 z-50 overflow-hidden bg-black text-white duration-200"
      role="dialog"
    >
      <LightboxContent />
    </div>,
    document.body,
  );
}

function LightboxContent() {
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
  const closeLightbox = useMediaStore((store) => store.closeLightbox);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setLightboxActiveIndex);

  const activeItem = mediaItems[activeIndex];

  // eslint-disable-next-line no-restricted-syntax -- The fullscreen viewer needs document-level arrow-key navigation while it is open.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
      if (event.key === "ArrowRight" && activeIndex < mediaItems.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, mediaItems.length, setActiveIndex]);

  if (!activeItem) return null;

  return (
    <LightboxStage
      activeIndex={activeIndex}
      activeItem={activeItem}
      closeLightbox={closeLightbox}
      key={activeIndex}
      mediaItems={mediaItems}
      setActiveIndex={setActiveIndex}
    />
  );
}

function LightboxStage({
  activeIndex,
  activeItem,
  closeLightbox,
  mediaItems,
  setActiveIndex,
}: {
  activeIndex: number;
  activeItem: PostMediaItem;
  closeLightbox: () => void;
  mediaItems: PostMediaItem[];
  setActiveIndex: (index: number) => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="relative flex h-dvh min-h-0 w-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-linear-to-b from-black/75 to-transparent" />

      <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-sm font-semibold text-white/90 tabular-nums shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        {activeIndex + 1} of {mediaItems.length}
      </div>

      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <ZoomButton
          isZoomed={isZoomed}
          mediaType={activeItem.mediaType}
          setIsZoomed={setIsZoomed}
        />
        <Button
          aria-label="Close media viewer"
          className="bg-black/45 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15"
          onClick={closeLightbox}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="size-5" />
        </Button>
      </div>

      <div className="relative min-h-0 flex-1">
        <ActiveLightboxMedia isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
      </div>

      <NavButton
        direction="previous"
        disabled={activeIndex === 0}
        onClick={() => setActiveIndex(activeIndex - 1)}
      />
      <NavButton
        direction="next"
        disabled={activeIndex === mediaItems.length - 1}
        onClick={() => setActiveIndex(activeIndex + 1)}
      />

      <ThumbnailStripHost />
    </div>
  );
}

function ZoomButton({
  isZoomed,
  mediaType,
  setIsZoomed,
}: {
  isZoomed: boolean;
  mediaType: PostMediaItem["mediaType"];
  setIsZoomed: Dispatch<SetStateAction<boolean>>;
}) {
  if (mediaType !== "image") return null;

  const Icon = isZoomed ? ZoomOut : ZoomIn;

  return (
    <Button
      aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      className="bg-black/45 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15"
      onClick={() => setIsZoomed((zoomed) => !zoomed)}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-5" />
    </Button>
  );
}

function ActiveLightboxMedia({
  isZoomed,
  setIsZoomed,
}: {
  isZoomed: boolean;
  setIsZoomed: Dispatch<SetStateAction<boolean>>;
}) {
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
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
      <div className="flex size-full items-center justify-center px-4 py-20">
        <video
          className="h-auto max-h-full w-auto max-w-full object-contain"
          controls
          playsInline
          src={media.url}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "size-full",
        isZoomed
          ? "overflow-auto overscroll-contain px-6 py-24"
          : "flex items-center justify-center overflow-hidden px-4 py-14 sm:px-16 sm:py-6",
      )}
    >
      <Image
        alt={media.alt}
        className={cn(
          "object-contain transition-transform duration-200 select-none",
          isZoomed
            ? "!h-auto !max-h-none !w-auto !max-w-none cursor-zoom-out"
            : "!h-auto !max-h-full !w-auto !max-w-full cursor-zoom-in",
        )}
        height={naturalSize.height}
        layout="constrained"
        src={media.url}
        width={naturalSize.width}
        onDoubleClick={() => setIsZoomed((zoomed) => !zoomed)}
        onLoad={(event) => {
          const target = event.currentTarget;
          reportNaturalSize(
            activeIndex,
            target.naturalWidth,
            target.naturalHeight,
          );
        }}
      />
    </div>
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
      className={cn(
        "absolute top-1/2 z-30 hidden size-12 -translate-y-1/2 rounded-full bg-black/40 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15 disabled:opacity-20 sm:grid",
        direction === "previous" ? "left-4" : "right-4",
      )}
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
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const setActiveIndex = useMediaStore((store) => store.setLightboxActiveIndex);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-linear-to-t from-black/70 via-black/25 to-transparent px-4 pt-12 pb-5 sm:pb-6">
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center justify-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950/45 p-1.5 shadow-2xl backdrop-blur-md [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
        {mediaItems.map((media, index) => (
          <button
            aria-label={`Show item ${index + 1}`}
            className={cn(
              "size-14 shrink-0 overflow-hidden rounded-lg border p-0.5 transition sm:size-16",
              index === activeIndex
                ? "border-white/80 bg-white/15 opacity-100"
                : "border-transparent bg-white/5 opacity-60 hover:bg-white/10 hover:opacity-100",
            )}
            key={`${media.url}-${index}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <ThumbnailMedia media={media} />
          </button>
        ))}
      </div>
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
      <span className="grid size-full place-items-center rounded-[5px] bg-white/10">
        <Play className="size-5 text-white" />
      </span>
    );
  }

  return (
    <Image
      alt=""
      className="size-full rounded-[5px] object-cover"
      height={64}
      src={media.url}
      width={64}
    />
  );
}
