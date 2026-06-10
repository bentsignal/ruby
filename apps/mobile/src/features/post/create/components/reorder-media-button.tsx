import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Host, HStack, List, RNHostView } from "@expo/ui/swift-ui";
import {
  environment,
  listRowInsets,
  listStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { GripVertical } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";
import { useCreateStore } from "../store";
import { MediaPreview } from "./media-preview";

export function ReorderMediaButton() {
  const foreground = useCreateStore((store) => store.foreground);
  const items = useCreateStore((store) => store.items);
  const [isVisible, setIsVisible] = useState(false);

  if (items.length < 2) return null;

  return (
    <>
      <Pressable
        className="border-border bg-card h-12 flex-row items-center justify-center gap-2 rounded-lg border"
        onPress={() => setIsVisible(true)}
      >
        <GripVertical className="size-4" color={foreground} />
        <Text className="text-foreground text-sm font-bold">Reorder media</Text>
      </Pressable>
      {isVisible ? (
        <ReorderMediaModal
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      ) : null}
    </>
  );
}

function ReorderMediaModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const foreground = useCreateStore((store) => store.foreground);
  const items = useCreateStore((store) => store.items);
  const replaceItems = useCreateStore((store) => store.replaceItems);
  const [orderedItems, setOrderedItems] = useState(items);

  function handleMove(sourceIndices: number[], destination: number) {
    const nextItems = moveItems(orderedItems, sourceIndices, destination);
    setOrderedItems(nextItems);
    deferReplaceItems(replaceItems, nextItems);
  }

  function handleDelete(indices: number[]) {
    const nextItems = deleteItems(orderedItems, indices);
    setOrderedItems(nextItems);
    deferReplaceItems(replaceItems, nextItems);
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        className="bg-background flex-1"
        style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
      >
        <ReorderMediaHeader foreground={foreground} onClose={onClose} />
        <Host style={{ flex: 1 }}>
          <List
            modifiers={[
              environment("editMode", "active"),
              listStyle("insetGrouped"),
            ]}
          >
            <List.ForEach onDelete={handleDelete} onMove={handleMove}>
              {orderedItems.map((item) => (
                <HStack
                  key={item.id}
                  modifiers={[
                    tag(item.id),
                    listRowInsets({
                      bottom: 8,
                      leading: 16,
                      top: 8,
                      trailing: 16,
                    }),
                  ]}
                >
                  <RNHostView matchContents>
                    <NativeReorderMediaRow item={item} />
                  </RNHostView>
                </HStack>
              ))}
            </List.ForEach>
          </List>
        </Host>
      </View>
    </Modal>
  );
}

function ReorderMediaHeader({
  foreground,
  onClose,
}: {
  foreground: string;
  onClose: () => void;
}) {
  return (
    <View className="border-border h-14 flex-row items-center justify-between border-b px-4">
      <View className="w-14" />
      <Text className="text-foreground text-base font-bold">Reorder Media</Text>
      <Pressable
        className="min-h-10 min-w-14 items-end justify-center"
        onPress={onClose}
      >
        <Text className="text-base font-bold" style={{ color: foreground }}>
          Done
        </Text>
      </Pressable>
    </View>
  );
}

function NativeReorderMediaRow({ item }: { item: ComposerItem }) {
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const { width } = useWindowDimensions();

  return (
    <View
      className="h-20 flex-row items-center gap-3"
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
          {item.file.type === "video" ? "Video" : "Photo"}
        </Text>
      </View>
    </View>
  );
}

function getMediaTitle(item: ComposerItem) {
  return item.file.fileName ?? (item.file.type === "video" ? "Video" : "Photo");
}

function moveItems(
  items: ComposerItem[],
  sourceIndices: number[],
  destination: number,
) {
  const sourceIndex = sourceIndices[0];
  if (sourceIndex === undefined) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);
  if (!movedItem) return items;

  const adjustedDestination =
    sourceIndex < destination ? destination - 1 : destination;
  nextItems.splice(adjustedDestination, 0, movedItem);
  return nextItems;
}

function deleteItems(items: ComposerItem[], indices: number[]) {
  const indicesToDelete = new Set(indices);
  return items.filter((_, index) => !indicesToDelete.has(index));
}

function deferReplaceItems(
  replaceItems: (nextItems: ComposerItem[]) => void,
  nextItems: ComposerItem[],
) {
  setTimeout(() => replaceItems(nextItems), 0);
}
