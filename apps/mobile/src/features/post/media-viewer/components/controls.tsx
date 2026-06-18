import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Play, X } from "lucide-react-native";

import type { PostMediaItem } from "../../store";
import { useMediaViewerStore } from "../store";

export function ViewerCounter() {
  const activeIndex = useMediaViewerStore((store) => store.activeIndex);
  const controlsOpacity = useMediaViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useMediaViewerStore((store) => store.controlsVisible);
  const count = useMediaViewerStore((store) => store.items.length);
  const top = useMediaViewerStore((store) => store.viewerCounterTop);

  if (count <= 1) return null;

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
  const controlsOpacity = useMediaViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useMediaViewerStore((store) => store.controlsVisible);
  const onClose = useMediaViewerStore((store) => store.onClose);
  const top = useMediaViewerStore((store) => store.closeButtonTop);

  return (
    <Animated.View
      className="absolute right-4 size-11 items-center justify-center rounded-full bg-black/65"
      pointerEvents={controlsVisible ? "auto" : "none"}
      style={{ elevation: 30, opacity: controlsOpacity, top, zIndex: 30 }}
    >
      <Pressable
        accessibilityLabel="Close media viewer"
        accessibilityRole="button"
        className="size-full items-center justify-center"
        onPress={onClose}
      >
        <X color="white" size={24} />
      </Pressable>
    </Animated.View>
  );
}

export function ThumbnailStrip() {
  const activeIndex = useMediaViewerStore((store) => store.activeIndex);
  const bottom = useMediaViewerStore((store) => store.thumbnailStripBottom);
  const controlsOpacity = useMediaViewerStore((store) => store.controlsOpacity);
  const controlsVisible = useMediaViewerStore((store) => store.controlsVisible);
  const items = useMediaViewerStore((store) => store.items);
  const scrollRef = useMediaViewerStore((store) => store.thumbnailScrollRef);
  const selectThumbnail = useMediaViewerStore((store) => store.selectThumbnail);

  if (items.length <= 1) return null;

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
        {items.map((media, index) => (
          <ThumbnailButton
            index={index}
            isActive={index === activeIndex}
            key={`${media.url}-${index}`}
            media={media}
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
  media,
  onPress,
}: {
  index: number;
  isActive: boolean;
  media: PostMediaItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Show item ${index + 1}`}
      accessibilityRole="imagebutton"
      className={[
        "size-14 items-center justify-center overflow-hidden rounded-md border bg-white/10",
        isActive ? "border-white" : "border-white/25",
      ].join(" ")}
      onPress={onPress}
    >
      <ThumbnailMedia media={media} />
    </Pressable>
  );
}

function ThumbnailMedia({ media }: { media: PostMediaItem }) {
  if (media.mediaType === "video") return <Play color="white" size={20} />;

  return (
    <Image
      className="size-full"
      resizeMode="cover"
      source={{ uri: media.url }}
    />
  );
}
