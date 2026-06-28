import type { Dispatch, RefObject, SetStateAction } from "react";
import { useRef } from "react";

import { cn } from "@acme/std/cn";

import { Image } from "~/components/image";
import { useMediaStore } from "../../store";
import { useDragToPan } from "../hooks/use-drag-to-pan";
import { BASE_ZOOM_LEVEL, DEFAULT_ZOOM_LEVEL } from "./zoom";

export function ActiveLightboxMedia({
  setZoomLevel,
  zoomLevel,
}: {
  setZoomLevel: Dispatch<SetStateAction<number>>;
  zoomLevel: number;
}) {
  const activeIndex = useMediaStore((store) => store.lightboxActiveIndex);
  const mediaItems = useMediaStore((store) => store.mediaItems);
  const naturalSizes = useMediaStore((store) => store.naturalSizes);
  const reportNaturalSize = useMediaStore((store) => store.reportNaturalSize);
  const scrollRef = useRef<HTMLDivElement>(null);
  const media = mediaItems[activeIndex];

  if (!media) return null;

  if (media.mediaType === "video") {
    return <ActiveVideo url={media.url} />;
  }

  const naturalSize = naturalSizes[activeIndex] ?? {
    height: 1200,
    width: 1600,
  };

  return (
    <ActiveImage
      activeIndex={activeIndex}
      alt={media.alt}
      naturalSize={naturalSize}
      reportNaturalSize={reportNaturalSize}
      scrollRef={scrollRef}
      setZoomLevel={setZoomLevel}
      url={media.url}
      zoomLevel={zoomLevel}
    />
  );
}

function ActiveVideo({ url }: { url: string }) {
  return (
    <div className="flex size-full items-center justify-center px-4 py-20">
      <video
        className="h-auto max-h-full w-auto max-w-full object-contain"
        controls
        playsInline
        src={url}
      />
    </div>
  );
}

function ActiveImage({
  activeIndex,
  alt,
  naturalSize,
  reportNaturalSize,
  scrollRef,
  setZoomLevel,
  url,
  zoomLevel,
}: {
  activeIndex: number;
  alt: string;
  naturalSize: { height: number; width: number };
  reportNaturalSize: (index: number, width: number, height: number) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  setZoomLevel: Dispatch<SetStateAction<number>>;
  url: string;
  zoomLevel: number;
}) {
  const isZoomed = zoomLevel > BASE_ZOOM_LEVEL;
  const drag = useDragToPan({ enabled: isZoomed, scrollRef });
  const renderedSize = isZoomed
    ? {
        height: Math.round(naturalSize.height * zoomLevel),
        width: Math.round(naturalSize.width * zoomLevel),
      }
    : naturalSize;

  function handleClick() {
    if (drag.consumeSuppressedClick()) return;
    setZoomLevel(isZoomed ? BASE_ZOOM_LEVEL : DEFAULT_ZOOM_LEVEL);
  }

  return (
    <div
      className={cn(
        "size-full",
        isZoomed
          ? drag.isPanning
            ? "cursor-grabbing overflow-auto overscroll-contain px-6 py-24"
            : "cursor-zoom-out overflow-auto overscroll-contain px-6 py-24"
          : "flex items-center justify-center overflow-hidden px-4 py-14 sm:px-16 sm:py-6",
      )}
      ref={scrollRef}
      onClick={isZoomed ? handleClick : undefined}
      onPointerCancel={drag.handlePointerEnd}
      onPointerDown={drag.handlePointerDown}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.handlePointerEnd}
    >
      <Image
        alt={alt}
        className={cn(
          "object-contain transition-transform duration-200 select-none",
          isZoomed
            ? drag.isPanning
              ? "!h-auto !max-h-none !w-auto !max-w-none cursor-grabbing"
              : "cursor-inherit !h-auto !max-h-none !w-auto !max-w-none"
            : "!h-auto !max-h-full !w-auto !max-w-full cursor-zoom-in",
        )}
        draggable={false}
        height={renderedSize.height}
        layout="constrained"
        src={url}
        width={renderedSize.width}
        onClick={isZoomed ? undefined : handleClick}
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
