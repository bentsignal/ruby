import { Image, Text, View } from "react-native";
import { Clapperboard, Play } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { useComposerItem, useCreateStore } from "../store";

export function MediaPreview({ itemId }: { itemId: string }) {
  const foreground = useCreateStore((store) => store.foreground);
  const item = useComposerItem(itemId);

  if (!item) return null;

  if (item.file.type === "video") {
    return <VideoPreview foreground={foreground} item={item} />;
  }

  return (
    <Image
      className="size-full"
      resizeMode="cover"
      source={{ uri: item.file.uri }}
    />
  );
}

function VideoPreview({
  foreground,
  item,
}: {
  foreground: string;
  item: ComposerItem;
}) {
  return (
    <View className="items-center gap-3 px-8">
      <View className="size-16 items-center justify-center rounded-full bg-white/10">
        <Play className="size-9" color="white" />
      </View>
      <Text className="text-center text-sm font-semibold text-white">
        {item.file.fileName ?? "Video selected"}
      </Text>
      <Clapperboard className="size-5" color={foreground} />
    </View>
  );
}
