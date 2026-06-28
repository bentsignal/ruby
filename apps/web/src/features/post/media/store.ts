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
    element.scrollTo({
      behavior: "smooth",
      left: clamped * element.clientWidth,
    });
  }

  function openLightbox(index: number) {
    setLightboxActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function syncActiveIndexFromScroll(scrollLeft: number, clientWidth: number) {
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== carouselActiveIndex) setCarouselActiveIndex(index);
  }

  return {
    aspectRatio: getPostDisplayAspectRatioValue(displayAspectRatio),
    carouselActiveIndex,
    closeLightbox: () => setIsLightboxOpen(false),
    goToIndex,
    isLightboxOpen,
    lightboxActiveIndex,
    mediaItems,
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
