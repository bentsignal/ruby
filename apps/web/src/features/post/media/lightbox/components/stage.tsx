import { useState } from "react";

import type { PostMediaItem } from "../../../store";
import { ActiveLightboxMedia } from "./active-media";
import { CloseButton, NavButton } from "./controls";
import { ThumbnailStripHost } from "./thumbnails";
import { BASE_ZOOM_LEVEL, ZoomButton } from "./zoom";

export function LightboxStage({
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
  const [zoomLevel, setZoomLevel] = useState(BASE_ZOOM_LEVEL);

  return (
    <div className="relative flex h-dvh min-h-0 w-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-linear-to-b from-black/75 to-transparent" />

      <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-sm font-semibold text-white/90 tabular-nums shadow-lg ring-1 ring-white/10 backdrop-blur-md">
        {activeIndex + 1} of {mediaItems.length}
      </div>

      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <ZoomButton
          mediaType={activeItem.mediaType}
          setZoomLevel={setZoomLevel}
          zoomLevel={zoomLevel}
        />
        <CloseButton onClick={closeLightbox} />
      </div>

      <div className="relative min-h-0 flex-1">
        <ActiveLightboxMedia
          setZoomLevel={setZoomLevel}
          zoomLevel={zoomLevel}
        />
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
