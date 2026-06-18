import { Image, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { Play } from "lucide-react-native";

import type { PostMediaItem as UIPostMediaItem } from "../store";
import { useColor } from "~/hooks/use-color";

export function PostMediaItem({
  media,
  onPinchOpen,
}: {
  media: UIPostMediaItem;
  onPinchOpen?: () => void;
}) {
  const foreground = useColor("muted-foreground");
  const hasOpened = useSharedValue(false);

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      hasOpened.value = false;
    })
    .onUpdate((event) => {
      if (event.scale <= 1.08 || hasOpened.value || !onPinchOpen) return;
      hasOpened.value = true;
      runOnJS(onPinchOpen)();
    });

  if (media.mediaType === "video") {
    return (
      <View className="bg-muted flex-1 items-center justify-center gap-2">
        <Play color={foreground} size={32} />
        <Text className="text-muted-foreground text-sm">Video uploaded</Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={pinch}>
      <View className="bg-muted flex-1">
        <Image
          className="size-full"
          resizeMode="cover"
          source={{ uri: media.url }}
        />
      </View>
    </GestureDetector>
  );
}
