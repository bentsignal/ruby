import { useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import type { ResolvedLocation } from "@acme/convex/places/types";
import { api } from "@acme/convex/api";
import { getDisplayErrorMessage } from "@acme/std/display-error";

import type { ComposerItem } from "./types";
import { useColor } from "~/hooks/use-color";
import { useComposerReset } from "./hooks/use-composer-reset";
import { useUploadItem } from "./hooks/use-upload-item";
import {
  readCaptionDraft,
  resetCaptionDraft,
  writeCaptionDraft,
} from "./lib/caption-draft";
import { pickComposerFiles } from "./lib/pick-composer-files";
import { createPostLocation } from "./lib/post-location";

function useInternalStore() {
  const createPost = useConvexMutation(api.posts.mutations.create);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaptionState] = useState(() => {
    resetCaptionDraft();
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
