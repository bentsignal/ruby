import { useRef, useState } from "react";
import { createStore } from "rostra";

import type { PostMediaItem } from "../store";

const MIN_ASPECT_RATIO = 4 / 5;
const MAX_ASPECT_RATIO = 1.91;
const DEFAULT_ASPECT_RATIO = 4 / 5;

function clampAspectRatio(ratio: number) {
  if (!Number.isFinite(ratio) || ratio <= 0) return DEFAULT_ASPECT_RATIO;
  return Math.min(MAX_ASPECT_RATIO, Math.max(MIN_ASPECT_RATIO, ratio));
}

function useInternalStore({ mediaItems }: { mediaItems: PostMediaItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [naturalSizes, setNaturalSizes] = useState<
    Record<number, { height: number; width: number }>
  >({});

  function reportNaturalSize(index: number, width: number, height: number) {
    setNaturalSizes((sizes) => ({
      ...sizes,
      [index]: { height, width },
    }));
    if (index === 0 && aspectRatio === null) {
      setAspectRatio(clampAspectRatio(width / height));
    }
  }

  function goToIndex(index: number) {
    const element = scrollRef.current;
    if (!element) return;
    const clamped = Math.min(Math.max(index, 0), mediaItems.length - 1);
    element.scrollTo({
      behavior: "smooth",
      left: clamped * element.clientWidth,
    });
  }

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function syncActiveIndexFromScroll(scrollLeft: number, clientWidth: number) {
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  return {
    activeIndex,
    aspectRatio: aspectRatio ?? DEFAULT_ASPECT_RATIO,
    closeLightbox: () => setIsLightboxOpen(false),
    goToIndex,
    isLightboxOpen,
    mediaItems,
    naturalSizes,
    openLightbox,
    reportNaturalSize,
    scrollRef,
    setActiveIndex,
    syncActiveIndexFromScroll,
  };
}

export const { Store: MediaStore, useStore: useMediaStore } =
  createStore(useInternalStore);
