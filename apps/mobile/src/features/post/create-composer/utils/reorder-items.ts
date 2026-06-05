import type { ComposerItem } from "../types";

export function reorderItems(
  items: ComposerItem[],
  itemId: string,
  targetIndex: number,
) {
  const fromIndex = items.findIndex((item) => item.id === itemId);
  if (fromIndex < 0 || fromIndex === targetIndex) return items;

  const next = [...items];
  const [movedItem] = next.splice(fromIndex, 1);
  if (!movedItem) return items;

  next.splice(targetIndex, 0, movedItem);
  return next;
}
