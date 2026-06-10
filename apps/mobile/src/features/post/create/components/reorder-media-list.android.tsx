import { useState } from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import { GripVertical, Trash2 } from "lucide-react-native";

import type { ComposerItem } from "../types";
import { MediaPreview } from "./media-preview";

const ROW_HEIGHT = 92;
const ROW_GAP = 12;
const ROW_STEP = ROW_HEIGHT + ROW_GAP;

export function ManageMediaList({
  activeIndex,
  activeItemId,
  foreground,
  hoverIndex,
  itemCount,
  items,
  onDragFinish,
  onDragStart,
  onItemDelete,
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
  onItemDelete: (itemId: string) => void;
  onHoverIndexChange: (index: number) => void;
}) {
  return (
    <View className="flex-1 px-4 py-4">
      {items.map((item, index) => (
        <ManageMediaRow
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
          onItemDelete={onItemDelete}
          onHoverIndexChange={onHoverIndexChange}
        />
      ))}
    </View>
  );
}

function ManageMediaRow({
  activeIndex,
  activeItemId,
  foreground,
  hoverIndex,
  index,
  item,
  itemCount,
  onDragFinish,
  onDragStart,
  onItemDelete,
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
  onItemDelete: (itemId: string) => void;
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
        <Pressable
          className="h-full w-12 items-center justify-center rounded-md"
          onPress={() => onItemDelete(item.id)}
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
