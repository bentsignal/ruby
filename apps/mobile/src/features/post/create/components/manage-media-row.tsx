import { Text, useWindowDimensions, View } from "react-native";

import type { ComposerItem } from "../types";
import { getMediaTitle, getMediaTypeLabel } from "../lib/reorder-media";
import { useCreateStore } from "../store";
import { MediaPreview } from "./media-preview";

export function NativeManageMediaRow({ item }: { item: ComposerItem }) {
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const { width } = useWindowDimensions();

  return (
    <View
      className="h-20 flex-row items-center gap-3 pl-3"
      style={{ width: Math.max(width - 112, 220) }}
    >
      <View className="size-16 overflow-hidden rounded-md bg-black">
        <MediaPreview itemId={item.id} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-foreground text-sm font-bold" numberOfLines={1}>
          {getMediaTitle(item)}
        </Text>
        <Text
          className="mt-1 text-xs font-semibold"
          numberOfLines={1}
          style={{ color: mutedForeground }}
        >
          {getMediaTypeLabel(item)}
        </Text>
      </View>
    </View>
  );
}
