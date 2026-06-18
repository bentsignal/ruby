import { Modal, Pressable, Text, View } from "react-native";
import { Host, HStack, List, RNHostView } from "@expo/ui/swift-ui";
import {
  environment,
  listRowInsets,
  listStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { GripVertical } from "lucide-react-native";

import { NativeManageMediaRow } from "./components/native-row";
import { ManageMediaStore, useManageMediaStore } from "./store";

export function ManageMediaButton() {
  return (
    <ManageMediaStore>
      <ManageMediaButtonContent />
      <ManageMediaModal />
    </ManageMediaStore>
  );
}

function ManageMediaButtonContent() {
  const foreground = useManageMediaStore((store) => store.foreground);
  const items = useManageMediaStore((store) => store.items);
  const openModal = useManageMediaStore((store) => store.openModal);

  if (items.length === 0) return null;

  return (
    <>
      <Pressable
        className="border-border bg-card h-12 flex-row items-center justify-center gap-2 rounded-lg border"
        onPress={openModal}
      >
        <GripVertical className="size-4" color={foreground} />
        <Text className="text-foreground text-sm font-bold">Manage media</Text>
      </Pressable>
    </>
  );
}

function ManageMediaModal() {
  const closeModal = useManageMediaStore((store) => store.closeModal);
  const handleDelete = useManageMediaStore((store) => store.handleDelete);
  const handleMove = useManageMediaStore((store) => store.handleMove);
  const insets = useManageMediaStore((store) => store.insets);
  const isVisible = useManageMediaStore((store) => store.isVisible);
  const orderedItems = useManageMediaStore((store) => store.orderedItems);

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View
        className="bg-background flex-1"
        style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
      >
        <ManageMediaHeader />
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

function ManageMediaHeader() {
  const closeModal = useManageMediaStore((store) => store.closeModal);
  const foreground = useManageMediaStore((store) => store.foreground);

  return (
    <View className="border-border h-14 flex-row items-center justify-between border-b px-4">
      <View className="w-14" />
      <Text className="text-foreground text-base font-bold">Manage Media</Text>
      <Pressable
        className="min-h-10 min-w-14 items-end justify-center"
        onPress={closeModal}
      >
        <Text className="text-base font-bold" style={{ color: foreground }}>
          Done
        </Text>
      </Pressable>
    </View>
  );
}
