import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Host, HStack, List, RNHostView } from "@expo/ui/swift-ui";
import {
  environment,
  listRowInsets,
  listStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { GripVertical } from "lucide-react-native";

import { useSafeAreaInsets } from "~/components/safe-area-view";
import {
  deferReplaceItems,
  deleteItems,
  moveItems,
} from "../lib/reorder-media";
import { useCreateStore } from "../store";
import { NativeManageMediaRow } from "./manage-media-row";

export function ManageMediaButton() {
  const foreground = useCreateStore((store) => store.foreground);
  const items = useCreateStore((store) => store.items);
  const [isVisible, setIsVisible] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <Pressable
        className="border-border bg-card h-12 flex-row items-center justify-center gap-2 rounded-lg border"
        onPress={() => setIsVisible(true)}
      >
        <GripVertical className="size-4" color={foreground} />
        <Text className="text-foreground text-sm font-bold">Manage media</Text>
      </Pressable>
      <ManageMediaModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
}

function ManageMediaModal({
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
        <ManageMediaHeader foreground={foreground} onClose={onClose} />
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
                    <NativeManageMediaRow item={item} />
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

function ManageMediaHeader({
  foreground,
  onClose,
}: {
  foreground: string;
  onClose: () => void;
}) {
  return (
    <View className="border-border h-14 flex-row items-center justify-between border-b px-4">
      <View className="w-14" />
      <Text className="text-foreground text-base font-bold">Manage Media</Text>
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
