import type { ScrollView } from "react-native";
import type PagerView from "react-native-pager-view";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { Gesture } from "react-native-gesture-handler";
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
  const pagerRef = useRef<PagerView>(null);
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
    pagerRef.current?.setPage(index);
  }

  function toggleControls() {
    setControlsShown(!controlsVisible);
  }

  function handleZoomChange(zoomed: boolean) {
    setIsZoomed(zoomed);
    if (zoomed && controlsVisible) setControlsShown(false);
  }

  const dismissGesture = Gesture.Pan()
    .enabled(!isZoomed)
    .activeOffsetY([-100_000, 18])
    .failOffsetX([-28, 28])
    .runOnJS(true)
    .onEnd((event) => {
      const shouldClose =
        event.translationY > 110 ||
        (event.translationY > 36 && event.velocityY > 900);

      if (shouldClose) onClose();
    });

  return {
    activeIndex,
    closeButtonTop: insets.top + 8,
    controlsOpacity,
    controlsVisible,
    dismissGesture,
    handleZoomChange,
    initialIndex,
    isZoomed,
    items,
    onClose,
    pagerRef,
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
