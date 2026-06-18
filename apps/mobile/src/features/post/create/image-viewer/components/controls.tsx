import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { X } from "lucide-react-native";

import type { ComposerItem } from "../../types";
import { useImageViewerStore } from "../store";

export function ViewerCounter() {
  const activeIndex = useImageViewerStore((store) => store.activeIndex);
  const controlsOpacity = useImageViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useImageViewerStore((store) => store.controlsVisible);
  const count = useImageViewerStore((store) => store.items.length);
  const top = useImageViewerStore((store) => store.viewerCounterTop);

  return (
    <Animated.View
      className="absolute right-0 left-0 items-center"
      pointerEvents={controlsVisible ? "auto" : "none"}
      style={{ opacity: controlsOpacity, top, zIndex: 20 }}
    >
      <View className="rounded-full bg-black/55 px-4 py-2">
        <Text className="text-sm font-black text-white">
          {activeIndex + 1} of {count}
        </Text>
      </View>
    </Animated.View>
  );
}

export function CloseButton() {
  const controlsOpacity = useImageViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useImageViewerStore((store) => store.controlsVisible);
  const onClose = useImageViewerStore((store) => store.onClose);
  const top = useImageViewerStore((store) => store.closeButtonTop);

  return (
    <Animated.View
      className="absolute right-4 size-11 items-center justify-center rounded-full bg-black/65"
      pointerEvents={controlsVisible ? "auto" : "none"}
      style={{ elevation: 30, opacity: controlsOpacity, top, zIndex: 30 }}
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

export function ThumbnailStrip() {
  const activeIndex = useImageViewerStore((store) => store.activeIndex);
  const bottom = useImageViewerStore((store) => store.thumbnailStripBottom);
  const controlsOpacity = useImageViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useImageViewerStore((store) => store.controlsVisible);
  const items = useImageViewerStore((store) => store.items);
  const scrollRef = useImageViewerStore((store) => store.thumbnailScrollRef);
  const selectThumbnail = useImageViewerStore((store) => store.selectThumbnail);

  return (
    <Animated.View
      className="absolute right-0 left-0"
      pointerEvents={controlsVisible ? "auto" : "none"}
      style={{ bottom, elevation: 20, opacity: controlsOpacity, zIndex: 20 }}
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
            onPress={() => selectThumbnail(index)}
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
