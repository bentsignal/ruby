import type {
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { PanResponder, Pressable, Text, View } from "react-native";
import { GripVertical, Trash2 } from "lucide-react-native";

import { cn } from "@acme/std/cn";

import { useCreateStore } from "../store";
import { MediaPreview } from "./media-preview";
import { MediaStatusOverlay } from "./media-status-overlay";

export function MediaTile({
  index,
  itemId,
}: {
  index: number;
  itemId: string;
}) {
  const activeDragItemId = useCreateStore((store) => store.activeDragItemId);
  const beginReorder = useCreateStore((store) => store.beginReorder);
  const endReorder = useCreateStore((store) => store.endReorder);
  const updateReorder = useCreateStore((store) => store.updateReorder);
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => beginReorder(itemId, index),
    onPanResponderMove: (
      _event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => updateReorder(gestureState),
    onPanResponderRelease: endReorder,
    onPanResponderTerminate: endReorder,
    onStartShouldSetPanResponder: () => true,
  });

  return (
    <View className="w-1/2 p-1.5">
      <View
        className={cn(
          "bg-card border-border aspect-[4/5] overflow-hidden rounded-lg border",
          activeDragItemId === itemId && "border-primary opacity-80",
        )}
      >
        <View className="size-full items-center justify-center bg-black">
          <MediaPreview itemId={itemId} />
        </View>
        <View className="absolute inset-x-0 top-0 flex-row items-center justify-between bg-black/45 p-2">
          <View
            className="h-8 flex-row items-center gap-1 rounded-full px-2"
            {...panResponder.panHandlers}
          >
            <GripVertical className="size-4" color="white" />
            <Text className="text-xs font-black text-white">{index + 1}</Text>
          </View>
          <RemoveMediaButton itemId={itemId} />
        </View>
        <MediaStatusOverlay itemId={itemId} />
      </View>
    </View>
  );
}

function RemoveMediaButton({ itemId }: { itemId: string }) {
  const removeItem = useCreateStore((store) => store.removeItem);

  return (
    <Pressable
      className="size-8 items-center justify-center rounded-full bg-black/45"
      onPress={() => removeItem(itemId)}
    >
      <Trash2 className="size-4" size={16} color="white" />
    </Pressable>
  );
}
