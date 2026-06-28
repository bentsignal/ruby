import { useRef, useState } from "react";
import { createStore } from "rostra";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import { getPostDisplayAspectRatioValue } from "@acme/config/posts";

import type { PostMediaItem } from "../store";

function useInternalStore({
  displayAspectRatio,
  mediaItems,
}: {
  displayAspectRatio: PostDisplayAspectRatio;
  mediaItems: PostMediaItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);
  const [hasCarouselInteracted, setHasCarouselInteracted] = useState(false);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [naturalSizes, setNaturalSizes] = useState<
    Record<number, { height: number; width: number }>
  >({});

  function reportNaturalSize(index: number, width: number, height: number) {
    setNaturalSizes((sizes) => ({
      ...sizes,
      [index]: { height, width },
    }));
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
    aspectRatio: getPostDisplayAspectRatioValue(displayAspectRatio),
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
