import type { ImagePickerAsset } from "expo-image-picker";

import type { UIFile } from "@acme/convex/files/types";

export type PickedFile = ImagePickerAsset;

export interface ComposerItem {
  id: string;
  file: PickedFile;
  status: "ready" | "uploading" | "uploaded" | "error";
  uploadedFile?: UIFile;
  error?: string;
}

export interface DragState {
  itemId: string;
  startIndex: number;
}
