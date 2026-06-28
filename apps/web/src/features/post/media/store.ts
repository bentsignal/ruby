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
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);
  const [hasCarouselInteracted, setHasCarouselInteracted] = useState(false);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);
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
    setHasCarouselInteracted(true);
    element.scrollTo({
      behavior: "smooth",
      left: clamped * element.clientWidth,
    });
  }

  function goToNext() {
    goToIndex(carouselActiveIndex + 1);
  }

  function goToPrevious() {
    goToIndex(carouselActiveIndex - 1);
  }

  function markCarouselInteracted() {
    setHasCarouselInteracted(true);
  }

  function openLightbox(index: number) {
    setLightboxActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function syncActiveIndexFromScroll(scrollLeft: number, clientWidth: number) {
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== carouselActiveIndex) {
      setHasCarouselInteracted(true);
      setCarouselActiveIndex(index);
    }
  }

  const carouselControls =
    mediaItems.length > 1
      ? {
          counterAnimationKey: `${carouselActiveIndex}-${hasCarouselInteracted}`,
          counterLabel: `${carouselActiveIndex + 1} / ${mediaItems.length}`,
          isCounterFadeEnabled: hasCarouselInteracted,
          nextHidden: carouselActiveIndex === mediaItems.length - 1,
          previousHidden: carouselActiveIndex === 0,
        }
      : null;

  return {
    aspectRatio: aspectRatio ?? DEFAULT_ASPECT_RATIO,
    carouselControls,
    closeLightbox: () => setIsLightboxOpen(false),
    goToNext,
    goToPrevious,
    isLightboxOpen,
    lightboxActiveIndex,
    mediaItems,
    markCarouselInteracted,
    naturalSizes,
    openLightbox,
    reportNaturalSize,
    scrollRef,
    setLightboxActiveIndex,
    syncActiveIndexFromScroll,
  };
}

export const { Store: MediaStore, useStore: useMediaStore } =
  createStore(useInternalStore);
