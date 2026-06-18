import { Image, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Play } from "lucide-react-native";

import type { PostMediaItem as UIPostMediaItem } from "../store";
import { useColor } from "~/hooks/use-color";
import { usePostMediaPinchOpen } from "../hooks/use-post-media-pinch-open";

export function PostMediaItem({
  index,
  media,
}: {
  index: number;
  media: UIPostMediaItem;
}) {
  const foreground = useColor("muted-foreground");
  const pinch = usePostMediaPinchOpen(index);

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
