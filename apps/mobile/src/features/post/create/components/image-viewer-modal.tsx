import type { ScrollView } from "react-native";
import { useRef, useState } from "react";
import { Animated, Modal, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";
import {
  CloseButton,
  ThumbnailStrip,
  ViewerCounter,
} from "./image-viewer-controls";
import { ViewerPage } from "./image-viewer-page";

export function ImageViewerModal({
  initialIndex,
  isVisible,
  items,
  onClose,
}: {
  initialIndex: number;
  isVisible: boolean;
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

  if (items.length === 0) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <GestureDetector gesture={dismissGesture}>
          <PagerView
            ref={pagerRef}
            initialPage={initialIndex}
            overdrag
            style={{ flex: 1 }}
            onPageSelected={(event) => selectImage(event.nativeEvent.position)}
          >
            {items.map((item) => (
              <ViewerPage
                item={item}
                key={item.id}
                onPress={() => setControlsShown(!controlsVisible)}
              />
            ))}
          </PagerView>
        </GestureDetector>

        <ViewerCounter
          activeIndex={activeIndex}
          count={items.length}
          isVisible={controlsVisible}
          opacity={controlsOpacity}
          top={insets.top + 14}
        />
        <CloseButton
          isVisible={controlsVisible}
          opacity={controlsOpacity}
          onClose={onClose}
          top={insets.top + 8}
        />
        <ThumbnailStrip
          activeIndex={activeIndex}
          bottom={insets.bottom + 18}
          isVisible={controlsVisible}
          items={items}
          opacity={controlsOpacity}
          scrollRef={thumbnailScrollRef}
          onSelect={(index) => {
            selectImage(index);
            pagerRef.current?.setPage(index);
          }}
        />
      </View>
    </Modal>
  );
}
