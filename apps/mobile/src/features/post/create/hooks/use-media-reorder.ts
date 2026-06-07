import type { Dispatch, SetStateAction } from "react";
import type { PanResponderGestureState } from "react-native";
import { useRef, useState } from "react";
import * as Haptics from "expo-haptics";

import type { ComposerItem, DragState } from "../types";
import { reorderItems } from "../utils/reorder-items";

const GRID_COLUMNS = 2;
const TILE_VERTICAL_GAP = 12;

export function useMediaReorder({
  gridWidth,
  itemCount,
  setItems,
}: {
  gridWidth: number;
  itemCount: number;
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
}) {
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  function beginReorder(itemId: string, index: number) {
    dragStateRef.current = { itemId, startIndex: index };
    setActiveDragItemId(itemId);
    void Haptics.selectionAsync();
  }

  function updateReorder(gestureState: PanResponderGestureState) {
    const dragState = dragStateRef.current;
    const targetIndex = getTargetIndex({
      dragState,
      gestureState,
      gridWidth,
      itemCount,
    });
    if (targetIndex === null || !dragState) return;

    setItems((current) => reorderItems(current, dragState.itemId, targetIndex));
  }

  function endReorder() {
    dragStateRef.current = null;
    setActiveDragItemId(null);
    void Haptics.selectionAsync();
  }

  return {
    activeDragItemId,
    beginReorder,
    endReorder,
    updateReorder,
  };
}

function getTargetIndex({
  dragState,
  gestureState,
  gridWidth,
  itemCount,
}: {
  dragState: DragState | null;
  gestureState: PanResponderGestureState;
  gridWidth: number;
  itemCount: number;
}) {
  if (!dragState || gridWidth <= 0) return null;

  const tileWidth = gridWidth / GRID_COLUMNS;
  const tileHeight = tileWidth * 1.25 + TILE_VERTICAL_GAP;
  const startRow = Math.floor(dragState.startIndex / GRID_COLUMNS);
  const startColumn = dragState.startIndex % GRID_COLUMNS;
  const targetRow = Math.max(
    0,
    Math.round((startRow * tileHeight + gestureState.dy) / tileHeight),
  );
  const targetColumn = Math.min(
    GRID_COLUMNS - 1,
    Math.max(
      0,
      Math.round((startColumn * tileWidth + gestureState.dx) / tileWidth),
    ),
  );

  return Math.min(itemCount - 1, targetRow * GRID_COLUMNS + targetColumn);
}
