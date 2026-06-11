import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { X } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";

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

function ViewerPage({
  item,
  onPress,
}: {
  item: ComposerItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="flex-1 items-center justify-center bg-black"
      onPress={onPress}
    >
      <Image
        className="size-full"
        resizeMode="contain"
        source={{ uri: item.file.uri }}
      />
    </Pressable>
  );
}

function ViewerCounter({
  activeIndex,
  count,
  isVisible,
  opacity,
  top,
}: {
  activeIndex: number;
  count: number;
  isVisible: boolean;
  opacity: Animated.Value;
  top: number;
}) {
  return (
    <Animated.View
      className="absolute right-0 left-0 items-center"
      pointerEvents={isVisible ? "auto" : "none"}
      style={{ opacity, top, zIndex: 20 }}
    >
      <View className="rounded-full bg-black/55 px-4 py-2">
        <Text className="text-sm font-black text-white">
          {activeIndex + 1} of {count}
        </Text>
      </View>
    </Animated.View>
  );
}

function CloseButton({
  isVisible,
  opacity,
  onClose,
  top,
}: {
  isVisible: boolean;
  opacity: Animated.Value;
  onClose: () => void;
  top: number;
}) {
  return (
    <Animated.View
      className="absolute right-4 size-11 items-center justify-center rounded-full bg-black/65"
      pointerEvents={isVisible ? "auto" : "none"}
      style={{ elevation: 30, opacity, top, zIndex: 30 }}
    >
      <Pressable
        accessibilityLabel="Close image preview"
        accessibilityRole="button"
        className="size-full items-center justify-center"
        onPress={onClose}
      >
        <X className="size-6" color="white" />
      </Pressable>
    </Animated.View>
  );
}

function ThumbnailStrip({
  activeIndex,
  bottom,
  isVisible,
  items,
  opacity,
  scrollRef,
  onSelect,
}: {
  activeIndex: number;
  bottom: number;
  isVisible: boolean;
  items: ComposerItem[];
  opacity: Animated.Value;
  scrollRef: React.RefObject<ScrollView | null>;
  onSelect: (index: number) => void;
}) {
  return (
    <Animated.View
      className="absolute right-0 left-0"
      pointerEvents={isVisible ? "auto" : "none"}
      style={{ bottom, elevation: 20, opacity, zIndex: 20 }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        contentContainerClassName="gap-2 px-4"
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <ThumbnailButton
            index={index}
            isActive={index === activeIndex}
            item={item}
            key={item.id}
            onPress={() => onSelect(index)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function ThumbnailButton({
  index,
  isActive,
  item,
  onPress,
}: {
  index: number;
  isActive: boolean;
  item: ComposerItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Show image ${index + 1}`}
      accessibilityRole="imagebutton"
      className={[
        "size-14 overflow-hidden rounded-md border",
        isActive ? "border-white" : "border-white/25",
      ].join(" ")}
      onPress={onPress}
    >
      <Image
        className="size-full"
        resizeMode="cover"
        source={{ uri: item.file.uri }}
      />
    </Pressable>
  );
}
