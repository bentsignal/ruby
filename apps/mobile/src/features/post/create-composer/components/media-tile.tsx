import type {
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { PanResponder, Pressable, Text, View } from "react-native";
import { GripVertical, Trash2 } from "lucide-react-native";

import { cn } from "@acme/std/cn";

import type { ComposerItem } from "../types";
import { MediaPreview } from "./media-preview";
import { MediaStatusOverlay } from "./media-status-overlay";

export function MediaTile({
  activeDragItemId,
  beginReorder,
  endReorder,
  foreground,
  index,
  item,
  removeItem,
  retryItem,
  updateReorder,
}: {
  activeDragItemId: string | null;
  beginReorder: (itemId: string, index: number) => void;
  endReorder: () => void;
  foreground: string;
  index: number;
  item: ComposerItem;
  removeItem: (itemId: string) => void;
  retryItem: (item: ComposerItem) => void;
  updateReorder: (gestureState: PanResponderGestureState) => void;
}) {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => beginReorder(item.id, index),
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
          activeDragItemId === item.id && "border-primary opacity-80",
        )}
      >
        <View className="size-full items-center justify-center bg-black">
          <MediaPreview foreground={foreground} item={item} />
        </View>
        <View className="absolute inset-x-0 top-0 flex-row items-center justify-between bg-black/45 p-2">
          <View
            className="h-8 flex-row items-center gap-1 rounded-full px-2"
            {...panResponder.panHandlers}
          >
            <GripVertical className="size-4" color="white" />
            <Text className="text-xs font-black text-white">{index + 1}</Text>
          </View>
          <Pressable
            className="size-8 items-center justify-center rounded-full bg-black/45"
            onPress={() => removeItem(item.id)}
          >
            <Trash2 className="size-4" size={16} color="white" />
          </Pressable>
        </View>
        <MediaStatusOverlay item={item} retryItem={retryItem} />
      </View>
    </View>
  );
}
