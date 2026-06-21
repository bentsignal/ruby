import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { createStore } from "rostra";

interface MobileProfileFeedStoreProps {
  stickyThreshold: number;
}

function useInternalStore({ stickyThreshold }: MobileProfileFeedStoreProps) {
  const [showStickyProfile, setShowStickyProfile] = useState(false);
  const stickyOpacity = useSharedValue(0);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextShowStickyProfile =
      event.nativeEvent.contentOffset.y > stickyThreshold;

    setShowStickyProfile((current) => {
      if (current === nextShowStickyProfile) return current;
      return nextShowStickyProfile;
    });

    stickyOpacity.value = withTiming(nextShowStickyProfile ? 1 : 0, {
      duration: 160,
    });
  }

  return {
    handleScroll,
    showStickyProfile,
    stickyOpacity,
  };
}

export const {
  Store: MobileProfileFeedStore,
  useStore: useMobileProfileFeedStore,
} = createStore(useInternalStore);
