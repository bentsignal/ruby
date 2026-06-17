import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import type { ResolvedLocation } from "@acme/convex/places/types";
import {
  POST_UPLOAD_BLOCKED_CONTENT_TYPES,
  POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH,
  POST_UPLOAD_FILE_NAME_MAX_LENGTH,
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
} from "@acme/config/posts";
import { api } from "@acme/convex/api";
import { getDisplayErrorMessage } from "@acme/std/display-error";

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
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const { resetComposer, resetKey } = useComposerReset({
    setCaptionState,
    setError,
    setItems,
    setLocation,
  });

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
        location: createPostLocation(location),
      });
      resetComposer();
      setIsPosting(false);
      router.replace("/home");
    } catch (caughtError) {
      setError(getDisplayErrorMessage(caughtError, "Post failed"));
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
    location,
    mutedForeground,
    pickFiles: () => pickComposerFiles({ setError, setItems }),
    replaceItems,
    resetKey,
    removeItem,
    retryItem,
    clearLocation: () => setLocation(null),
    setCaption,
    setCaptionDraft,
    setError,
    setLocation,
  };
}

function createPostLocation(location: ResolvedLocation | null) {
  if (!location) return undefined;

  return {
    googlePlaceId: location.googlePlaceId,
    name: location.name,
    provider: location.provider,
    ...(location.formattedAddress
      ? { formattedAddress: location.formattedAddress }
      : {}),
    ...(location.latitude === undefined ? {} : { latitude: location.latitude }),
    ...(location.longitude === undefined
      ? {}
      : { longitude: location.longitude }),
  };
}

function createComposerItem(file: ImagePicker.ImagePickerAsset) {
  return {
    file,
    id: `${Date.now()}-${Math.random()}`,
    status: "ready" as const,
  };
}

async function pickComposerFiles({
  setError,
  setItems,
}: {
  setError: (error: string | null) => void;
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
}) {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    mediaTypes: ["images"],
    quality: 1,
  });
  if (result.canceled) return;

  setError(null);
  const validFiles = result.assets.filter(isAllowedFile);
  if (validFiles.length !== result.assets.length) {
    setError(getFileValidationError());
  }
  setItems((current) => [...current, ...validFiles.map(createComposerItem)]);
  void Haptics.selectionAsync();
}

function useComposerReset({
  setCaptionState,
  setError,
  setItems,
  setLocation,
}: {
  setCaptionState: (caption: string) => void;
  setError: (error: string | null) => void;
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
  setLocation: (location: ResolvedLocation | null) => void;
}) {
  const [resetKey, setResetKey] = useState(0);

  function resetComposer() {
    resetCaptionDraft();
    setItems([]);
    setCaptionState("");
    setError(null);
    setLocation(null);
    setResetKey((current) => current + 1);
  }

  return { resetComposer, resetKey };
}

function isAllowedFileSize(file: ImagePicker.ImagePickerAsset) {
  return (
    file.fileSize === undefined || file.fileSize <= POST_UPLOAD_MAX_SIZE_BYTES
  );
}

function isAllowedFileMetadata(file: ImagePicker.ImagePickerAsset) {
  const contentType = normalizeContentType(file.mimeType);
  if (
    file.fileName &&
    file.fileName.length > POST_UPLOAD_FILE_NAME_MAX_LENGTH
  ) {
    return false;
  }
  if (
    contentType &&
    (contentType.length > POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH ||
      POST_UPLOAD_BLOCKED_CONTENT_TYPES.some((type) => type === contentType))
  ) {
    return false;
  }
  return true;
}

function normalizeContentType(contentType: string | undefined) {
  return contentType?.split(";")[0]?.trim().toLowerCase();
}

function isAllowedFile(file: ImagePicker.ImagePickerAsset) {
  return isAllowedFileSize(file) && isAllowedFileMetadata(file);
}

function getFileValidationError() {
  return `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller and must be supported photos.`;
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
