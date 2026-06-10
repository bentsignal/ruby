import { useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { GripVertical, X } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";
import { useCreateStore } from "../store";
import { ManageMediaList } from "./reorder-media-list.android";

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
      {isVisible ? (
        <ManageMediaModal
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      ) : null}
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
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndexRef = useRef(0);
  const hoverIndexRef = useRef(0);

  function startDrag(itemId: string, index: number) {
    activeIndexRef.current = index;
    hoverIndexRef.current = index;
    setActiveItemId(itemId);
    setActiveIndex(index);
    setHoverIndex(index);
  }

  function updateHoverIndex(index: number) {
    if (index === hoverIndexRef.current) return;

    hoverIndexRef.current = index;
    setHoverIndex(index);
  }

  function finishDrag() {
    const nextItems = moveItem(
      orderedItems,
      activeIndexRef.current,
      hoverIndexRef.current,
    );

    setOrderedItems(nextItems);
    replaceItems(nextItems);
    setActiveItemId(null);
    setActiveIndex(null);
    setHoverIndex(null);
  }

  function deleteItem(itemId: string) {
    const nextItems = orderedItems.filter((item) => item.id !== itemId);
    setOrderedItems(nextItems);
    replaceItems(nextItems);
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
        <ManageMediaList
          activeIndex={activeIndex}
          activeItemId={activeItemId}
          foreground={foreground}
          hoverIndex={hoverIndex}
          itemCount={orderedItems.length}
          items={orderedItems}
          onDragFinish={finishDrag}
          onDragStart={startDrag}
          onItemDelete={deleteItem}
          onHoverIndexChange={updateHoverIndex}
        />
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
    <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
      <Text className="text-foreground text-xl font-black">Manage media</Text>
      <Pressable
        className="bg-card size-10 items-center justify-center rounded-full"
        onPress={onClose}
      >
        <X className="size-5" color={foreground} />
      </Pressable>
    </View>
  );
}

function moveItem(items: ComposerItem[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  if (!movedItem) return items;

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}
