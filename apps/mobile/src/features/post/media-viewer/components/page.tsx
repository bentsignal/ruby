import { Image, Text, useWindowDimensions, View } from "react-native";
import { Play } from "lucide-react-native";

import type { PostMediaItem } from "../../store";

export function ViewerPage({ media }: { media: PostMediaItem }) {
  const { height, width } = useWindowDimensions();
  const pageStyle = { height, width };

  if (media.mediaType === "video") {
    return (
      <View
        className="items-center justify-center gap-2 bg-black"
        style={pageStyle}
      >
        <Play color="white" size={40} />
        <Text className="text-sm text-white/70">Video</Text>
      </View>
    );
  }

  return (
    <Image
      className="bg-black"
      resizeMode="contain"
      source={{ uri: media.url }}
      style={pageStyle}
    />
  );
}
