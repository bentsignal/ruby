import { Pressable, Text, View } from "react-native";

import { isPreviewableImage } from "../lib/media-type";
import { useComposerItem } from "../store";
import { MediaPreview } from "./media-preview";
import { MediaStatusOverlay } from "./media-status-overlay";

export function MediaTile({
  index,
  itemId,
  onImagePress,
}: {
  index: number;
  itemId: string;
  onImagePress?: () => void;
}) {
  const item = useComposerItem(itemId);
  const isImage = item ? isPreviewableImage(item) : false;

  return (
    <View className="w-36">
      <View className="bg-card border-border aspect-[4/5] overflow-hidden rounded-lg border">
        <MediaPreviewFrame
          index={index}
          itemId={itemId}
          onImagePress={isImage ? onImagePress : undefined}
        />
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

function MediaPreviewFrame({
  index,
  itemId,
  onImagePress,
}: {
  index: number;
  itemId: string;
  onImagePress?: () => void;
}) {
  if (onImagePress) {
    return (
      <Pressable
        accessibilityLabel={`Preview image ${index + 1}`}
        accessibilityRole="imagebutton"
        className="size-full items-center justify-center bg-black"
        onPress={onImagePress}
      >
        <MediaPreview itemId={itemId} />
      </Pressable>
    );
  }

  return (
    <View className="size-full items-center justify-center bg-black">
      <MediaPreview itemId={itemId} />
    </View>
  );
}
