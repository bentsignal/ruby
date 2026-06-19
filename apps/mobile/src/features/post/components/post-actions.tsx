import { Pressable, View } from "react-native";
import { Heart, MessageCircle } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { usePostStore } from "../store";
import { PostMoreButton } from "./post-more-button";

export function PostActions() {
  const foreground = useColor("muted-foreground");
  const primary = useColor("primary");
  const likedByMe = usePostStore((store) => store.likedByMe);
  const toggleLike = usePostStore((store) => store.toggleLike);

  return (
    <View className="mx-2 flex-row items-center gap-6">
      <Pressable hitSlop={8} onPress={toggleLike}>
        <Heart
          color={likedByMe ? primary : foreground}
          fill={likedByMe ? primary : "none"}
          size={22}
        />
      </Pressable>
      <Pressable hitSlop={8}>
        <MessageCircle color={foreground} size={22} />
      </Pressable>
      <View className="flex-1 items-end">
        <PostMoreButton />
      </View>
    </View>
  );
}
