import { useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import {
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
} from "@acme/config/posts";
import { api } from "@acme/convex/api";

import type { ComposerItem } from "./types";
import { useColor } from "~/hooks/use-color";
import { useUploadItem } from "./hooks/use-upload-item";

let captionDraft = "";

function readCaptionDraft() {
  return captionDraft;
}

function resetCaptionDraft() {
  captionDraft = "";
}

function writeCaptionDraft(nextCaption: string) {
  captionDraft = nextCaption;
}

function useInternalStore() {
  const createPost = useConvexMutation(api.posts.mutations.create);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaptionState] = useState(() => {
    captionDraft = "";
    return "";
  });
  const [error, setError] = useState<string | null>(null);
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

  function setCaption(nextCaption: string) {
    writeCaptionDraft(nextCaption);
    setCaptionState(nextCaption);
  }

  function setCaptionDraft(nextCaption: string) {
    writeCaptionDraft(nextCaption);
  }

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

  function replaceItems(nextItems: ComposerItem[]) {
    setItems(nextItems);
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
      const latestCaption = readCaptionDraft().trim();
      await createPost({
        caption: latestCaption || undefined,
        fileIds: uploadedFiles.map((file) => file._id),
      });
      resetCaptionDraft();
      setIsPosting(false);
      router.replace("/home");
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
    canPost,
    caption,
    confirmPost,
    error,
    foreground,
    hasUploadingItems,
    isPosting,
    items,
    mutedForeground,
    pickFiles,
    replaceItems,
    removeItem,
    retryItem,
    setCaption,
    setCaptionDraft,
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

export const { Store: CreateStore, useStore: useCreateStore } =
  createStore(useInternalStore);

export function useComposerItem(itemId: string) {
  return useCreateStore((store) =>
    store.items.find((item) => item.id === itemId),
  );
}
