import { Image, Text, View } from "react-native";
import { Play } from "lucide-react-native";

import type { PostMediaItem as UIPostMediaItem } from "../store";
import { useColor } from "~/hooks/use-color";

export function PostMediaItem({ media }: { media: UIPostMediaItem }) {
  const foreground = useColor("foreground");

  return (
    <View
      className="bg-muted items-center justify-center"
      collapsable={false}
      style={{ height: 280, width: "100%" }}
    >
      {media.mediaType === "video" ? (
        <View className="items-center gap-2">
          <Play className="size-8" color={foreground} />
          <Text className="text-muted-foreground text-sm">Video uploaded</Text>
        </View>
      ) : (
        <Image
          resizeMode="cover"
          source={{ uri: media.url }}
          style={{ height: 280, width: "100%" }}
        />
      )}
    </View>
  );
}
