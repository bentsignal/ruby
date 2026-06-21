import { Pressable, Text, View } from "react-native";
import { Bookmark, Heart, MessageCircle } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { PostInfoButton } from "../details/components/post-info-button";
import { usePostStore } from "../store";

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
      <Pressable className="flex-row items-center gap-2" hitSlop={8}>
        <MessageCircle color={foreground} size={22} />
        <Text className="text-muted-foreground text-[13px] font-medium">
          Open comments
        </Text>
      </Pressable>
      <View className="flex-1" />
      <View className="flex-row items-center gap-6">
        <PostInfoButton />
        <Pressable
          accessibilityLabel="Bookmark"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Bookmark color={foreground} size={22} />
        </Pressable>
      </View>
    </View>
  );
}
