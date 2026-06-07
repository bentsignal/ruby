import { View } from "react-native";
import { Bookmark, Heart, MessageCircle, Share } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";

export function PostActions() {
  const foreground = useColor("foreground");

  return (
    <View className="mx-2 flex-row items-center gap-6">
      <Heart className="size-4.5" color={foreground} />
      <MessageCircle className="size-3" color={foreground} />
      <Bookmark className="size-3" color={foreground} />
      <View className="flex-1 items-end">
        <Share className="size-3" color={foreground} />
      </View>
    </View>
  );
}
