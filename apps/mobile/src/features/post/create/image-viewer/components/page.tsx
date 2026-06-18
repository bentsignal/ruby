import { Image, Pressable } from "react-native";

import type { ComposerItem } from "../../types";
import { useImageViewerStore } from "../store";

export function ViewerPage({ item }: { item: ComposerItem }) {
  const toggleControls = useImageViewerStore((store) => store.toggleControls);

  return (
    <Pressable
      className="flex-1 items-center justify-center bg-black"
      onPress={toggleControls}
    >
      <Image
        className="size-full"
        resizeMode="contain"
        source={{ uri: item.file.uri }}
      />
    </Pressable>
  );
}
