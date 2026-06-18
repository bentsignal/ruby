import type { ComposerItem } from "../types";

export function isPreviewableImage(item: ComposerItem) {
  return item.file.type !== "video";
}
