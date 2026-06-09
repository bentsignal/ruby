import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";
import { GripVertical, X } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";
import { useCreateStore } from "../store";
import { MediaPreview } from "./media-preview";

const ROW_HEIGHT = 92;
const ROW_GAP = 12;
const ROW_STEP = ROW_HEIGHT + ROW_GAP;

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
        <ReorderMediaList
          activeIndex={activeIndex}
          activeItemId={activeItemId}
          foreground={foreground}
          hoverIndex={hoverIndex}
          itemCount={orderedItems.length}
          items={orderedItems}
          onDragFinish={finishDrag}
          onDragStart={startDrag}
          onHoverIndexChange={updateHoverIndex}
        />
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
    <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
      <Text className="text-foreground text-xl font-black">Reorder media</Text>
      <Pressable
        className="bg-card size-10 items-center justify-center rounded-full"
        onPress={onClose}
      >
        <X className="size-5" color={foreground} />
      </Pressable>
    </View>
  );
}

function ReorderMediaList({
  activeIndex,
  activeItemId,
  foreground,
  hoverIndex,
  itemCount,
  items,
  onDragFinish,
  onDragStart,
  onHoverIndexChange,
}: {
  activeIndex: number | null;
  activeItemId: string | null;
  foreground: string;
  hoverIndex: number | null;
  itemCount: number;
  items: ComposerItem[];
  onDragFinish: () => void;
  onDragStart: (itemId: string, index: number) => void;
  onHoverIndexChange: (index: number) => void;
}) {
  return (
    <View className="flex-1 px-4 py-4">
      {items.map((item, index) => (
        <ReorderMediaRow
          activeIndex={activeIndex}
          activeItemId={activeItemId}
          foreground={foreground}
          hoverIndex={hoverIndex}
          index={index}
          item={item}
          itemCount={itemCount}
          key={item.id}
          onDragFinish={onDragFinish}
          onDragStart={onDragStart}
          onHoverIndexChange={onHoverIndexChange}
        />
      ))}
    </View>
  );
}

function ReorderMediaRow({
  activeIndex,
  activeItemId,
  foreground,
  hoverIndex,
  index,
  item,
  itemCount,
  onDragFinish,
  onDragStart,
  onHoverIndexChange,
}: {
  activeIndex: number | null;
  activeItemId: string | null;
  foreground: string;
  hoverIndex: number | null;
  index: number;
  item: ComposerItem;
  itemCount: number;
  onDragFinish: () => void;
  onDragStart: (itemId: string, index: number) => void;
  onHoverIndexChange: (index: number) => void;
}) {
  const [dragY] = useState(() => new Animated.Value(0));
  const isActive = activeItemId === item.id;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      dragY.setValue(0);
      onDragStart(item.id, index);
    },
    onPanResponderMove: (_, gesture) => {
      dragY.setValue(gesture.dy);
      onHoverIndexChange(
        clamp(index + Math.round(gesture.dy / ROW_STEP), 0, itemCount - 1),
      );
    },
    onPanResponderRelease: () => {
      dragY.setValue(0);
      onDragFinish();
    },
    onPanResponderTerminate: () => {
      dragY.setValue(0);
      onDragFinish();
    },
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
  });
  const transform = getRowTransform({
    activeIndex,
    dragY,
    hoverIndex,
    index,
    isActive,
  });

  return (
    <Animated.View
      style={{
        marginBottom: ROW_GAP,
        transform,
        zIndex: isActive ? 1 : 0,
      }}
    >
      <View className="bg-card border-border h-[92px] flex-row items-center gap-3 rounded-lg border p-2">
        <View className="aspect-square h-full overflow-hidden rounded-md bg-black">
          <MediaPreview itemId={item.id} />
        </View>
        <View className="min-w-0 flex-1" />
        <View
          className="h-full w-14 items-center justify-center rounded-md"
          hitSlop={8}
          {...panResponder.panHandlers}
        >
          <GripVertical className="size-6" color={foreground} />
        </View>
      </View>
    </Animated.View>
  );
}

function getRowTransform({
  activeIndex,
  dragY,
  hoverIndex,
  index,
  isActive,
}: {
  activeIndex: number | null;
  dragY: Animated.Value;
  hoverIndex: number | null;
  index: number;
  isActive: boolean;
}) {
  if (isActive) return [{ translateY: dragY }];
  if (activeIndex === null || hoverIndex === null) return [];

  const translateY = getInactiveRowTranslateY(activeIndex, hoverIndex, index);
  return translateY === 0 ? [] : [{ translateY }];
}

function getInactiveRowTranslateY(
  activeIndex: number,
  hoverIndex: number,
  index: number,
) {
  const activeRowMovedDown = activeIndex < hoverIndex;
  const rowIsBetweenDownMove = index > activeIndex && index <= hoverIndex;
  if (activeRowMovedDown && rowIsBetweenDownMove) return -ROW_STEP;

  const activeRowMovedUp = activeIndex > hoverIndex;
  const rowIsBetweenUpMove = index >= hoverIndex && index < activeIndex;
  if (activeRowMovedUp && rowIsBetweenUpMove) return ROW_STEP;

  return 0;
}

function moveItem(items: ComposerItem[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  if (!movedItem) return items;

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
