import { useState } from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import { GripVertical, Trash2 } from "lucide-react-native";

import type { ComposerItem } from "../../types";
import { MediaPreview } from "../../components/media-preview";
import { useManageMediaStore } from "../store";

const ROW_HEIGHT = 92;
const ROW_GAP = 12;
const ROW_STEP = ROW_HEIGHT + ROW_GAP;

export function ManageMediaList() {
  const items = useManageMediaStore((store) => store.orderedItems);

  return (
    <View className="flex-1 px-4 py-4">
      {items.map((item, index) => (
        <ManageMediaRow index={index} item={item} key={item.id} />
      ))}
    </View>
  );
}

function ManageMediaRow({
  index,
  item,
}: {
  index: number;
  item: ComposerItem;
}) {
  const [dragY] = useState(() => new Animated.Value(0));
  const activeIndex = useManageMediaStore((store) => store.activeIndex);
  const activeItemId = useManageMediaStore((store) => store.activeItemId);
  const finishDrag = useManageMediaStore((store) => store.finishDrag);
  const foreground = useManageMediaStore((store) => store.foreground);
  const hoverIndex = useManageMediaStore((store) => store.hoverIndex);
  const itemCount = useManageMediaStore((store) => store.itemCount);
  const deleteItem = useManageMediaStore((store) => store.deleteItem);
  const startDrag = useManageMediaStore((store) => store.startDrag);
  const updateHoverIndex = useManageMediaStore(
    (store) => store.updateHoverIndex,
  );
  const isActive = activeItemId === item.id;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      dragY.setValue(0);
      startDrag(item.id, index);
    },
    onPanResponderMove: (_, gesture) => {
      dragY.setValue(gesture.dy);
      updateHoverIndex(
        clamp(index + Math.round(gesture.dy / ROW_STEP), 0, itemCount - 1),
      );
    },
    onPanResponderRelease: () => {
      dragY.setValue(0);
      finishDrag();
    },
    onPanResponderTerminate: () => {
      dragY.setValue(0);
      finishDrag();
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
        <Pressable
          className="h-full w-12 items-center justify-center rounded-md"
          onPress={() => deleteItem(item.id)}
        >
          <Trash2 className="size-5" color={foreground} />
        </Pressable>
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
