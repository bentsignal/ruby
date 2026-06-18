import { Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Play } from "lucide-react-native";

import type { PostMediaItem } from "../../store";
import { useViewerPageGesture } from "../../hooks/use-viewer-page-gesture";

export function ViewerPage({ media }: { media: PostMediaItem }) {
  const { animatedStyle, gesture, imageFrameStyle } = useViewerPageGesture();

  if (media.mediaType === "video") {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-black">
        <Play color="white" size={40} />
        <Text className="text-sm text-white/70">Video</Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1 items-center justify-center bg-black">
        <Animated.Image
          resizeMode="contain"
          source={{ uri: media.url }}
          style={[imageFrameStyle, animatedStyle]}
        />
      </View>
    </GestureDetector>
  );
}
