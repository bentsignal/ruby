import type { ScrollView } from "react-native";
import type PagerView from "react-native-pager-view";
import { useRef, useState } from "react";
import { Animated } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { createStore } from "rostra";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";

function useInternalStore({
  initialIndex,
  items,
  onClose,
}: {
  initialIndex: number;
  items: ComposerItem[];
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const thumbnailScrollRef = useRef<ScrollView>(null);
  const [controlsOpacity] = useState(() => new Animated.Value(1));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [controlsVisible, setControlsVisible] = useState(true);

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
      x: Math.max(index * 58 - 96, 0),
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

  const dismissGesture = Gesture.Pan()
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
    controlsOpacity,
    controlsVisible,
    dismissGesture,
    initialIndex,
    items,
    onClose,
    pagerRef,
    selectImage,
    selectThumbnail,
    thumbnailScrollRef,
    toggleControls,
    viewerCounterTop: insets.top + 14,
    closeButtonTop: insets.top + 8,
    thumbnailStripBottom: insets.bottom + 18,
  };
}

export const { Store: ImageViewerStore, useStore: useImageViewerStore } =
  createStore(useInternalStore);
