import { useRef, useState } from "react";
import { createStore } from "rostra";

import type { ComposerItem } from "../types";
import { useSafeAreaInsets } from "~/components/safe-area-view";
import { useCreateStore } from "../store";
import {
  deferReplaceItems,
  deleteItems,
  moveItem,
  moveItems,
} from "./reorder-media";

function useInternalStore() {
  const insets = useSafeAreaInsets();
  const foreground = useCreateStore((store) => store.foreground);
  const items = useCreateStore((store) => store.items);
  const replaceItems = useCreateStore((store) => store.replaceItems);
  const [isVisible, setIsVisible] = useState(false);
  const [orderedItems, setOrderedItems] = useState<ComposerItem[]>(items);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndexRef = useRef(0);
  const hoverIndexRef = useRef(0);

  function openModal() {
    setOrderedItems(items);
    setIsVisible(true);
  }

  function closeModal() {
    setIsVisible(false);
  }

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

  return {
    activeIndex,
    activeItemId,
    closeModal,
    deleteItem,
    finishDrag,
    foreground,
    handleDelete,
    handleMove,
    hoverIndex,
    insets,
    isVisible,
    itemCount: orderedItems.length,
    items,
    openModal,
    orderedItems,
    startDrag,
    updateHoverIndex,
  };
}

export const { Store: ManageMediaStore, useStore: useManageMediaStore } =
  createStore(useInternalStore);
