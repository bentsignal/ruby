import { Pressable, Text, View } from "react-native";
import { CircleAlert, LoaderCircle } from "lucide-react-native";

import { useComposerItem, useCreateStore } from "../store";

export function MediaStatusOverlay({ itemId }: { itemId: string }) {
  const item = useComposerItem(itemId);

  if (!item) return null;
  if (item.status === "ready" || item.status === "uploaded") return null;

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/55 px-6">
      <StatusContent itemId={itemId} />
    </View>
  );
}

function StatusContent({ itemId }: { itemId: string }) {
  const item = useComposerItem(itemId);
  const retryItem = useCreateStore((store) => store.retryItem);

  if (!item) return null;

  if (item.status === "uploading") {
    return (
      <View className="items-center gap-3">
        <LoaderCircle className="size-7" color="white" />
        <Text className="text-sm font-bold text-white">Uploading</Text>
      </View>
    );
  }

  return (
    <Pressable className="items-center gap-3" onPress={() => retryItem(item)}>
      <CircleAlert className="size-7" color="white" />
      <Text className="text-center text-sm font-bold text-white">
        {item.error ?? "Upload failed"}
      </Text>
      <Text className="text-xs font-semibold text-white/80">Tap to retry</Text>
    </Pressable>
  );
}
