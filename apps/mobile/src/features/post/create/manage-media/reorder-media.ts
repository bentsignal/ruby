import type { ComposerItem } from "../types";

export function getMediaTitle(item: ComposerItem) {
  if (item.file.fileName) {
    return item.file.fileName;
  }

  return getMediaTypeLabel(item);
}

export function getMediaTypeLabel(item: ComposerItem) {
  if (item.file.type === "video") {
    return "Video";
  }

  return "Photo";
}

export function moveItems(
  items: ComposerItem[],
  sourceIndices: number[],
  destination: number,
) {
  const sourceIndex = sourceIndices[0];
  if (sourceIndex === undefined) return items;

  return moveItem(
    items,
    sourceIndex,
    getAdjustedDestination({
      destination,
      sourceIndex,
    }),
  );
}

export function moveItem(
  items: ComposerItem[],
  fromIndex: number,
  toIndex: number,
) {
  if (fromIndex === toIndex) return items;

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  if (!movedItem) return items;

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function deleteItems(items: ComposerItem[], indices: number[]) {
  const indicesToDelete = new Set(indices);
  return items.filter((_, index) => !indicesToDelete.has(index));
}

export function deferReplaceItems(
  replaceItems: (nextItems: ComposerItem[]) => void,
  nextItems: ComposerItem[],
) {
  setTimeout(() => replaceItems(nextItems), 0);
}

function getAdjustedDestination({
  destination,
  sourceIndex,
}: {
  destination: number;
  sourceIndex: number;
}) {
  if (sourceIndex < destination) {
    return destination - 1;
  }

  return destination;
}
