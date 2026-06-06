import type { LayoutChangeEvent } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useConvexMutation } from "@convex-dev/react-query";

import {
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
} from "@acme/config/posts";
import { api } from "@acme/convex/api";

import type { ComposerItem } from "../types";
import { useColor } from "~/hooks/use-color";
import { useMediaReorder } from "./use-media-reorder";
import { useUploadItem } from "./use-upload-item";

export function useCreateComposer() {
  const createPost = useConvexMutation(api.posts.create);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  const hasUploadingItems = items.some((item) => item.status === "uploading");
  const canPost =
    !isPosting &&
    !hasUploadingItems &&
    (items.length > 0 || caption.trim().length > 0);

  function updateItem(itemId: string, patch: Partial<ComposerItem>) {
    setItems((current) =>
      current.map((item) => patchItem({ item, itemId, patch })),
    );
  }
  const { uploadItem } = useUploadItem({ updateItem });
  const reorder = useMediaReorder({
    gridWidth,
    itemCount: items.length,
    setItems,
  });

  async function pickFiles() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images", "videos"],
      quality: 1,
    });
    if (result.canceled) return;

    setError(null);
    const validFiles = result.assets.filter(isAllowedFileSize);
    if (validFiles.length !== result.assets.length) {
      setError(`Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller.`);
    }
    setItems((current) => [...current, ...validFiles.map(createComposerItem)]);
    void Haptics.selectionAsync();
  }

  function removeItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
    void Haptics.selectionAsync();
  }

  function retryItem(item: ComposerItem) {
    updateItem(item.id, { error: undefined, status: "ready" });
  }

  async function publishPost() {
    setIsPosting(true);
    setError(null);
    try {
      const uploadedFiles = await Promise.all(items.map(uploadItem));
      await createPost({
        caption: caption.trim() || undefined,
        fileIds: uploadedFiles.map((file) => file._id),
      });
      setIsPosting(false);
      router.replace("/");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Post failed"));
      setIsPosting(false);
    }
  }

  function confirmPost() {
    Alert.alert("Post this update?", "It will appear on home and profile.", [
      { style: "cancel", text: "Cancel" },
      { onPress: () => void publishPost(), text: "Post" },
    ]);
  }

  return {
    activeDragItemId: reorder.activeDragItemId,
    beginReorder: reorder.beginReorder,
    canPost,
    caption,
    confirmPost,
    endReorder: reorder.endReorder,
    error,
    foreground,
    handleGridLayout: (event: LayoutChangeEvent) =>
      setGridWidth(event.nativeEvent.layout.width),
    hasUploadingItems,
    isPosting,
    items,
    mutedForeground,
    pickFiles,
    removeItem,
    retryItem,
    setCaption,
    updateReorder: reorder.updateReorder,
  };
}

function createComposerItem(file: ImagePicker.ImagePickerAsset) {
  return {
    file,
    id: `${Date.now()}-${Math.random()}`,
    status: "ready" as const,
  };
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  if (caughtError instanceof Error) return caughtError.message;

  return fallback;
}

function isAllowedFileSize(file: ImagePicker.ImagePickerAsset) {
  return (
    file.fileSize === undefined || file.fileSize <= POST_UPLOAD_MAX_SIZE_BYTES
  );
}

function patchItem({
  item,
  itemId,
  patch,
}: {
  item: ComposerItem;
  itemId: string;
  patch: Partial<ComposerItem>;
}) {
  if (item.id !== itemId) return item;

  return { ...item, ...patch };
}
