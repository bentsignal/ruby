import type { ScrollView } from "react-native";
import type { GalleryRefType } from "react-native-zoom-toolkit";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { createStore } from "rostra";

import type { PostMediaItem } from "../store";
import { useSafeAreaInsets } from "~/components/safe-area-view";

const THUMBNAIL_STEP = 64;

function useInternalStore({
  initialIndex,
  items,
  onClose,
}: {
  initialIndex: number;
  items: PostMediaItem[];
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const galleryRef = useRef<GalleryRefType>(null);
  const thumbnailScrollRef = useRef<ScrollView>(null);
  const [controlsOpacity] = useState(() => new Animated.Value(1));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  function setControlsShown(isShown: boolean) {
    setControlsVisible(isShown);
    Animated.timing(controlsOpacity, {
      duration: 180,
      toValue: isShown ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }

  function scrollThumbnailTo(index: number) {
    thumbnailScrollRef.current?.scrollTo({
      animated: true,
      x: Math.max(index * THUMBNAIL_STEP - 96, 0),
    });
  }

  function selectImage(index: number) {
    setActiveIndex(index);
    scrollThumbnailTo(index);
  }

  function selectThumbnail(index: number) {
    selectImage(index);
    galleryRef.current?.setIndex(index);
    galleryRef.current?.reset(false);
  }

  function toggleControls() {
    setControlsVisible((current) => {
      const next = !current;

      Animated.timing(controlsOpacity, {
        duration: 180,
        toValue: next ? 1 : 0,
        useNativeDriver: true,
      }).start();

      return next;
    });
  }

  function handleZoomChange(zoomed: boolean) {
    setIsZoomed(zoomed);
    if (zoomed) setControlsShown(false);
  }

  return {
    activeIndex,
    closeButtonTop: insets.top + 8,
    controlsOpacity,
    controlsVisible,
    galleryRef,
    handleZoomChange,
    initialIndex,
    isZoomed,
    items,
    onClose,
    selectImage,
    selectThumbnail,
    thumbnailScrollRef,
    thumbnailStripBottom: insets.bottom + 18,
    toggleControls,
    viewerCounterTop: insets.top + 14,
  };
}

export const { Store: MediaViewerStore, useStore: useMediaViewerStore } =
  createStore(useInternalStore);
