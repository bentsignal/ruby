import { Text, View } from "react-native";

import { MediaPreview } from "./media-preview";
import { MediaStatusOverlay } from "./media-status-overlay";

export function MediaTile({
  index,
  itemId,
}: {
  index: number;
  itemId: string;
}) {
  return (
    <View className="w-36">
      <View className="bg-card border-border aspect-[4/5] overflow-hidden rounded-lg border">
        <View className="size-full items-center justify-center bg-black">
          <MediaPreview itemId={itemId} />
        </View>
        <View className="absolute top-2 left-2">
          <View className="h-8 flex-row items-center rounded-full bg-black/85 px-3">
            <Text className="text-xs font-black text-white">{index + 1}</Text>
          </View>
        </View>
        <MediaStatusOverlay itemId={itemId} />
      </View>
    </View>
  );
}
