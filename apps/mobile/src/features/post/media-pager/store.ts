import { useEffect, useState } from "react";
import { Animated, useWindowDimensions } from "react-native";
import { createStore } from "rostra";

import { getPostDisplayAspectRatioValue } from "@acme/config/posts";

import { usePostStore } from "../store";

function useInternalStore() {
  const displayAspectRatio = usePostStore((store) => store.displayAspectRatio);
  const mediaItems = usePostStore((store) => store.mediaItems);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [overlayOpacity] = useState(() => new Animated.Value(1));
  const [heartPopKey, setHeartPopKey] = useState(0);

  const aspectRatio = getPostDisplayAspectRatioValue(displayAspectRatio);

  // eslint-disable-next-line no-restricted-syntax -- Runs the native counter fade sequence.
  useEffect(() => {
    overlayOpacity.stopAnimation();
    if (!hasInteracted) {
      overlayOpacity.setValue(1);
      return;
    }

    if (isScrolling) {
      overlayOpacity.setValue(1);
      return;
    }

    const animation = Animated.sequence([
      Animated.delay(5_000),
      Animated.timing(overlayOpacity, {
        duration: 400,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    return () => animation.stop();
  }, [activeIndex, hasInteracted, isScrolling, overlayOpacity]);

  function openViewer(index: number) {
    setViewerIndex(index);
  }

  function closeViewer() {
    setViewerIndex(null);
  }

  function triggerHeartPop() {
    setHeartPopKey((key) => key + 1);
  }

  function selectPage(index: number) {
    if (index !== activeIndex) setHasInteracted(true);
    setActiveIndex(index);
  }

  function setPageIsScrolling(scrolling: boolean) {
    if (scrolling) setHasInteracted(true);
    setIsScrolling(scrolling);
  }

  return {
    activeIndex,
    closeViewer,
    height: Math.round(width / aspectRatio),
    heartPopKey,
    isMulti: mediaItems.length > 1,
    mediaItems,
    openViewer,
    overlayOpacity,
    selectPage,
    setPageIsScrolling,
    triggerHeartPop,
    viewerIndex,
    width,
  };
}

export const { Store: MediaPagerStore, useStore: useMediaPagerStore } =
  createStore(useInternalStore);
