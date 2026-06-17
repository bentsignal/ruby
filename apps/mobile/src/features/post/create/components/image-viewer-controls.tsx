import type { RefObject } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { X } from "lucide-react-native";

import type { ComposerItem } from "../types";

export function ViewerCounter({
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

export function CloseButton({
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

export function ThumbnailStrip({
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
  scrollRef: RefObject<ScrollView | null>;
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
