import { Pressable, Text, View } from "react-native";

import { MediaPreview } from "../../components/media-preview";
import { MediaStatusOverlay } from "../../components/media-status-overlay";
import { isPreviewableImage } from "../../lib/media-type";
import { useComposerItem } from "../../store";
import { useMediaGridStore } from "../store";

export function MediaTile({
  index,
  itemId,
}: {
  index: number;
  itemId: string;
}) {
  const item = useComposerItem(itemId);
  const isImage = item ? isPreviewableImage(item) : false;

  return (
    <View className="w-36">
      <View className="bg-card border-border aspect-[4/5] overflow-hidden rounded-lg border">
        <MediaPreviewFrame index={index} isImage={isImage} itemId={itemId} />
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
  isImage,
  itemId,
}: {
  index: number;
  isImage: boolean;
  itemId: string;
}) {
  const openPreview = useMediaGridStore((store) => store.openPreview);

  if (isImage) {
    return (
      <Pressable
        accessibilityLabel={`Preview image ${index + 1}`}
        accessibilityRole="imagebutton"
        className="size-full items-center justify-center bg-black"
        onPress={() => openPreview(itemId)}
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
