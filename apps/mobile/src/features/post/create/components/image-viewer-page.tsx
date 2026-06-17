import { Image, Pressable } from "react-native";

import type { ComposerItem } from "../types";

export function ViewerPage({
  item,
  onPress,
}: {
  item: ComposerItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="flex-1 items-center justify-center bg-black"
      onPress={onPress}
    >
      <Image
        className="size-full"
        resizeMode="contain"
        source={{ uri: item.file.uri }}
      />
    </Pressable>
  );
}
