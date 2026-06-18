import { Modal, Pressable, Text, View } from "react-native";
import { GripVertical, X } from "lucide-react-native";

import { ManageMediaList } from "./components/list.android";
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
  const insets = useManageMediaStore((store) => store.insets);
  const isVisible = useManageMediaStore((store) => store.isVisible);

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
        <ManageMediaList />
      </View>
    </Modal>
  );
}

function ManageMediaHeader() {
  const closeModal = useManageMediaStore((store) => store.closeModal);
  const foreground = useManageMediaStore((store) => store.foreground);

  return (
    <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
      <Text className="text-foreground text-xl font-black">Manage media</Text>
      <Pressable
        className="bg-card size-10 items-center justify-center rounded-full"
        onPress={closeModal}
      >
        <X className="size-5" color={foreground} />
      </Pressable>
    </View>
  );
}
